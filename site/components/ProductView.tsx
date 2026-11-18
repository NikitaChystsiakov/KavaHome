"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cart } from "@/lib/cart";
import { priceRange, type Product, type Size } from "@/lib/catalog";
import { categoryPath, productCategory } from "@/lib/categories";
import type { Collection } from "@/lib/collections";
import { contacts } from "@/lib/collections";
import { warm } from "@/lib/warm";
import s from "./product.module.css";

// Карточка товара по схеме Zara Home: слева фото выбранного цвета столбцом (на телефоне листаются),
// справа липкий блок: название, цена размера, цвета квадратами, размеры строками, «В корзину», подробности.
// Цвет и размер в адресе (?cvet=&razmer=), чтобы ссылку можно было отправить и вести рекламу на конкретный цвет.

const BATH = /^\d+×\d+$/;

function defaultSize(sizes: Size[]) {
  // самый ходовой — банное (70×1xx); иначе первый размер
  return sizes.find((z) => z.label.startsWith("70×")) ?? sizes[0];
}

export function ProductView({
  product: p,
  collection,
}: {
  product: Product;
  collection?: Collection;
}) {
  const confirmed = p.source === "woo";
  const [ci, setCi] = useState(0);
  const color = p.colors[ci];
  const sizes = color.sizes?.length ? color.sizes : p.sizes;
  const [sizeLabel, setSizeLabel] = useState<string>(
    () => defaultSize(sizes)?.label ?? "",
  );
  const size = sizes.find((z) => z.label === sizeLabel) ?? defaultSize(sizes);
  const [shot, setShot] = useState(0);
  const [done, setDone] = useState(false);
  // Фото цвета показываются разом: пока все не догрузились, галерея прозрачна, потом проявляется целиком
  const list = useRef<HTMLUListElement>(null);
  const [wait, setWait] = useState(false);

  // цвет и размер из адреса — после гидрации (страница отдаётся статично); до этого адрес не переписываем
  const ready = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const want = q.get("cvet");
    const i = want ? p.colors.findIndex((c) => c.name === want) : -1;
    const raf = requestAnimationFrame(() => {
      if (i > 0) setCi(i);
      const r = q.get("razmer");
      if (r) setSizeLabel(r);
      ready.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [p.colors]);

  useEffect(() => {
    if (!ready.current) return;
    const q = new URLSearchParams(window.location.search);
    q.set("cvet", color.name);
    if (size) q.set("razmer", size.label);
    window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
  }, [color.name, size]);

  const photos = useMemo(() => {
    const list = color.images?.length ? color.images : [color.image];
    return [...new Set(list)];
  }, [color]);

  useLayoutEffect(() => {
    const imgs = Array.from(list.current?.querySelectorAll("img") ?? []);
    // ждём только фото в экране: остальные грузятся лениво и могут не прийти до прокрутки
    const pending = imgs.filter((i) => {
      if (i.complete && i.naturalWidth > 0) return false;
      const r = i.getBoundingClientRect();
      return r.top < window.innerHeight && r.left < window.innerWidth;
    });
    if (!pending.length) {
      setWait(false);
      return;
    }
    setWait(true);
    let left = pending.length;
    const finish = () => setWait(false);
    const one = () => {
      if (--left <= 0) finish();
    };
    pending.forEach((i) => {
      i.addEventListener("load", one, { once: true });
      i.addEventListener("error", one, { once: true });
    });
    const t = window.setTimeout(finish, 3000);
    return () => {
      window.clearTimeout(t);
      pending.forEach((i) => {
        i.removeEventListener("load", one);
        i.removeEventListener("error", one);
      });
    };
  }, [photos, color.name]);

  const pickColor = (i: number) => {
    setCi(i);
    setShot(0);
    setDone(false);
    const next = p.colors[i];
    // у цвета может не быть выбранного размера: тогда ближайший по умолчанию
    const nextSizes = next.sizes?.length ? next.sizes : p.sizes;
    if (!nextSizes.some((z) => z.label === sizeLabel))
      setSizeLabel(defaultSize(nextSizes)?.label ?? "");
  };

  const [min, max] = priceRange(p);
  const cat = productCategory(p);
  const isSet = p.category === "sets";

  const add = () => {
    if (!size || !confirmed) return;
    cart.add({
      key: `${p.id}|${color.name}|${size.label}`,
      model: p.id,
      productId: color.id,
      variationId: size.id && size.id !== color.id ? size.id : undefined,
      sku: size.sku,
      name: `${p.name} ${p.title}`,
      color: color.name,
      size: size.label,
      note: size.note,
      price: size.price,
      image: photos[0],
      position: color.position,
      href: `/catalog/${p.id}?cvet=${encodeURIComponent(color.name)}&razmer=${encodeURIComponent(size.label)}`,
    });
    setDone(true);
  };

  return (
    <div className={s.product}>
      <div className={s.gallery} aria-label="Фото">
        <ul
          key={color.name}
          ref={list}
          className={s.photos}
          data-count={photos.length}
          data-wait={wait ? "" : undefined}
          onScroll={(e) => {
            const el = e.currentTarget;
            setShot(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {photos.map((src, i) => (
            <li key={src}>
                <Image
                  src={src}
                  alt={`${p.name} ${p.title}, ${color.name}, фото ${i + 1}`}
                  fill
                  sizes="(max-width: 960px) 100vw, 30vw"
                  style={{
                    objectFit: "cover",
                    objectPosition:
                      i === 0 ? (color.position ?? "50% 50%") : "50% 50%",
                  }}
                  preload={i === 0}
                  quality={85}
                />
            </li>
          ))}
        </ul>
        {photos.length > 1 && (
          <p className={s.counter} aria-hidden="true">
            {shot + 1} / {photos.length}
          </p>
        )}
      </div>

      <div className={s.panel}>
        <div className={s.sticky}>
          <nav className={`caps ${s.crumbs}`} aria-label="Навигация">
            <Link href="/catalog">Каталог</Link>
            {cat && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={categoryPath(cat)}>{cat.h1}</Link>
              </>
            )}
          </nav>

          <h1 className={s.title}>
            <span>{p.name}</span> {p.title}
          </h1>
          <p className={s.price}>
            {!confirmed
              ? "Цена по запросу"
              : size
                ? `${size.price} BYN`
                : `${min} – ${max} BYN`}
            {confirmed && size && min !== max && (
              <small>
                {" "}
                · от {min} до {max} BYN за размер
              </small>
            )}
          </p>

          <div className={s.block}>
            <p className={s.label}>
              Цвет: <b>{color.name}</b>
            </p>
            <ul className={s.colors}>
              {p.colors.map((c, i) => (
                <li key={c.name}>
                  <button
                    type="button"
                    aria-pressed={i === ci}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => pickColor(i)}
                    onPointerEnter={() =>
                      warm(
                        [c.images?.[0] ?? c.image],
                        "(max-width: 960px) 100vw, 30vw",
                        85,
                      )
                    }
                  >
                    <i style={{ background: c.swatch }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {sizes.length > 0 && (
            <fieldset className={s.block}>
              <legend className={s.label}>
                {isSet ? "Комплект" : p.category === "robes" ? "Размер" : "Размер, см"}
              </legend>
              <div className={s.sizes}>
                {sizes.map((z) => (
                  <label key={z.label} className={s.size}>
                    <input
                      type="radio"
                      name="size"
                      value={z.label}
                      checked={size?.label === z.label}
                      onChange={() => {
                        setSizeLabel(z.label);
                        setDone(false);
                      }}
                    />
                    <span className={s.sizeName}>{z.label}</span>
                    <span className={s.sizeNote}>{z.note}</span>
                    <span className={s.sizePrice}>
                      {confirmed ? `${z.price} BYN` : "по запросу"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className={s.buy}>
            {confirmed ? (
              <button
                type="button"
                className={s.btnInk}
                onClick={add}
                disabled={!size}
              >
                {done ? "Добавлено · ещё одно" : "В корзину"}
              </button>
            ) : (
              <a
                className={s.btnInk}
                href={`/biznes?item=${encodeURIComponent(`${p.title}, ${color.name}, ${size?.label ?? ""}`)}#zayavka`}
              >
                Уточнить цену
              </a>
            )}
            {done && (
              <Link href="/korzina" className={s.btnLine}>
                Перейти в корзину
              </Link>
            )}
          </div>
          <p className={s.hint}>
            Менеджер подтвердит заказ и доставку по телефону. Оплата — после
            согласования.
          </p>

          <dl className={s.facts}>
            <div>
              <dt>Состав</dt>
              <dd>{p.composition ?? "100% хлопок"}</dd>
            </div>
            {p.density > 0 && (
              <div>
                <dt>Плотность</dt>
                <dd>{p.density} г/м²</dd>
              </div>
            )}
            {!isSet && sizes.some((z) => BATH.test(z.label)) && (
              <div>
                <dt>Размеры</dt>
                <dd>{sizes.map((z) => z.label).join(", ")} см</dd>
              </div>
            )}
            {collection && (
              <div>
                <dt>Коллекция</dt>
                <dd>
                  <Link href={`/kollekcii/${collection.slug}`}>
                    {collection.city} →
                  </Link>
                </dd>
              </div>
            )}
          </dl>

          <div className={s.more}>
            {p.description && (
              <details>
                <summary>Описание</summary>
                <div
                  className={s.desc}
                  dangerouslySetInnerHTML={{ __html: p.description }}
                />
              </details>
            )}
            <details>
              <summary>Уход</summary>
              <p>Стирка при 40–60 °C, без отбеливателей.</p>
            </details>
            <details>
              <summary>Доставка и оплата</summary>
              <p>
                Доставляем по всей Беларуси. Самовывоз — шоурум и склад:{" "}
                {contacts.pickupShort}. Стоимость доставки менеджер назовёт при
                подтверждении заказа, оплата через ЕРИП или по реквизитам.{" "}
                <Link href="/dostavka">Подробнее</Link>
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
