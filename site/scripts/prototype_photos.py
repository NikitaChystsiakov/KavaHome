"""Прототип главной: скачивает выбранные кадры с публичного Google Drive клиента
и со старого сайта, сжимает в WebP в public/img/. Полный импорт каталога будет отдельным скриптом.
Запуск: python3 scripts/prototype_photos.py ../.art-director/photos/drive-tree.json
"""
import json, os, subprocess, sys, tempfile
from PIL import Image

tree = json.load(open(sys.argv[1]))
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
os.makedirs(OUT, exist_ok=True)

def drive(c, col, n):
    return 'https://drive.google.com/thumbnail?id=%s&sz=w2200' % tree[c]['colors'][col][n - 1][0]

OLD = 'https://kavahome.by/wp-content/uploads/2026/10/'
PICKS = {
    # первый экран
    'hero-florence': drive('Флоренция', 'Флоренция бежевый', 8),
    'hero-verona-tex': drive('Верона', 'Верона изумруд', 3),
    # слайды: главный кадр
    'verona': drive('Верона', 'Верона изумруд', 2),
    'rimini': drive('Римини', 'Римини розовый', 7),
    'venice': drive('Венеция', 'Венеция мятный', 1),
    'florence': drive('Флоренция', 'Флоренция бежевый', 7),
    'milan': drive('Милан', 'Милан терракотовый', 3),
    'lyon': drive('Коврики для ванной', 'лион беж ', 3),
    'naples': drive('Кухонные полотенца', 'Неаполь', 7),
    # лента цветов
    'verona-beige': drive('Верона', 'Верона бежевый', 1),
    'verona-graphite': drive('Верона', 'Верона графит', 1),
    'verona-emerald': drive('Верона', 'Верона изумруд', 1),
    'verona-brown': drive('Верона', 'Верона коричневый', 1),
    'verona-grey': drive('Верона', 'Верона серый', 1),
    'rimini-beige': drive('Римини', 'римини бежевый', 1),
    'rimini-graphite': drive('Римини', 'римини графит', 1),
    'rimini-mint': drive('Римини', 'римини мятный', 1),
    'rimini-pink': drive('Римини', 'Римини розовый', 1),
    'rimini-grey': drive('Римини', 'Римини Серый', 1),
    'rimini-blue': drive('Римини', 'Римини синий', 1),
    'venice-beige': drive('Венеция', 'Венеция бежевый', 5),
    'venice-graphite': drive('Венеция', 'Венеция графит', 4),
    'venice-mint': drive('Венеция', 'Венеция мятный', 3),
    'venice-grey': drive('Венеция', 'Венеция серый', 3),
    'florence-beige': drive('Флоренция', 'Флоренция бежевый', 1),
    'florence-graphite': drive('Флоренция', 'Флоренция графит', 1),
    'florence-brown': drive('Флоренция', 'Флоренция коричневый', 1),
    'milan-graphite': drive('Милан', 'Милан графит', 1),
    'milan-mint': drive('Милан', 'Милан мятный', 2),
    'milan-grey': drive('Милан', 'Милан серый', 1),
    'milan-terra': drive('Милан', 'Милан терракотовый', 2),
    'lyon-beige': drive('Коврики для ванной', 'лион беж ', 1),
    'lyon-graphite': drive('Коврики для ванной', 'лион графит', 4),
    'lyon-brown': drive('Коврики для ванной', 'Лион коричневый', 1),
    'lyon-grey': drive('Коврики для ванной', 'лион серый', 1),
    'naples-grey': drive('Кухонные полотенца', 'Неаполь', 1),
    'naples-brown': drive('Кухонные полотенца', 'Неаполь', 3),
    'naples-stack': drive('Кухонные полотенца', 'Неаполь', 5),
    # мозаика, отели, подарки
    'use-bath': drive('Римини', 'римини графит', 6),
    'use-kitchen': drive('Кухонные полотенца', 'Неаполь', 6),
    'use-mats': drive('Коврики для ванной', 'Лион коричневый', 4),
    'use-hotel': drive('Бергамо', '_root', 6),
    'use-robe': drive('Марсель', '_root', 6),
    'hotel-main': drive('Марсель', '_root', 1),
    'hotel-badge': drive('Милан', 'Милан графит', 3),
    'gift-qd': OLD + 'IMG_6006.jpg',
    'turin': OLD + 'IMG_8543-2.jpg',
}

for name, url in PICKS.items():
    dst = os.path.join(OUT, name + '.webp')
    if os.path.exists(dst):
        continue
    with tempfile.NamedTemporaryFile(suffix='.jpg') as tmp:
        subprocess.run(['curl', '-sL', '-A', 'Mozilla/5.0', '-o', tmp.name, url], check=True)
        im = Image.open(tmp.name).convert('RGB')
        im.thumbnail((1600, 2400))
        im.save(dst, 'WEBP', quality=80, method=6)
        print(f'{name:18s} {im.size} {os.path.getsize(dst)//1024} KB')
