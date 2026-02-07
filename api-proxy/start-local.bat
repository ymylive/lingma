@echo off
if "%AI_API_KEY%"=="" set AI_API_KEY=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
if "%AI_BASE_URL%"=="" set AI_BASE_URL=https://openrouter.ai/api/v1
if "%AI_MODEL%"=="" set AI_MODEL=openrouter/auto
if "%AI_SITE_URL%"=="" set AI_SITE_URL=http://127.0.0.1:5173
if "%AI_SITE_NAME%"=="" set AI_SITE_NAME=LingMa
node server.js
