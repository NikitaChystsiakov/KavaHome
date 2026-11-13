import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { contacts } from "@/lib/collections";
import { marketplaces, rating, stores } from "@/lib/partners";
import s from "@/components/info.module.css";

export const metadata: Metadata = {
  title: "Вопросы и ответы — KAVA HOME",
  description: "Как выбрать размер полотенца, как ухаживать, как заказать и получить, работаете ли вы с отелями и оптом.",
};

// Черновик по известным фактам (состав, плотность, уход, доставка, опт). Согласовать с Эллой и дополнить её вопросами покупателей.
const groups: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Полотенца",
    items: [
      {
        q: "Из чего сделаны полотенца?",
        a: <p>Из 100% натурального хлопка. Плотность махры 420–500 г/м²: полотенца в меру плотные и пушистые, хорошо впитывают и быстро сохнут.</p>,
      },
      {
        q: "Какой размер выбрать?",
        a: (
          <>
            <p>Подсказывает ширина: 30–40 см — полотенце для рук, 50 см — для лица, 70 см — банное, 100 см — большое банное.</p>
            <p>Подпись к каждому размеру есть в карточке товара. Если сомневаетесь, возьмите набор из трёх полотенец разных размеров.</p>
          </>
        ),
      },
      {
        q: "Как ухаживать за полотенцами?",
        a: <p>Стирайте при 40–60 °C, без отбеливателей.</p>,
      },
      {
        q: "Есть ли подарочные наборы?",
        a: (
          <p>
            Да, коллекции поставляются в эстетичной упаковке, а в линейке есть готовые подарочные наборы.{" "}
            <Link href="/catalog?kat=gifts">Смотреть подарочные наборы</Link>
          </p>
        ),
      },
    ],
  },
  {
    title: "Заказ и доставка",
    items: [
      {
        q: "Как оформить заказ?",
        a: (
          <p>
            Выберите цвет и размер в карточке товара, добавьте в корзину и оставьте имя и телефон. Платить на сайте не нужно: менеджер перезвонит,
            подтвердит заказ и доставку, а потом пришлёт данные для оплаты.
          </p>
        ),
      },
      {
        q: "Куда доставляете?",
        a: (
          <p>
            По всей Беларуси. Можно забрать заказ самостоятельно из шоурума: {contacts.pickup}. <Link href="/dostavka">Доставка и оплата</Link>
          </p>
        ),
      },
      {
        q: "Как оплатить?",
        a: <p>Через ЕРИП или произвольным платежом по реквизитам: менеджер пришлёт данные для оплаты после подтверждения заказа. Оплаты картой на сайте пока нет.</p>,
      },
      {
        q: "Где ещё можно купить KAVA HOME?",
        a: (
          <p>
            В сетях {stores.map((x) => x.name).join(", ")} и на маркетплейсах {marketplaces.map((x) => x.name).join(", ")} — средняя оценка
            бренда {rating}.
          </p>
        ),
      },
    ],
  },
  {
    title: "Для бизнеса",
    items: [
      {
        q: "Работаете с отелями и санаториями?",
        a: (
          <p>
            Да. Полотенца повышенной плотности 500 г/м² выбирают гостиница «Европа», отель «Минск», «Альфа Радон», «Плисса», World Class и
            другие. <Link href="/biznes">Для бизнеса</Link>
          </p>
        ),
      },
      {
        q: "Продаёте оптом? От какого количества?",
        a: <p>Да. Объём и условия согласуем с каждым клиентом индивидуально — оставьте заявку, и менеджер пришлёт предложение.</p>,
      },
      {
        q: "Можно нанести логотип?",
        a: (
          <p>
            Да, вышивкой или жаккардом. Тираж и сроки зависят от задачи. <Link href="/biznes#zayavka">Оставить заявку</Link>
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <Shell>
      <section className={s.section} style={{ paddingTop: "calc(var(--hdr) + clamp(40px, 7svh, 88px))" }} aria-labelledby="faq-title">
        <div className={s.split}>
          <div className={s.stack} style={{ position: "sticky", top: "calc(var(--hdr) + 32px)" }}>
            <p className={`caps ${s.kicker}`} style={{ marginBottom: 0 }}>
              Покупателям
            </p>
            <h1 id="faq-title" className={s.h1}>
              Вопросы и ответы
            </h1>
            <p className={s.text}>
              Не нашли ответ? Позвоните: <a href={contacts.phoneHref}>{contacts.phone}</a>, {contacts.hours}.
            </p>
          </div>
          <div className={s.faq}>
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className={s.faqGroup}>{g.title}</h2>
                {g.items.map((x) => (
                  <details key={x.q}>
                    <summary>{x.q}</summary>
                    <div className={s.answer}>{x.a}</div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
