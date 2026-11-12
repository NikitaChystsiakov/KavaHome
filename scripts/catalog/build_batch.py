"""Партия товаров для импорта WooCommerce из прайса + отобранных фото Эллы.

  python3 scripts/catalog/build_batch.py batch1
Пишет import/<batch>.csv и фото в photos-webp/<batch>/ (одна папка — загрузить в «Медиафайлы» целиком).
Товар = модель + цвет (вариативный, вариации = размеры), набор 3 шт = простой товар.
"""
import csv, json, re, sys
from pathlib import Path
import openpyxl
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CUR = ROOT / "Фото контент для сайта"
SRC = ROOT / "photos-src"
MAXSIDE, QUALITY, MAXPH = 2000, 80, 8
CARE = "Стирка при 40–60 °C, без хлорсодержащих отбеливателей. Сушить в расправленном виде. Перед первым использованием постирать."

# коллекция в прайсе → настройки. folder: папка с подпапками цветов; shared: одна папка на все цвета
COLL = {
 "Верона Премиум": dict(slug="verona", table="Верона", folder=CUR/"Верона", cats="Ванная"),
 "Римини":   dict(slug="rimini",   folder=CUR/"Римини",   cats="Ванная"),
 "Венеция":  dict(slug="venecija", folder=CUR/"Венеция",  cats="Ванная", extra_dirs={"коричневый": SRC/"Венеция коричневый"},
                  main={"бежевый": "IMG_9276.JPG", "графит": "IMG_9350.JPG", "мятный": "IMG_7843.jpg", "серый": "IMG_7907.jpg"}),
 "Флоренция": dict(slug="florencija", folder=CUR/"Флоренция", cats="Ванная", extra_dirs={"серый": SRC/"Флоренция серый"}),
 "Милан":    dict(slug="milan",    folder=CUR/"Милан",    cats="Ванная", extra_dirs={"кремовый": SRC/"Милан кремовый"}),
 "Бергамо":  dict(slug="bergamo",  shared=CUR/"Бергамо",  cats="Ванная, Для отелей", set_cats="Наборы и подарки, Для отелей",
                  sku={"белый": "KH-BERGAMO-BELOE"}, set_sku={"белый": "KH-BERGAMO-SET3-BELOE"}),
 "Марсель":  dict(slug="marsel",   shared=CUR/"Марсель",  only=["белый"], cats="Ванная, Для отелей", set_cats="Наборы и подарки, Для отелей"),
 "Лион":     dict(slug="lion",     folder=CUR/"Коврики для ванной", cats="Коврики", name="Коврик для ванной",
                  main={"графит": "_MG_8340.jpg"}),
 "Турин":    dict(slug="turin",    folder=CUR/"Кухонные полотенца"/"Турин", cats="Кухня"),
 "Неаполь":  dict(slug="neapol",   shared=CUR/"Кухонные полотенца"/"Неаполь", cats="Кухня", main_all="_MG_4280.jpg"),
}
COLL2 = {
 "Марсель": dict(slug="marsel", sheet="marsel", skip=["белый"], no_sets=True, cats="Ванная, Для отелей", extra_dirs={"серый": SRC/"Марсель серый"},
   picks={"графит": [150, 17, 19, 22, 116, 104, 131], "синий": [151, 38, 40, 42, 119, 76, 142],
          "голубой": [152, 44, 46, 49, 75, 113, 146, 156], "ваниль": [153, 32, 34, 50, 51, 87, 72, 158],
          "какао": [154, 7, 10, 14, 71, 90, 62], "лаванда": [155, 25, 27, 31, 82, 117, 157]}),
 "Палермо": dict(slug="palermo", sheet="palermo", cats="Ванная, Баня и пляж", extra_dirs={"ваниль": SRC/"Палермо ваниль", "какао": SRC/"Палермо какао"},
   picks={"серый": [2, 44, 27, 12, 45], "графит": [43, 16, 19, 3, 37, 29], "бордовый": [8, 17, 18, 22, 31, 48],
          "синий": [7, 15, 20, 33, 34, 46]}),
 "Кава-Хоум": dict(slug="kava-home", sheet="kava", cats="Ванная",
   picks={"коричневый": [16, 1, 2, 39, 42, 75, 26, 82], "бежевый": [20, 5, 6, 51, 55, 68, 27, 83],
          "графит": [12, 3, 4, 44, 48, 72, 24, 81], "синий": [18, 7, 9, 33, 34, 60, 25, 85]}),
 "Халаты": dict(slug="halat", sheet="halat", cats="Халаты", name="Халат махровый Kava", nocoll=True,
   picks={"капучино": [19, 18, 21, 15, 11, 13, 63, 77], "кремовый": [35, 36, 37, 38, 39, 40, 1],
          "белый": [23, 24, 25, 26, 27, 16, 12, 9], "лиловый": [29, 28, 30, 31, 32, 17, 14, 3]}),
 "Валенсия": dict(slug="valensija", sheet="valencia", cats="Кухня",
   text="Вафельное полотенце из 100% хлопка плотностью 320 г/м². Рельефная вафельная структура хорошо впитывает влагу и быстро сохнет.",
   picks={"коричневый": [34, 22, 17, 26, 3], "какао": [58, 52, 66, 64, 56, 74], "бежевый": [36, 11, 24, 7, 17],
          "ваниль": [59, 37, 29, 61, 72, 77], "графит": [139, 111, 132, 147, 156, 150], "серый": [138, 113, 142, 146, 155, 151],
          "тиффани": [112, 109, 87, 89, 93, 86], "брусника": [114, 107, 117, 116, 88, 81]}),
 "Мадрид": dict(slug="madrid", sheet="madrid", cats="Кухня", shared_picks=[3, 2, 5, 7, 8, 9, 6, 1], append_picks=[3, 5],
   extra_dirs={c: SRC/"Мадрид по цветам"/c for c in ["лаванда", "брусника", "ваниль", "какао", "серый", "графит"]},
   text="Махровое полотенце из 100% хлопка плотностью 420 г/м². Компактный размер 30×50 см — для рук и кухни."),
 "Новогодняя": dict(slug="novogodnjaja", sheet="ng", title="«Новогодняя»", cats="Наборы и подарки",
   text="Праздничное полотенце из 100% хлопка с золотой вышивкой: ёлка, олень или Дед Мороз. Хороший подарок к Новому году.",
   picks={"махровое:красный": [25, 26, 102, 89, 71, 39], "махровое:зеленый": [34, 35, 91, 104, 103, 46],
          "махровое:кремовый": [31, 32, 105, 90, 33, 107], "вафельное:красный": [7, 3, 16, 15, 4, 17],
          "вафельное:зеленый": [8, 5, 6, 1, 11], "вафельное:белый": [9, 12, 14, 13, 19]}),
}
BATCHES = {"batch1": COLL, "batch2": COLL2}

def sheet_files(sheet):
    idx = dict(l.split("\t", 1) for l in (ROOT / "import" / "_sheets" / f"{sheet}_index.txt").read_text().splitlines())
    return lambda nums: [ROOT / idx[str(n)] for n in nums]
SKIP_FILES = {"_MG_8341 (1).jpg", "_MG_4239 (1).jpg"}   # дубли

TR = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя", ["a","b","v","g","d","e","e","zh","z","i","j","k","l","m","n","o","p","r","s","t","u","f","h","c","ch","sh","sch","","y","","e","ju","ja"]))
def slug(s): return re.sub(r"[^a-z0-9]+", "-", "".join(TR.get(ch, ch) for ch in s.lower().strip())).strip("-")
def nat(s): return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]
def size_key(s):
    a = re.findall(r"\d+", s); return [int(x) for x in a] or [999]

def imgs(d): return sorted([p for p in d.iterdir() if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png") and p.name not in SKIP_FILES], key=lambda p: nat(p.name))

def color_dir(folder, color):
    c = color.lower().strip()
    for d in sorted(folder.iterdir()):
        if not d.is_dir(): continue
        for tok in re.split(r"[\s/-]+", d.name.lower().strip()):
            if len(tok) >= 3 and (c.startswith(tok) or tok.startswith(c[:4])): return d
    return None

def descriptions():
    f = next((ROOT / "data").glob("категории*.xlsx"))
    ws = openpyxl.load_workbook(f, data_only=True).worksheets[0]
    head = [str(c.value or "") for c in ws[1]]; dcol = next(i for i, h in enumerate(head) if "Описание" in h)
    out, cur = {}, None
    for row in ws.iter_rows(min_row=2, values_only=True):
        txt = " ".join(str(x) for x in row if x)
        m = re.search(r'Коллекция\s+"([^"]+)"', txt)
        if m and not row[dcol]: cur = m.group(1); continue
        if txt.strip().lower().startswith("халат"): cur = cur if cur == "Халаты" else "Халаты"
        d = row[dcol] if dcol < len(row) else None
        if cur and d and cur not in out:
            d = re.sub(r'Коллекция\s*"([^"]+)"\s*-?\s*', r"Коллекция «\1» — ", str(d).strip())
            d = re.sub(r"\s+", " ", re.sub(r"([.!?])(?=[А-ЯA-Z])", r"\1 ", d))
            d = re.sub(r"(«[^»]+») — ([Сс])очетает", r"\1 сочетает", d)   # «Римини» сочетает, без тире перед глаголом
            out[cur] = d[0].upper() + d[1:]
    return out

HEAD = ["Type", "SKU", "Name", "Published", "Visibility in catalog", "Short description", "Description",
        "Tax status", "In stock?", "Regular price", "Categories", "Images", "Parent"]
for i in range(1, 6): HEAD += [f"Attribute {i} name", f"Attribute {i} value(s)", f"Attribute {i} visible", f"Attribute {i} global"]
def row(**kw): r = dict.fromkeys(HEAD, ""); r.update(kw); return r
def attrs(vals): return {k: v for i, (n, val) in enumerate(vals, 1) for k, v in
                         ((f"Attribute {i} name", n), (f"Attribute {i} value(s)", val), (f"Attribute {i} visible", 1), (f"Attribute {i} global", 1))}

def to_webp(src, dst):
    if dst.exists(): return
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB"); im.thumbnail((MAXSIDE, MAXSIDE), Image.LANCZOS)
    im.save(dst, "WEBP", quality=QUALITY, method=4)

# Уточнения Эллы поверх прайса (цена сайта как у остальных цветов этого размера)
EXTRA_PRICE = [
 # 2026-11-12: Милан терракотовый есть и в 30×60, 50×80
 dict(collection="Милан", name="Полотенце махровое", is_set=False, composition="100% хлопок", density=480, size="30×60", color="терракотовый", barcode=None, price_site=7),
 dict(collection="Милан", name="Полотенце махровое", is_set=False, composition="100% хлопок", density=480, size="50×80", color="терракотовый", barcode=None, price_site=16),
] + [
 # 2026-11-12: Флоренция во всех цветах в трёх размерах 30×60, 50×90, 70×140
 dict(collection="Флоренция", name="Полотенце махровое", is_set=False, composition="100% хлопок", density=450, size=sz, color=c, barcode=None, price_site=pr)
 for c, sz, pr in [("графит", "50×90", 16), ("бежевый", "30×60", 7), ("серый", "50×90", 16)]
]

def model_kind(name):
    n = str(name or "").lower()
    return "вафельное" if "ваф" in n else "махровое"

def build(batch):
    price = json.loads((ROOT / "import" / "price.json").read_text()) + EXTRA_PRICE
    desc = descriptions(); outdir = ROOT / "photos-webp" / batch; outdir.mkdir(parents=True, exist_ok=True)
    rows, report, nprod, nvar = [], [], 0, 0
    for coll, cfg in BATCHES[batch].items():
        pr = [r for r in price if r["collection"] == coll]
        text = cfg.get("text") or desc.get(cfg.get("table", coll), "")
        if not text: report.append(f"{coll}: нет описания")
        pick = sheet_files(cfg["sheet"]) if cfg.get("sheet") else None
        towels = [r for r in pr if not r["is_set"]]
        kinds = sorted(set(model_kind(r["name"]) for r in towels))
        groups = list(dict.fromkeys((model_kind(r["name"]), r["color"].strip()) for r in towels))
        for kind, color in groups:
            key = f"{kind}:{color}" if len(kinds) > 1 else color
            if color in cfg.get("skip", []) or (cfg.get("only") and color not in cfg["only"]):
                continue
            # фото: picks по номерам листа / общая папка / подпапка цвета
            if pick and (cfg.get("extra_dirs") or {}).get(color) and key not in cfg.get("picks", {}):
                files = imgs(cfg["extra_dirs"][color]) + (pick(cfg["append_picks"]) if cfg.get("append_picks") else [])
                base = f'{cfg["slug"]}-{slug(color)}'
            elif pick and cfg.get("shared_picks"): files = pick(cfg["shared_picks"]); base = cfg["slug"]
            elif pick: files = pick(cfg["picks"].get(key, [])); base = f'{cfg["slug"]}-' + (f"{slug(kind)}-" if len(kinds) > 1 else "") + slug(color)
            else:
                d = (cfg.get("extra_dirs") or {}).get(color) or cfg.get("shared") or (color_dir(cfg["folder"], color) if cfg.get("folder") else None)
                files = imgs(d) if d else []
                if not files and cfg.get("folder"):   # пустая подпапка у Эллы → ищем в присланных отдельно
                    d = (cfg.get("extra_dirs") or {}).get(color); files = imgs(d) if d else []
                main = (cfg.get("main") or {}).get(color) or cfg.get("main_all")
                if main: files = sorted(files, key=lambda p: p.name != main)
                base = f'{cfg["slug"]}-{slug(color)}' if not cfg.get("shared") or cfg.get("only") or len(groups) == 1 else cfg["slug"]
            files = files[:MAXPH]
            if not files: report.append(f"{coll} {key}: НЕТ ФОТО, пропущен"); continue
            names = []
            for n, f in enumerate(files, 1):
                fn = f"{base}-{n:02d}.webp"; to_webp(f, outdir / fn); names.append(fn)
            var = sorted([r for r in towels if r["color"].strip() == color and model_kind(r["name"]) == kind], key=lambda r: size_key(r["size"]))
            if any(not r["price_site"] for r in var): report.append(f"{coll} {key}: есть размер без цены")
            var = [r for r in var if r["price_site"]]
            if not var: continue
            comp = re.sub(r"\s+", " ", var[0]["composition"]).replace(" %", "%")
            dens = f'{var[0]["density"]} г/м²'
            city = cfg.get("table", coll)
            full = (f"<p>{text}</p>" if text else "") + f"<p><b>Уход:</b> {CARE}</p>"
            tname_base = cfg.get("name") or (str(var[0]["name"]).strip()[0].upper() + str(var[0]["name"]).strip()[1:])
            tname = f'{tname_base}, {color}' if cfg.get("nocoll") else f'{tname_base} {cfg.get("title", coll)}, {color}'
            psku = (cfg.get("sku") or {}).get(color) or (f'KH-{cfg["slug"]}-' + (f"{slug(kind)}-" if len(kinds) > 1 else "") + slug(color)).upper()
            sizes = [r["size"].replace("-", "–") for r in var]
            cats = cfg["cats"] + (", Баня и пляж" if any(size_key(r["size"])[0] >= 100 for r in var) and "Баня" not in cfg["cats"] else "")
            if coll == "Новогодняя": cats += ", Кухня" if kind == "вафельное" else ", Ванная"
            att = [("Размер", ", ".join(sizes)), ("Цвет", color)] + ([] if cfg.get("nocoll") else [("Коллекция", city)]) + [("Плотность", dens), ("Состав", comp)]
            rows.append(row(Type="variable", SKU=psku, Name=tname, Published=-1, **{"Visibility in catalog": "visible",
                "Short description": text, "Description": full, "Tax status": "none", "In stock?": 1},
                Categories=cats, Images=", ".join(names), **attrs(att)))
            for r, sz in zip(var, sizes):
                rows.append(row(Type="variation", SKU=r["barcode"] or f'{psku}-{slug(r["size"])}'.upper(), Name=f'{tname}, {sz}',
                    Published=1, **{"Visibility in catalog": "visible", "Tax status": "none", "In stock?": 1, "Regular price": r["price_site"]},
                    Parent=psku, **{"Attribute 1 name": "Размер", "Attribute 1 value(s)": sz, "Attribute 1 global": 1}))
            nprod += 1; nvar += len(var)
            if cfg.get("no_sets"): continue
            for s_ in [r for r in pr if r["is_set"] and r["color"].strip() == color]:
                if not s_["price_site"]: report.append(f"{coll} {color}: набор без цены, пропущен"); continue
                ss = ", ".join(sorted(re.findall(r"\d+\s*[хx×]\s*\d+", s_["size"]), key=size_key)).replace("х", "×").replace("x", "×").replace(" ", "").replace(",", ", ")
                ssku = (cfg.get("set_sku") or {}).get(color) or f'KH-{cfg["slug"]}-SET3-{slug(color)}'.upper()
                rows.append(row(Type="simple", SKU=ssku, Name=f"Набор махровых полотенец {coll}, 3 шт., {color}", Published=-1,
                    **{"Visibility in catalog": "visible", "Short description": f"Три полотенца коллекции {city}: {ss} см.",
                       "Description": f"<p>В наборе три полотенца: {ss} см.</p>" + full,
                       "Tax status": "none", "In stock?": 1, "Regular price": s_["price_site"]},
                    Categories=cfg.get("set_cats", "Наборы и подарки, " + cfg["cats"]), Images=", ".join(names),
                    **attrs([("Цвет", color), ("Коллекция", city), ("Плотность", dens), ("Состав", comp)])))
                nprod += 1
        for c in sorted(set(r["color"].strip() for r in pr) - set(c for _, c in groups) - set(cfg.get("skip", []))):
            report.append(f"{coll} {c}: только набор, без полотенца")
    if ONLY:
        rows = [r for r in rows if r["SKU"] in ONLY or r["Parent"] in ONLY]
        dst = ROOT / "import" / (sys.argv[sys.argv.index("--out") + 1] + ".csv" if "--out" in sys.argv else "fix.csv")
    else:
        dst = ROOT / "import" / f"{batch}.csv"
    with open(dst, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, HEAD); w.writeheader(); w.writerows(rows)
    print(f"{dst.name}: товаров {nprod}, вариаций {nvar}, фото {len(list(outdir.glob('*.webp')))}")
    print("\n".join(report))

ONLY = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else set()
if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "batch1")
