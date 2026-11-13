"use client";

import { useSyncExternalStore } from "react";

// Корзина живёт в браузере (localStorage) и синхронизируется между вкладками.
// Цены здесь только для показа: при отправке заказа сервер пересчитывает их по каталогу (app/api/order).

export type CartItem = {
  /** уникальный ключ строки: модель + цвет + размер */
  key: string;
  /** id модели витрины (lib/catalog Product.id) */
  model: string;
  /** товар WooCommerce (один цвет) и вариация (размер); у заглушек их нет */
  productId?: number;
  variationId?: number;
  sku?: string;
  name: string;
  color: string;
  size: string;
  note?: string;
  price: number;
  image: string;
  position?: string;
  href: string;
  qty: number;
};

const KEY = "kava-cart-v1";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let ready = false;
const subs = new Set<() => void>();

function read(raw: string | null): CartItem[] {
  try {
    const list = JSON.parse(raw ?? "[]");
    return Array.isArray(list) ? list.filter((x) => x && x.key && x.qty > 0) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function init() {
  if (ready || typeof window === "undefined") return;
  ready = true;
  try {
    items = read(window.localStorage.getItem(KEY));
  } catch {
    items = EMPTY;
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    items = read(e.newValue);
    emit();
  });
}

function emit() {
  subs.forEach((f) => f());
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // приватный режим: корзина работает до закрытия вкладки
  }
  emit();
}

export const cart = {
  subscribe(f: () => void) {
    init();
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
  get() {
    init();
    return items;
  },
  add(item: Omit<CartItem, "qty">, qty = 1) {
    init();
    const cur = items.find((x) => x.key === item.key);
    commit(cur ? items.map((x) => (x.key === item.key ? { ...x, qty: Math.min(99, x.qty + qty) } : x)) : [...items, { ...item, qty }]);
    window.dispatchEvent(new CustomEvent("kava:added", { detail: item.key }));
  },
  setQty(key: string, qty: number) {
    commit(qty <= 0 ? items.filter((x) => x.key !== key) : items.map((x) => (x.key === key ? { ...x, qty: Math.min(99, qty) } : x)));
  },
  remove(key: string) {
    commit(items.filter((x) => x.key !== key));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.get, () => EMPTY);
}

export function cartCount(list: CartItem[]) {
  return list.reduce((n, x) => n + x.qty, 0);
}

export function cartTotal(list: CartItem[]) {
  return list.reduce((n, x) => n + x.qty * x.price, 0);
}

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
