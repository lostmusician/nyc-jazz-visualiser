"""Export original Blender street PNGs to responsive, transparent WebP layers.

Requires Pillow. Run from any working directory after build_remembered_street.py.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2] / 'public' / 'art' / 'street'
for layer in ('far', 'middle', 'foreground', 'door-light', 'hand', 'ticket'):
    with Image.open(root / f'{layer}.png') as source:
        source.save(root / f'{layer}.webp', quality=85, method=6)
        source.resize((800, 500), Image.Resampling.LANCZOS).save(
            root / f'{layer}-mobile.webp', quality=75, method=6)
