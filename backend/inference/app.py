import asyncio
import hashlib
import hmac
import io
import os
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import urlopen

from fastai.learner import load_learner
from fastai.vision.core import PILImage
from fastapi import FastAPI, HTTPException, Request
from PIL import Image, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

MAX_BYTES = 5 * 1024 * 1024
MODEL_HASH = "c9dde01168660bd244fc231b5a97edaad72be6c001a11e8a0900373057d85262"
LABELS = ["withNP", "withoutNP"]
token = os.environ["INFERENCE_TOKEN"]
if not token:
    raise RuntimeError("INFERENCE_TOKEN must be set")

checkpoint = Path(os.environ.get("MODEL_PATH", "/tmp/pocketscope-model.pkl"))
if not checkpoint.exists():
    model_url = os.environ["MODEL_URL"]
    if urlsplit(model_url).scheme != "https":
        raise RuntimeError("MODEL_URL must use HTTPS")
    with urlopen(model_url, timeout=60) as response, checkpoint.open("wb") as output:
        payload = response.read(47_047_943)
        if hashlib.sha256(payload).hexdigest() != MODEL_HASH:
            raise RuntimeError("Unexpected model checksum")
        output.write(payload)
with checkpoint.open("rb") as model_file:
    if hashlib.file_digest(model_file, "sha256").hexdigest() != MODEL_HASH:
        raise RuntimeError("Unexpected model checksum")
model = load_learner(checkpoint, cpu=True)
if list(model.dls.vocab) != LABELS:
    raise RuntimeError("Unexpected model labels")

app = FastAPI()
prediction_lock = asyncio.Lock()


@app.get("/readyz")
def ready():
    return {"status": "ready"}


def predict(data):
    with Image.open(io.BytesIO(data)) as image:
        if image.format not in {"JPEG", "PNG"} or image.width * image.height > 20_000_000 or getattr(image, "n_frames", 1) != 1:
            raise ValueError("Unsupported image")
        sample = PILImage.create(image.convert("RGB"))
    label, _, probabilities = model.predict(sample)
    return {
        "label": str(label),
        "scores": dict(zip(LABELS, map(float, probabilities), strict=True)),
        "modelVersion": "nasal-polyp-resnet18-c9dde011",
    }


@app.post("/v1/screen")
async def screen(request: Request):
    if not hmac.compare_digest(request.headers.get("authorization", "").encode(), f"Bearer {token}".encode()):
        raise HTTPException(401, "Unauthorized")
    data = bytearray()
    async for chunk in request.stream():
        if len(data) + len(chunk) > MAX_BYTES:
            raise HTTPException(413, "Image too large")
        data.extend(chunk)
    if prediction_lock.locked():
        raise HTTPException(429, "Inference busy")
    async with prediction_lock:
        try:
            return await run_in_threadpool(predict, data)
        except (UnidentifiedImageError, Image.DecompressionBombError, OSError, ValueError):
            raise HTTPException(422, "Invalid or unsupported image")
