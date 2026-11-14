# Nose inference

Deploy this directory as a Docker web service on Render. Set the health check path to `/readyz`. Set `MODEL_URL` to an HTTPS download URL for the supplied `nasal_polyp_resnet18.pkl` or set `MODEL_PATH` to the path of an existing file in the container. Set `INFERENCE_TOKEN` as a secret. The artifact is not tracked in Git. Startup checks the exact supplied SHA-256 before loading the FastAI export and checks the expected class vocabulary.

Set `INFERENCE_URL` to the HTTPS Render origin and `INFERENCE_TOKEN` to the matching Worker secret, then deploy `pscope-api`. The Worker sends the image as the raw body to `POST /v1/screen`. Nose requests return prototype model scores for `withNP` and `withoutNP`. Throat requests still return the existing stub. Use training images.
