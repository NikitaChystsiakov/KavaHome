# Картинки для генерации (GPT, gpt-image) — KAVA HOME, 2026-11-15

Отдай этот файл GPT целиком. Каждый пункт — отдельная картинка: имя файла, размер, фон и промт на английском.
Готовые PNG сложи в `.art-director/generated/` под указанными именами (папка не идёт в git).
Дальше Claude сожмёт их в WebP, положит в `site/public/img/` и подключит на сайте.

Общее для всех картинок: никаких людей, рук, логотипов реальных брендов, водяных знаков и подписей,
кроме текста, прямо указанного в промте.

---

## 1. Почтовые марки городов — 8 штук (главное)

**Где на сайте:** марка на открытках веера на главной (сейчас там тонкая линия, а у Бергамо просто буква),
страница коллекции и карточки на `/kollekcii`. Подробное задание на подключение лежит в `stamps-codex.md`, эта папка.

- Размер: **1024×1536** (портрет). Марку поставь по центру в пропорции 4:5, вокруг пусто: потом обрежем.
- Фон: **прозрачный** (background: transparent). Если прозрачный не получается — ровный чисто-белый #FFFFFF.
- Файлы: `stamp-verona.png`, `stamp-venice.png`, `stamp-rimini.png`, `stamp-florence.png`,
  `stamp-naples.png`, `stamp-milan.png`, `stamp-bergamo.png`, `stamp-lyon.png`.
- Все 8 должны выглядеть одной серией: одна рамка, одна бумага, одна толщина линий, один шрифт.

Общий промт (подставь `{LANDMARK}`, `{TONE}`, `{LATIN}` из таблицы):

```
A single vintage European postage stamp, isolated on a fully transparent background, front view, no tilt, no shadow.
The stamp has a 4:5 portrait shape with classic perforated (toothed) edges all around; the gaps between the teeth are transparent.
Off-white cream paper (#FBF7EF) with a thin inner frame line.
In the centre: {LANDMARK}, drawn as a fine copperplate line engraving (intaglio), monochrome, printed in a single ink colour {TONE}, with delicate hatching and cross-hatching. Generous margin between the engraving and the frame.
At the bottom, inside the frame, the word "{LATIN}" in small elegant serif capitals, same ink colour.
No other text, no numbers, no denomination, no country name, no postmark or cancellation lines, no logos.
Style: 1900s Italian and French engraved stamps, calm, refined and minimal, slight natural ink unevenness, not cartoonish, not photorealistic, no gradients, no 3D.
The engraving must stay readable when the stamp is shown small (about 60 by 75 pixels): bold clear silhouette, not too many tiny details.
The stamp occupies the middle of the canvas; leave empty transparent space above and below it.
```

| файл | LANDMARK | TONE | LATIN |
|---|---|---|---|
| stamp-verona.png | the Roman amphitheatre Arena di Verona with its two tiers of arches | deep teal #00757D | VERONA |
| stamp-venice.png | a gondola on the Grand Canal in front of the Rialto Bridge | slate blue #4D7884 | VENEZIA |
| stamp-rimini.png | the Arch of Augustus in Rimini, a Roman triumphal arch with a crenellated top | muted rose #9A5F6D | RIMINI |
| stamp-florence.png | the dome of Florence Cathedral (Brunelleschi's dome) with Giotto's bell tower | warm sand brown #A88A6E | FIRENZE |
| stamp-naples.png | the Bay of Naples with Mount Vesuvius in the background and a small fishing boat | warm taupe #8F7B6B | NAPOLI |
| stamp-milan.png | the façade of Milan Cathedral (Duomo di Milano) with its spires | brick red #B0503F | MILANO |
| stamp-bergamo.png | the walled upper town Città Alta of Bergamo on a hill, with the tall Campanone bell tower | warm grey-brown #7D7368 | BERGAMO |
| stamp-lyon.png | the Basilica of Notre-Dame de Fourvière on a hill above the river Saône | dark umber #5A4A44 | LYON |

**Брак:** лишний текст или цифры (номинал, «ITALIA», год), штемпель-гашение поверх, тень или наклон,
цветной рисунок вместо одной краски, разный стиль у разных марок, ошибка в слове внизу.

---

## 2. Открытка Бергамо — запасной вариант

**Где на сайте:** у коллекции Бергамо единственной нет старинной открытки: на `/kollekcii/bergamo`
блок «Привет из Бергамо» идёт без картинки, а в веере вместо открытки фото полотенца.

У остальных городов настоящие фотохромы 1890-х из Wikimedia Commons. Для Бергамо настоящий фотохром
тоже, скорее всего, есть (серия Detroit Publishing / Photoglob), и Claude сначала поищет его.
**Генерировать, только если настоящий не найдётся.** На сайте у сгенерированной открытки не будет подписи с годом.

- Размер: **1536×1024** (альбом 3:2). Фон не нужен, кадр на весь холст.
- Файл: `postcard-bergamo.png`

```
A 1890s photochrom print (hand-tinted colour lithograph from a photograph) of Bergamo, Italy:
the walled upper town Città Alta on its hill, the Venetian stone walls in the foreground, the tall Campanone bell tower
and the domes of the old town against a pale sky, green hills behind.
Soft muted photochrom palette: ochre, olive green, dusty pink roofs, pale turquoise sky, slight lithographic grain.
Landscape 3:2, the image fills the whole frame edge to edge.
No text, no caption, no border, no frame, no people in the foreground, no modern cars or signs.
Looks like an authentic antique Photochrom postcard image, not a painting and not a modern photo.
```

**Брак:** современные машины, провода, люди крупно; надписи; рамка; вид не похож на Бергамо (нет стен и башни на холме).

---

## 3. Пример нанесения логотипа на полотенце — только если Элла разрешит

**Где на сайте:** `/biznes#logo` («Ваш логотип на текстиле») и экран «Для отелей и бизнеса» на главной.
Сейчас там фото шильдика KAVA с подписью «Сейчас здесь шильдик KAVA. На вашем заказе будет ваш логотип».

Это иллюстрация с **выдуманным** логотипом. На сайте её можно ставить только с подписью «пример нанесения»
и только после согласия Эллы. Настоящие фото их работ с вышивкой или жаккардом лучше (вопрос у Эллы открыт).

- Размер: **1024×1536** (портрет).
- Файлы: `logo-embroidery.png`, `logo-jacquard.png`

Вышивка:
```
Close-up product photo of a neatly folded thick white terry hotel towel lying on a light beige linen surface,
soft natural daylight from the left, shallow depth of field.
On the smooth woven border of the towel there is a small tone-on-tone embroidered emblem in warm grey thread:
a simple fictional monogram, the letters "AH" inside a thin oval with a tiny crown above, clean satin-stitch embroidery, slightly raised.
Calm, premium, minimal, warm white and beige palette. No other text, no real brand names, no people, no hands, no packaging.
Photorealistic, high detail of the terry loops and the stitches.
```

Жаккард:
```
Close-up product photo of a folded white terry hotel towel on a warm beige background, soft daylight.
A wide woven jacquard border runs across the towel with a repeating fictional pattern: the word "HOTEL" in simple serif capitals
alternating with a small stylised key motif, woven into the fabric in the same white tone (texture only, not printed, not embroidered).
Calm, premium, minimal. No other text, no real brand names, no people, no hands, no packaging.
Photorealistic, high detail of the woven texture.
```

**Брак:** логотип похож на реальный бренд или отель; вышивка выглядит как принт или наклейка; полотенце в цвете;
руки или упаковка в кадре; кривые буквы.

---

## Что НЕ генерировать (нужны настоящие фото или файлы от клиента)

Сгенерированное изображение товара покупатель примет за настоящий товар, поэтому:

- **Фото подарочных наборов QD по линиям.** Сейчас нарезаны из одного кадра `gift-qd.webp`. Нужны фото от Эллы.
- **Фото халатов и любых других товаров**, которых нет на Google Drive клиента.
- **Фото работ с логотипами отелей** (если Элла даст — заменяют пункт 3).
- **Логотип KAVA HOME в векторе.** Сейчас временная трассировка с PNG.
- **Логотипы партнёров**: только их настоящие файлы.

Картинки-превью для соцсетей и мессенджеров (Open Graph) сделаем кодом из настоящих фото, генерировать их не нужно.
