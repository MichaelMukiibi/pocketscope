FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir torch==2.8.0 torchvision==0.23.0 --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir fastai==2.8.5 fastapi==0.116.1 uvicorn==0.35.0
COPY app.py .
RUN useradd --system inference
USER inference
CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
