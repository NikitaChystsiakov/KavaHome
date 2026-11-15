// Ловушка для ботов: поле спрятано от людей и скринридеров, но спам-боты заполняют все поля подряд.
// Сервер (lib/guard.ts) молча принимает такую отправку и никуда её не шлёт.
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Сайт компании
        <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
