# Guía de Instalación e Integración de OmniRoute para Aysén Sistémico

OmniRoute (`https://github.com/cheaper-inference/OmniRoute`) es el motor unificado de inferencia de inteligencia artificial para Aysén Sistémico. Proporciona una pasarela compatible con OpenAI (`/v1/chat/completions`) que orquesta más de 375 proveedores de modelos de lenguaje (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Kimi, Groq, Mistral, entre otros) con enrutamiento inteligente por cascada, compresión de contexto y auto-fallback según cuotas.

En Aysén Sistémico, OmniRoute opera bajo el principio de **Mundo Cerrado Estricto (Closed-World Grounding)**:
1. El modelo solo puede responder utilizando datos y series verificadas de `window.AYSEN_HUBS_DATA` y las 28 fuentes oficiales de la plataforma.
2. Si se consulta por un dato inexistente en el catálogo, debe declarar explícitamente que no forma parte de las 28 fuentes oficiales y sugerir las variables territoriales más cercanas.
3. Devuelve siempre un esquema estructurado JSON para renderizar respuestas, citas institucionales y especificaciones de gráficos en tiempo real.

---

## 1. Opciones de Despliegue de OmniRoute

OmniRoute expone un endpoint estándar compatible con la API de OpenAI en `http://localhost:20128/v1/chat/completions`.

### Opción A: Servicio Local con el Script Automatizado (Recomendada)

El repositorio incluye los scripts de arranque rápido preparados:

- En Linux / macOS / WSL:
  ```bash
  bash scripts/start_omniroute.sh
  ```

- En Windows (PowerShell):
  ```powershell
  .\scripts\start_omniroute.ps1
  ```

Estos scripts leen el archivo `.env.omniroute` (o usan los valores por defecto de `.env.omniroute.example`), verifican las dependencias en `.omniroute_service/` o mediante `npx omniroute`, y levantan el servicio en el puerto `20128`.

### Opción B: Ejecución Rápida sin Clonar (npx)

Si tienes Node.js 22+ instalado:
```bash
npx omniroute start --port 20128
```

### Opción C: Contenedor Docker

Para entornos aislados o servidores Linux:
```bash
docker run -d \
  --name aysen-omniroute \
  -p 20128:20128 \
  --env-file .env.omniroute \
  diegosouzapw/omniroute:latest
```

### Opción D: Despliegue en la Nube (VPS, Railway o Render)

Puedes desplegar la imagen Docker o el repositorio en un VPS (Ubuntu 22.04/24.04), Railway, Render o Hugging Face Spaces:
1. Configura el puerto de escucha en `20128` (o la variable `$PORT`).
2. Define la variable de entorno `OMNIROUTE_API_KEY` para proteger el endpoint.
3. Configura tus claves de proveedores (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, etc.).
4. Obtén la URL pública HTTPS asignada (ejemplo: `https://omniroute-aysen.tu-dominio.com/v1`).

---

## 2. Configuración de Variables de Entorno (`.env.omniroute`)

Copia el archivo de plantilla a tu entorno local:
```bash
cp .env.omniroute.example .env.omniroute
```

Variables disponibles:
- `OMNIROUTE_PORT`: Puerto de escucha local (por defecto `20128`).
- `OMNIROUTE_API_KEY`: Token de portador (Bearer) para asegurar el endpoint.
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY`: Claves de API según los proveedores que desees activar.
- `OMNIROUTE_DEFAULT_MODEL`: Modelo o estrategia de resolución (`auto`, `auto/cheap`, `auto/fast`, `auto/coding`).
- `OMNIROUTE_COMPRESSION`: `true` para activar el filtro de compresión RTK + Caveman.

---

## 3. Conexión desde el Consultor de Datos (`consultor.html`)

En `consultor.html`:
1. Haz clic en el botón superior **"Configurar conexión OmniRoute"**.
2. Ingresa la URL del endpoint (por defecto `http://localhost:20128/v1` o tu endpoint en la nube).
3. Ingresa tu API Key (por defecto `sk-omniroute-aysen-local` para entorno local).
4. Selecciona la estrategia de modelo (`auto`, `auto/cheap`, `auto/fast`, etc.).
5. La configuración se guarda de forma persistente y segura en tu navegador (`localStorage`).

Si el servicio OmniRoute no se encuentra activo en el momento de una consulta, el cliente integrado `js/omniroute_client.js` ejecuta un solucionador determinista de reserva (fallback offline) directo sobre `window.AYSEN_HUBS_DATA`, asegurando que las consultas sugeridas y la exploración de datos territoriales nunca queden bloqueadas.

---

## 4. Contrato de Respuesta Estructurada

Cada petición enviada a OmniRoute utiliza un System Prompt que restringe la respuesta al siguiente esquema JSON:

```json
{
  "reply": "Respuesta clara y analítica con datos exactos y citas formales entre paréntesis...",
  "sources": [
    {
      "institucion": "SUBDERE - SINIM",
      "indicador": "Dependencia del Fondo Común Municipal (%)",
      "url": "https://datos.sinim.gov.cl"
    }
  ],
  "chart": {
    "render": true,
    "type": "bar",
    "varX": "dependencia_fcm_pct",
    "varY": "ingresos_propios_pct",
    "title": "Dependencia FCM vs Ingresos Propios por Comuna",
    "excludeCoyhaique": false
  },
  "relatedHub": "IV"
}
```

Este esquema es interpretado de inmediato por el panel derecho de `consultor.html` para renderizar el gráfico en Chart.js, la tabla de valores comunales y el enlace de apertura en el Laboratorio Sistémico.
