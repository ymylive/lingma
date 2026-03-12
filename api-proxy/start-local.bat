@echo off
if "%AI_API_KEY%"=="" if "%LINGMA_AI_API_KEY%"=="" (
  echo Missing AI_API_KEY or LINGMA_AI_API_KEY
  exit /b 1
) else (
  set AI_API_KEY=%LINGMA_AI_API_KEY%
)
if "%AI_BASE_URL%"=="" if not "%LINGMA_AI_API_URL%"=="" set AI_BASE_URL=%LINGMA_AI_API_URL%
if "%AI_BASE_URL%"=="" set AI_BASE_URL=https://openrouter.ai/api/v1
if "%AI_MODEL%"=="" if not "%LINGMA_AI_MODEL%"=="" set AI_MODEL=%LINGMA_AI_MODEL%
if "%AI_MODEL%"=="" set AI_MODEL=openrouter/auto
if "%AI_SITE_URL%"=="" set AI_SITE_URL=http://127.0.0.1:5173
if "%AI_SITE_NAME%"=="" set AI_SITE_NAME=LingMa
python -m uvicorn main:app --host 127.0.0.1 --port 3001
