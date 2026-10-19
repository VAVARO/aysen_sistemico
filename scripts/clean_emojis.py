#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

path = 'mapa_territorial.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    '🏛️ Vista Comunal (10)': 'Vista Comunal (10)',
    '📡 Sensores Físicos (16)': 'Sensores Físicos (16)',
    '🗺️ Integrada': 'Vista Integrada',
    '🎯 Pregunta de Decisión': 'Pregunta de Decisión',
    '<span id="crossAlertIcon" style="font-size: 15px; line-height: 1.2;">⚠️</span>': '<span id="crossAlertIcon" style="font-size: 15px; line-height: 1.2; font-family: monospace; font-weight: bold;">[!]</span>',
    '📥 Descargar Comparación': 'Descargar Comparación',
    '🏛️ Microdatos de las 10': 'Microdatos de las 10',
    '📈 18 Series Estratégicas': '18 Series Estratégicas',
    '📡 Telemetría Completa 16': 'Telemetría Completa 16',
    '⚖️ Dilemas Territoriales': 'Dilemas Territoriales',
    'icon: "❄️"': 'icon: "CLI"',
    'icon: "🧊"': 'icon: "CRI"',
    'icon: "🌊"': 'icon: "MAR"',
    'icon: "🛣️"': 'icon: "CON"',
    "cross.alertInfo.icon || '⚠️'": "cross.alertInfo.icon || '!'",
    '<span>❄️</span>': '<span>●</span>'
}

for old, new in replacements.items():
    text = text.replace(old, new)

EMOJI_REGEX = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]')
text = EMOJI_REGEX.sub('', text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('[OK] mapa_territorial.html cleaned of all emojis')
