# LingMa Service Keepalive Script
$projectPath = "E:\project\tumafang"
$checkInterval = 30

if (-not $env:AI_API_KEY) {
    if (-not $env:LINGMA_AI_API_KEY) {
        throw "Missing AI_API_KEY or LINGMA_AI_API_KEY"
    }
    $env:AI_API_KEY = $env:LINGMA_AI_API_KEY
}
if (-not $env:AI_API_URL) {
    $env:AI_API_URL = if ($env:LINGMA_AI_API_URL) { $env:LINGMA_AI_API_URL } else { "https://openrouter.ai/api/v1/chat/completions" }
}
if (-not $env:AI_MODEL) {
    $env:AI_MODEL = if ($env:LINGMA_AI_MODEL) { $env:LINGMA_AI_MODEL } else { "openrouter/auto" }
}

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
