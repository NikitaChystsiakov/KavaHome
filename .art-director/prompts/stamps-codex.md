# Задание для Codex: почтовые марки на открытках веера

Скопируй всё ниже в Codex, запуская его из корня репозитория KavaHome.

---

Проект: витрина магазина полотенец KAVA HOME (Next.js 16, папка `site/`, стили в CSS-модулях, без Tailwind).
На главной есть веер старинных открыток (`site/components/Wheel.tsx`, стили `site/components/wheel.module.css`).
У каждой открытки в правом верхнем углу лицевой стороны есть почтовая марка (`<span className={w.postage}>`).
Сейчас внутри неё тонкий SVG-символ города из `site/components/symbols.ts`, а у Бергамо просто буква.
Это смотрится бедно. Нужно заменить их на сгенерированные картинки марок.

## 1. Сгенерируй 8 марок (image generation, gpt-image)

Общие параметры для каждой:
- размер 1024×1280 (портрет 4:5), **прозрачный фон** (background: transparent);
- марка целиком в кадре, прямо, без наклона и без тени. Поворот и тень делает CSS;
- одна марка на картинке, без рук, стола и конвертов.

Общий промт (подставь `{LANDMARK}`, `{TONE}`, `{LATIN}`):

```
A single vintage European postage stamp, isolated on a fully transparent background, front view, no tilt, no shadow.
Portrait 4:5 format with classic perforated (deckled, toothed) edges all around, the gaps between the teeth transparent.
Off-white cream paper (#FBF7EF) with a thin inner frame line.
In the centre: {LANDMARK}, drawn as a fine copperplate line engraving (intaglio), monochrome, printed in a single ink colour {TONE}, with delicate hatching and cross-hatching. Generous margin between the engraving and the frame.
At the bottom, inside the frame, the word "{LATIN}" in small elegant serif capitals, same ink colour.
No other text, no numbers, no denomination, no country name, no postmark or cancellation lines, no logos.
Style: 1900s Italian and French engraved stamps, calm, refined and minimal, slight natural ink unevenness, not cartoonish, not photorealistic, no gradients, no 3D.
The engraving must stay readable when the stamp is shown small (about 60 by 75 pixels): bold clear silhouette, not too many tiny details.
```

Таблица городов (slug — файл, LANDMARK, TONE, LATIN). Цвета взяты из `site/lib/collections.ts`, поле `tone`:

| slug | LANDMARK | TONE | LATIN |
|---|---|---|---|
| verona | the Roman amphitheatre Arena di Verona with its two tiers of arches | deep teal #00757D | VERONA |
| venice | a gondola on the Grand Canal in front of the Rialto Bridge | slate blue #4D7884 | VENEZIA |
| rimini | the Arch of Augustus in Rimini, a Roman triumphal arch with a crenellated top | muted rose #9A5F6D | RIMINI |
| florence | the dome of Florence Cathedral (Brunelleschi's dome) with Giotto's bell tower | warm sand brown #A88A6E | FIRENZE |
| naples | the Bay of Naples with Mount Vesuvius in the background and a small fishing boat | warm taupe #8F7B6B | NAPOLI |
| milan | the façade of Milan Cathedral (Duomo di Milano) with its spires | brick red #B0503F | MILANO |
| bergamo | the walled upper town Città Alta of Bergamo on a hill, with the tall Campanone bell tower | warm grey-brown #7D7368 | BERGAMO |
| lyon | the Basilica of Notre-Dame de Fourvière on a hill above the river Saône | dark umber #5A4A44 | LYON |

Florence and Naples have tones in the code (`#d8c2ac`, `#cbbcaf`) that are too pale for thin lines, so the table uses darker shades of the same hue. Do not change the `tone` field in the code.

## 2. Сохрани в проект

- Сжать в WebP с альфа-каналом, 400×500, качество около 85: `site/public/img/stamps/<slug>.webp` (например, через `cwebp -q 85 -resize 400 500` или Python Pillow).
- Исходники 1024×1280 PNG положить в `.art-director/stamps/` (эта папка не идёт в git, проверь `.gitignore`, при необходимости добавь).

## 3. Подключи в веер

В `site/components/Wheel.tsx`, в лицевой стороне открытки:
- вместо SVG-символа и буквы внутри `<span className={w.postage}>` выводи `next/image`:
  `<Image src={`/img/stamps/${x.slug}.webp`} alt="" fill sizes="120px" quality={85} draggable={false} />`
  Важно: у Image в этой версии Next нет `priority` (есть `preload`), а `quality` должен быть из `images.qualities` в `next.config.ts` (сейчас [75, 85]).
- если файла марки для города нет, оставь старый вариант с SVG-символом как запасной (список slug, для которых есть картинки, держи константой рядом).

В `site/components/wheel.module.css`, класс `.postage`:
- убери `background`, `outline`, `box-shadow` и `padding`: зубцы и бумага теперь в самой картинке;
- `position: absolute` и `transform: rotate(4deg)` оставь, добавь лёгкую тень по форме марки: `filter: drop-shadow(0 1px 1.5px rgba(40, 30, 25, 0.25))`;
- увеличь ширину с `calc(var(--W) * 0.2)` до `calc(var(--W) * 0.24)`, `aspect-ratio: 4 / 5` оставь;
- у вложенного `img` должен быть `object-fit: contain`.

`site/components/symbols.ts` не удаляй: символы используются ещё и в колоде `Deck.tsx`.

## 4. Проверь

- `cd site && npx tsc --noEmit && npx eslint components`.
- Запусти `npm run dev` (порт 4204), открой главную, второй экран (веер открыток). Сделай скриншоты веера на 1440×900 и на 375×812 и положи их в `.art-director/review/stamps/`.
- Марки должны читаться, не перекрывать подпись города и не вылезать за край открытки при повороте карточек в веере.

Ничего не коммить и не пушь: пуш в main сразу выкладывает демо на Vercel.
