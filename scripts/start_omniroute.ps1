# ==============================================================================
# Script de arranque para el motor de inferencia OmniRoute (Aysén Sistémico) - PowerShell
# ==============================================================================
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

$Port = if ($env:OMNIROUTE_PORT) { $env:OMNIROUTE_PORT } else { "20128" }

Write-Host "======================================================================"
Write-Host " Invocando Servicio OmniRoute para Aysen Sistemico"
Write-Host " Endpoint OpenAI-compatible: http://localhost:$Port/v1/chat/completions"
Write-Host "======================================================================"

if (Test-Path ".omniroute_service") {
  Set-Location ".omniroute_service"
  if (-not (Test-Path "node_modules")) {
    Write-Host "[OmniRoute] Instalando dependencias en .omniroute_service/..."
    npm install --omit=dev --no-audit --no-fund
  }
  Write-Host "[OmniRoute] Iniciando servidor en puerto $Port..."
  $env:PORT = $Port
  npm start
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
  Write-Host "[OmniRoute] Levantando mediante npx omniroute en puerto $Port..."
  $env:PORT = $Port
  npx omniroute start
} elseif (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Host "[OmniRoute] Levantando contenedor Docker diegosouzapw/omniroute..."
  docker run -p "${Port}:20128" -e PORT=20128 diegosouzapw/omniroute
} else {
  Write-Error "[OmniRoute] Error: Node.js/npx ni Docker estan instalados en PATH."
}
