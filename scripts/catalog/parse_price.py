"""Разбор прайса KavaHome (лист 1) в import/price.json.

Ячейки цен в прайсе объединены по размерному блоку, поэтому цена без НДС (H)
переносится вниз до следующего размера. Цена сайта = H * 1,5 * 1,2, округление
до целых BYN (0,5 вверх) — так делает колонка «цена сайта» в прайсе клиента.
"""
import glob, json, re, sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[2]

def clean(v):
    if v is None: return None
    if isinstance(v, str):
        v = re.sub(r"\s+", " ", v).strip()
        return v or None
    return v

def norm_size(s):
    s = str(s).lower().replace("р.", "").replace("р ", "").replace("*", "×").replace("х", "×").replace("x", "×")
    return re.sub(r"\s+", "", s).strip(".").lstrip("р")

def site_price(h):
    return int((Decimal(str(h)) * Decimal("1.8")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

def parse(path):
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    out, coll, name, comp, dens, size, h, is_set = [], None, None, None, None, None, None, False
    for i, row in enumerate(ws.iter_rows(min_row=6, values_only=True), 6):
        c = [clean(x) for x in row[:10]]
        head = " ".join(str(x) for x in c[:2] if x)
        m = re.search(r'Коллекция\s+[«"]?([^"»]+)', head)
        if m and not c[4]:
            coll, name, size, h = m.group(1).strip(), None, None, None
            continue
        if (c[0] or c[1]) and not c[2] and not c[4] and not c[5]:
            coll, name, size, h = (c[0] or c[1]), None, None, None   # заголовок без слова «Коллекция» (Халат махровый)
            if coll.lower().startswith("халат"): coll = "Халаты"
            continue
        if c[0]:
            name = c[0]
        if c[2]: comp = c[2]
        if c[3]: dens = c[3]
        if c[4]:
            # набор = несколько размеров в одной ячейке; одиночный размер под заголовком «Набор…» — обычное полотенце
            is_set = "," in str(c[4]) and str(name or "").lower().startswith("набор")
            size, h = (c[4] if is_set else norm_size(c[4])), None
            if not is_set and str(name or "").lower().startswith("набор"): name = "Полотенце махровое"
        if isinstance(c[7], (int, float)) and c[7] > 0:
            h = c[7]
        if c[5] and size:
            out.append(dict(row=i, collection=coll, name=name, is_set=is_set, composition=comp,
                            density=dens, size=size, color=str(c[5]).strip(),
                            barcode=c[6], price_opt=h, price_site=site_price(h) if h else None))
    return out

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else glob.glob(str(ROOT / "data" / "*.xlsx"))[0]
    rows = parse(src)
    (ROOT / "import").mkdir(exist_ok=True)
    (ROOT / "import" / "price.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    from collections import defaultdict
    by = defaultdict(list)
    for r in rows: by[r["collection"]].append(r)
    pos = set((r["collection"], r["name"], r["density"], r["color"]) for r in rows)
    print(f"коллекций {len(by)}, позиций модель+цвет {len(pos)}, вариантов {len(rows)}")
    for k, v in by.items():
        colors = sorted(set(r["color"] for r in v)); sizes = sorted(set(r["size"] for r in v if not r["is_set"]))
        nop = sum(1 for r in v if not r["price_site"])
        print(f"- {k}: {len(v)} вар., цвета {len(colors)}, размеры {sizes}{'  БЕЗ ЦЕНЫ: '+str(nop) if nop else ''}")
