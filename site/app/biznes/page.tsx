import type { Metadata } from "next";
import Image from "next/image";
import { Shell } from "@/components/Shell";
import { Partners } from "@/components/Partners";
import { HotelForm } from "@/components/HotelForm";
import { contacts } from "@/lib/collections";
import s from "@/components/info.module.css";

export const metadata: Metadata = {
  title: "Полотенца для отелей, санаториев и опт — KAVA HOME",
  description:
    "Полотенца повышенной плотности 500 г/м² для гостиниц, курортов и фитнес-клубов, опт, вышивка и жаккард с логотипом, подарочные сертификаты. Нам доверяют «Европа», отель «Минск», «Альфа Радон», «Плисса», World Class.",
};

// Опт: количество и условия согласуются с каждым клиентом индивидуально (Элла, 2026-11-13) — без цифр.
const offers = [
  {
    id: "hotels",
    title: "Отели и курорты",
    text: "Полотенца повышенной плотности 500 г/м² и белая отельная линия Бергамо и Марсель. Подберём модели и размеры для номеров, банного комплекса или спа.",
    tags: ["500 г/м²", "Бергамо", "Марсель"],
    photo: "/img/use-hotel.webp",
  },
  {
    id: "opt",
    title: "Опт",
    text: "Для магазинов и компаний. Объём и условия согласуем с каждым клиентом индивидуально: оставьте заявку — менеджер пришлёт предложение.",
    tags: ["индивидуальные условия"],
    photo: "/img/naples-stack.webp",
  },
  {
    id: "logo",
    title: "Полотенца с логотипом",
    text: "Вышивка или жаккард с логотипом вашего отеля, клуба или компании. Тираж и сроки зависят от задачи — менеджер рассчитает после заявки.",
    tags: ["вышивка", "жаккард"],
    photo: "/img/hotel-badge.webp",
  },
  {
    id: "certificate",
    title: "Подарочные сертификаты",
    text: "Сертификаты KAVA HOME — подарок сотрудникам и клиентам, когда не знаете цвет и размер.",
    tags: ["для сотрудников", "для клиентов"],
    photo: "/img/gift-qd.webp",
  },
];

export default function BusinessPage() {
  return (
    <Shell>
      <section className={s.hero} aria-labelledby="b-title">
        <div className={s.heroText}>
          <div>
            <p className={`caps ${s.kicker}`}>Для бизнеса</p>
            <h1 id="b-title" className={s.h1}>
              Полотенца для отелей, санаториев и фитнес-клубов
            </h1>
          </div>
          <p className={s.lead}>
            Текстиль повышенной плотности для гостиниц и курортов, опт для магазинов, полотенца с вашим логотипом и подарочные
            сертификаты. Условия обсуждаем с каждым клиентом индивидуально.
          </p>
          <div className={s.heroBtns}>
            <a href="#zayavka" className={s.btnInk}>
              Оставить заявку
            </a>
            <a href={contacts.phoneHref} className={s.phone}>
              {contacts.phone}
            </a>
          </div>
        </div>
        <div className={s.heroPhoto}>
          <Image
            src="/img/hotel-main.webp"
            alt="Белые полотенца отельной линии"
            fill
            preload
            sizes="(max-width: 960px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "50% 60%" }}
            quality={85}
          />
        </div>
      </section>

      <Partners title="Нам доверяют гостиницы, курорты и сети" photo={false} />

      <section className={`${s.section} ${s.paper}`} aria-labelledby="offers-title">
        <div className={s.secHead}>
          <h2 id="offers-title" className={s.h2}>
            Что мы предлагаем
          </h2>
        </div>
        <ul className={s.offers}>
          {offers.map((o) => (
            <li key={o.id} id={o.id} className={s.offer}>
              <div className={s.offerPhoto}>
                <Image src={o.photo} alt="" fill sizes="(max-width: 960px) 100vw, 25vw" style={{ objectFit: "cover" }} quality={75} />
              </div>
              <div className={s.offerBody}>
                <h3 className={s.h3}>{o.title}</h3>
                <p>{o.text}</p>
                <ul className={s.tags}>
                  {o.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="zayavka" className={`${s.section} ${s.sand} ${s.formWrap}`} aria-labelledby="form-title">
        <div className={s.stack}>
          <h2 id="form-title" className={s.h2}>
            Расскажите о задаче
          </h2>
          <p className={s.text}>
            Оставьте телефон — менеджер перезвонит в рабочее время ({contacts.hours}), подберёт модели и пришлёт цены. Или позвоните сами:{" "}
            <a href={contacts.phoneHref}>{contacts.phone}</a>.
          </p>
        </div>
        <div>
          <HotelForm phone={contacts.phone} phoneHref={contacts.phoneHref} hours={contacts.hours} />
        </div>
      </section>
    </Shell>
  );
}
