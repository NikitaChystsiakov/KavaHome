"""Контактные листы для отбора фото: python3 sheets.py <имя> <папка> [<папка>...]"""
import sys, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
ROOT = Path(__file__).resolve().parents[2]; OUT = ROOT / "import" / "_sheets"; OUT.mkdir(parents=True, exist_ok=True)
def nat(s): return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]
name, dirs = sys.argv[1], [Path(d).resolve() for d in sys.argv[2:]]
files = []
for d in dirs:
    files += sorted([p for p in d.iterdir() if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png")], key=lambda p: nat(p.name))
T, COLS, PER = 150, 10, 70
for part in range(0, len(files), PER):
    chunk = files[part:part + PER]; rows = (len(chunk) + COLS - 1) // COLS
    sh = Image.new("RGB", (COLS * T, rows * (T + 14)), "white"); dr = ImageDraw.Draw(sh)
    for i, f in enumerate(chunk):
        try:
            im = Image.open(f); im.draft("RGB", (T * 2, T * 2)); im = ImageOps.exif_transpose(im).convert("RGB"); im.thumbnail((T - 4, T - 4))
        except Exception as e:
            continue
        x, y = (i % COLS) * T, (i // COLS) * (T + 14); sh.paste(im, (x + (T - im.width) // 2, y))
        dr.text((x + 2, y + T), f"{part + i + 1}", fill="black")
    sh.save(OUT / f"{name}_{part // PER + 1}.jpg", quality=75)
(OUT / f"{name}_index.txt").write_text("\n".join(f"{i + 1}\t{f.relative_to(ROOT)}" for i, f in enumerate(files)))
print(name, len(files), "фото,", (len(files) + PER - 1) // PER, "листов")
