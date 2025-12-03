# LingMa Service Keepalive Script
$projectPath = "E:\project\tumafang"
$checkInterval = 30

$env:AI_API_KEY = "sk-vJy5jCgbzjksuW1njIbymPABzjK4UkuIVT3fD7MNLmmY570R"
$env:AI_API_URL = "https://api.aabao.top/v1/chat/completions"
$env:AI_MODEL = "deepseek-v3.2-exp-thinking"

function Write-Log { param($Message); Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" }
function Test-Port { param($Port); return $null -ne (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) }
function Start-AIProxy { Write-Log "Starting AI Proxy..."; Start-Process node -ArgumentList "server.js" -WorkingDirectory "$projectPath\api-proxy" -WindowStyle Hidden }
function Start-Frontend { Write-Log "Starting Frontend..."; Start-Process cmd -ArgumentList "/c npm run dev" -WorkingDirectory $projectPath -WindowStyle Hidden }

Write-Log "=== LingMa Keepalive Started ==="

while ($true) {
    if (-not (Test-Port 3001)) { Write-Log "[!] AI Proxy down, restarting..."; Start-AIProxy; Start-Sleep 3 }
    if (-not (Test-Port 5173)) { Write-Log "[!] Frontend down, restarting..."; Start-Frontend; Start-Sleep 5 }
    if ((Test-Port 3001) -and (Test-Port 5173)) { Write-Log "[OK] All services running" }
    Start-Sleep $checkInterval
}
