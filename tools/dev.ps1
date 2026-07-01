# Local GamerLeech static site
# Usage: powershell -File tools\dev.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Port = 8080

Set-Location (Join-Path $Root "netlify-deploy")
Write-Host "GamerLeech — http://localhost:$Port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
python -m http.server $Port
