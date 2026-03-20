FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY api-proxy/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api-proxy/main.py ./
COPY api-proxy/app_modules ./app_modules

EXPOSE 3001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
