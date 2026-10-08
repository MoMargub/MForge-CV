FROM python:3.10-slim

WORKDIR /app

# ── Python dependencies ───────────────────────────────────────────────────────
# Copy requirements FIRST. pip install is cached until requirements.txt changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Application source ────────────────────────────────────────────────────────
# Changing app code only invalidates THIS layer, NOT pip install above.
COPY ./app /app/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
