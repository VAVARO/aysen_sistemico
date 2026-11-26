#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
non_destructive_merge.py - Helper de escritura no destructiva para scripts/ingesta/wp_*.py.

Principio:
  Los scripts wp_01..wp_11 NO deben sobrescribir ni borrar variables existentes en
  data/systemic/*.json (como las variables del Sprint 4 o curaciones posteriores) con
  diccionarios Python hardcodeados.

  `save_systemic_json_non_destructive(target_path, generated_payload, live_overrides=None)`
  conserva intactos todos los valores ya presentes en disco, agrega únicamente claves
  faltantes desde `generated_payload`, y solo actualiza campos explícitamente provistos
  en `live_overrides` (provenientes de un conector live_api verificado).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

KEY_FIELDS: Sequence[str] = (
    "id",
    "holding_id",
    "codigo_acs",
    "comuna_ine",
    "codigo_comuna",
    "nombre",
    "nombre_comuna",
)


def _item_key(item: Any) -> Optional[str]:
    if not isinstance(item, dict):
        return None
    for k in KEY_FIELDS:
        v = item.get(k)
        if v is not None and str(v).strip():
            return f"{k}:{str(v).strip()}"
    return None


def deep_merge_preserve_existing(existing: Any, generated: Any) -> Any:
    """Combina `generated` sobre `existing` preservando TODOS los valores ya existentes."""
    if existing is None:
        return generated
    if isinstance(existing, dict) and isinstance(generated, dict):
        merged: Dict[str, Any] = {}
        # Conservar primero todas las claves existentes
        for k, v in existing.items():
            if k in generated:
                merged[k] = deep_merge_preserve_existing(v, generated[k])
            else:
                merged[k] = v
        # Agregar claves nuevas que no existían en disco
        for k, v in generated.items():
            if k not in merged:
                merged[k] = v
        return merged

    if isinstance(existing, list) and isinstance(generated, list):
        # Si son listas de objetos identificables (comunas, holdings, barrios ACS), merge por clave
        existing_keys = [_item_key(x) for x in existing]
        generated_keys = [_item_key(x) for x in generated]
        if existing and all(k is not None for k in existing_keys) and all(k is not None for k in generated_keys):
            gen_by_key = {k: item for k, item in zip(generated_keys, generated)}
            seen = set()
            result: List[Any] = []
            for k, item in zip(existing_keys, existing):
                seen.add(k)
                if k in gen_by_key:
                    result.append(deep_merge_preserve_existing(item, gen_by_key[k]))
                else:
                    result.append(item)
            for k, item in zip(generated_keys, generated):
                if k not in seen:
                    result.append(item)
            return result
        # Listas simples o no keyed: preservar lo existente en disco
        return existing

    # Escalares: preservar el valor existente en disco (no sobrescribir con hardcoding)
    return existing


def apply_live_overrides(target: Any, overrides: Any) -> Any:
    """Aplica exclusivamente campos provenientes de conectores live_api verificados."""
    if overrides is None:
        return target
    if isinstance(target, dict) and isinstance(overrides, dict):
        out = dict(target)
        for k, v in overrides.items():
            out[k] = apply_live_overrides(out.get(k), v)
        return out
    return overrides


def save_systemic_json_non_destructive(
    target_path: Path | str,
    generated_payload: Any,
    live_overrides: Optional[Dict[str, Any]] = None,
) -> Any:
    """Guarda un dataset en data/systemic/*.json sin destruir variables existentes."""
    path = Path(target_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file():
        try:
            existing = json.loads(path.read_text(encoding="utf-8-sig"))
        except Exception:
            existing = None
        merged = deep_merge_preserve_existing(existing, generated_payload)
    else:
        merged = generated_payload

    if live_overrides:
        merged = apply_live_overrides(merged, live_overrides)

    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(merged, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    return merged
