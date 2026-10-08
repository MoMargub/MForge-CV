param(
    [switch]$Build,
    [switch]$Down,
    [switch]$Logs
)

# Stop
if ($Down) {
    Write-Host "Stopping Resume Builder..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "Stopped." -ForegroundColor Green
    exit 0
}

# Logs
if ($Logs) {
    docker-compose logs -f
    exit 0
}

# Check if images exist
$appImage = docker images -q resume-builder-app:latest 2>$null
$apiImage = docker images -q resume-builder-api:latest 2>$null
$imagesExist = ($null -ne $appImage -and $appImage -ne "") -and ($null -ne $apiImage -and $apiImage -ne "")

# Decide whether to build
if ($Build) {
    Write-Host ""
    Write-Host "[BUILD] Force rebuild requested..." -ForegroundColor Cyan
    Write-Host "        npm install / pip install will run only if package files changed." -ForegroundColor DarkGray
    docker-compose up --build -d
} elseif (-not $imagesExist) {
    Write-Host ""
    Write-Host "[FIRST RUN] Images not found - building for the first time..." -ForegroundColor Cyan
    Write-Host "            This only happens once. Future starts will be instant." -ForegroundColor DarkGray
    docker-compose up --build -d
} else {
    Write-Host ""
    Write-Host "[START] Images already built - starting instantly (no reinstall)..." -ForegroundColor Green
    docker-compose up -d
}

# Show status
Start-Sleep -Seconds 2
Write-Host ""
Write-Host "-----------------------------------------" -ForegroundColor DarkGray
Write-Host "  Resume Builder Status" -ForegroundColor White
Write-Host "-----------------------------------------" -ForegroundColor DarkGray
docker ps --format "  {{.Names}}: {{.Status}}"
Write-Host ""
Write-Host "  Frontend  -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API       -> http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs  -> http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Tip: .\start.ps1 -Logs to stream live logs" -ForegroundColor DarkGray
Write-Host "       .\start.ps1 -Down to stop" -ForegroundColor DarkGray
Write-Host "-----------------------------------------" -ForegroundColor DarkGray
Write-Host ""
