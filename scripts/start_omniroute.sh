#!/usr/bin/env bash
# ==============================================================================
# Script de arranque para el motor de inferencia OmniRoute (Aysén Sistémico)
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

# Cargar variables de entorno si existen
if [ -f ".env.omniroute" ]; then
  echo "[OmniRoute] Cargando configuracion desde .env.omniroute..."
  export $(grep -v '^#' .env.omniroute | xargs)
elif [ -f ".env.omniroute.example" ] && [ ! -f ".env.omniroute" ]; then
  echo "[OmniRoute] Aviso: .env.omniroute no encontrado. Usando defaults de .env.omniroute.example."
fi

PORT="${OMNIROUTE_PORT:-20128}"
HOST="${OMNIROUTE_HOST:-0.0.0.0}"

echo "======================================================================"
echo " Invocando Servicio OmniRoute para Aysen Sistemico"
echo " Endpoint OpenAI-compatible: http://localhost:${PORT}/v1/chat/completions"
echo "======================================================================"

if [ -d ".omniroute_service" ]; then
  cd .omniroute_service
  if [ ! -d "node_modules" ]; then
    echo "[OmniRoute] Instalando dependencias en .omniroute_service/..."
    npm install --omit=dev --no-audit --no-fund
  fi
  echo "[OmniRoute] Iniciando servidor en puerto ${PORT}..."
  PORT="${PORT}" npm start
elif command -v npx >/dev/null 2>&1; then
  echo "[OmniRoute] Levantando mediante npx omniroute en puerto ${PORT}..."
  PORT="${PORT}" npx omniroute start
elif command -v docker >/dev/null 2>&1; then
  echo "[OmniRoute] Levantando contenedor Docker diegosouzapw/omniroute..."
  docker run -p "${PORT}:20128" -e PORT=20128 diegosouzapw/omniroute
else
  echo "[OmniRoute] Error: Node.js/npx ni Docker estan instalados en PATH."
  exit 1
fi
