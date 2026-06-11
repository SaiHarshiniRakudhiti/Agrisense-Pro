FROM python:3.11-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS production
COPY . .
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s CMD python -c "import httpx; httpx.get('http://localhost:8000/health')"
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port \${PORT:-8000} --workers 2 --log-level info"]
