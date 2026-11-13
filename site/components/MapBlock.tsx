import { contacts } from "@/lib/collections";
import s from "./info.module.css";

// Карта шоурума и склада (Яндекс, виджет без ключа) и ссылка на маршрут.
export function MapBlock() {
  const q = encodeURIComponent(contacts.mapQuery);
  return (
    <div className={s.stack}>
      <div className={s.map}>
        <iframe
          src={`https://yandex.by/map-widget/v1/?ll=${contacts.mapPoint}&pt=${contacts.mapPoint},pm2dkm&z=14`}
          title={`Карта: ${contacts.pickup}`}
          loading="lazy"
          allowFullScreen
        />
      </div>
      <a className={s.link} href={`https://yandex.by/maps/?text=${q}`} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "start" }}>
        Открыть в Яндекс Картах и построить маршрут ↗
      </a>
    </div>
  );
}
