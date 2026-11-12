"""Сборка CSV для штатного импорта WooCommerce (Товары → Импорт) и фото в WebP.

Модель данных: товар = модель + цвет (вариативный), вариации = размеры.
Наборы по 3 шт — простые товары. Фото в CSV указаны только именем файла:
импорт WooCommerce находит их в «Медиафайлах», если они загружены заранее.

  python3 scripts/catalog/build_csv.py Бергамо
"""
import csv, json, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
MAXSIDE, QUALITY = 2000, 80
ATTRS = ["Размер", "Цвет", "Коллекция", "Плотность", "Состав"]

def webp(src, dst):
    if dst.exists(): return
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im.thumbnail((MAXSIDE, MAXSIDE), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "WEBP", quality=QUALITY, method=6)

def photos(cfg, names, base):
    out = []
    for n, name in enumerate(names, 1):
        fn = f"{base}-{n:02d}.webp"
        webp(ROOT / "photos-src" / cfg["folder"] / name, ROOT / "photos-webp" / cfg["slug"] / fn)
        out.append(fn)
    return out

def row(**kw):
    r = {k: "" for k in HEAD}; r.update(kw); return r

HEAD = ["Type", "SKU", "Name", "Published", "Visibility in catalog", "Short description", "Description",
        "Tax status", "In stock?", "Regular price", "Categories", "Images", "Parent"]
for i in range(1, len(ATTRS) + 1):
    HEAD += [f"Attribute {i} name", f"Attribute {i} value(s)", f"Attribute {i} visible", f"Attribute {i} global"]

def attrs(vals):
    d = {}
    for i, (k, v) in enumerate(vals, 1):
        d.update({f"Attribute {i} name": k, f"Attribute {i} value(s)": v,
                  f"Attribute {i} visible": 1, f"Attribute {i} global": 1})
    return d

def size_sort(s):
    a = s.split("×"); return (int(a[0]), int(a[1])) if len(a) == 2 and all(x.isdigit() for x in a) else (999, 0)

def build(coll):
    cfg = json.loads((Path(__file__).with_name("products.json")).read_text())[coll]
    rows = [r for r in json.loads((ROOT / "import" / "price.json").read_text()) if r["collection"] == coll]
    out = []
    for color, cc in cfg["colors"].items():
        var = sorted([r for r in rows if r["color"] == color and not r["is_set"]], key=lambda r: size_sort(r["size"]))
        sets = [r for r in rows if r["color"] == color and r["is_set"]]
        comp, dens = var[0]["composition"].replace(" %", "%").replace("  ", " "), f'{var[0]["density"]} г/м²'
        name = f'{var[0]["name"]} {coll}, {cc["adj"]}'
        parent = f'KH-{cfg["slug"].upper()}-{cc["slug"].upper()}'
        sizes = ", ".join(r["size"] for r in var)
        # размер, состав и плотность уже в «Характеристиках» (атрибуты), в описании не дублируем
        desc = f"<p>{cfg['short']}</p><p><b>Уход:</b> {cfg['care']}</p>"
        out.append(row(Type="variable", SKU=parent, Name=name, Published=-1, **{"Visibility in catalog": "visible"},
            **{"Short description": cfg["short"]}, Description=desc, **{"Tax status": "none", "In stock?": 1},
            Categories=cfg["categories_towel"], Images=", ".join(photos(cfg, cc["photos"], f'{cfg["slug"]}-{cc["slug"]}')),
            **attrs([("Размер", sizes), ("Цвет", color), ("Коллекция", coll), ("Плотность", dens), ("Состав", comp)])))
        for r in var:
            out.append(row(Type="variation", SKU=r["barcode"] or "", Name=f"{name}, {r['size']}", Published=1, **{"Visibility in catalog": "visible"},
                **{"Tax status": "none", "In stock?": 1, "Regular price": r["price_site"]}, Parent=parent,
                **{"Attribute 1 name": "Размер", "Attribute 1 value(s)": r["size"], "Attribute 1 global": 1}))
        for s in sets:
            sname = f'Набор махровых полотенец {coll}, 3 шт., {cc["set_adj"]}'
            sdesc = (f"<p>{cfg['short_set']}</p><p><b>В наборе:</b> 40×70, 50×90, 70×140 см.</p>"
                     f"<p><b>Уход:</b> {cfg['care']}</p>")
            out.append(row(Type="simple", SKU=f'KH-{cfg["slug"].upper()}-SET3-{cc["slug"].upper()}', Name=sname, Published=-1,
                **{"Visibility in catalog": "visible", "Short description": cfg["short_set"]}, Description=sdesc,
                **{"Tax status": "none", "In stock?": 1, "Regular price": s["price_site"]}, Categories=cfg["categories_set"],
                Images=", ".join(photos(cfg, cc["set_photos"], f'{cfg["slug"]}-nabor-3-{cc["slug"]}')),
                **attrs([("Цвет", color), ("Коллекция", coll), ("Плотность", dens), ("Состав", comp)])))
    dst = ROOT / "import" / f'{cfg["slug"]}.csv'
    with open(dst, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, HEAD); w.writeheader(); w.writerows(out)
    return dst, out

if __name__ == "__main__":
    dst, out = build(sys.argv[1])
    print(dst)
    for r in out: print(r["Type"], "|", r["SKU"], "|", r["Name"], "|", r["Regular price"], "|", r["Images"][:60])
