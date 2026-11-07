// Общие части эскизов: логотип, символы городов тонкой линией, штамп, прорисовка линии.
const NS = 'http://www.w3.org/2000/svg';

async function injectLogos() {
  const svg = await fetch('logo.svg').then(r => r.text());
  document.querySelectorAll('[data-logo]').forEach(el => { el.innerHTML = svg; el.classList.add('logo-svg'); });
}

function arch(x, w, yBase, yTop) {
  const r = w / 2;
  return `M${x} ${yBase} V${yTop + r} A${r} ${r} 0 0 1 ${x + w} ${yTop + r} V${yBase}`;
}

const SYMBOLS = {
  // Арена ди Верона: два яруса арок и «крыло» Ала
  verona() {
    let d = '', W = 900, n = 18, step = W / n;
    d += `M0 300 H${W} M0 296 H${W}`;
    for (let i = 0; i < n; i++) d += arch(i * step + 9, step - 18, 296, 175);
    d += `M0 168 H${W} M0 160 H${W}`;
    for (let i = 0; i < n; i++) d += arch(i * step + 11, step - 22, 160, 60);
    d += `M0 54 H${W} M0 48 H${W}`;
    // Ала — уцелевший фрагмент третьего яруса
    const ax = 13 * step;
    d += `M${ax} 48 V-40 H${ax + 4 * step} V48`;
    for (let i = 0; i < 4; i++) d += arch(ax + i * step + 12, step - 24, 48, -30);
    return { vb: `0 -50 ${W} 360`, d };
  },
  // Дуомо Флоренции: купол Брунеллески с рёбрами и фонарём
  florence() {
    let d = '';
    d += 'M60 330 H540 M80 330 V250 H520 V330';
    for (let i = 0; i < 8; i++) { const cx = 112 + i * 54; d += `M${cx + 8} 290 A8 8 0 1 1 ${cx - 8} 290 A8 8 0 1 1 ${cx + 8} 290`; }
    d += 'M70 250 H530 M95 250 V222 H505 V250';
    d += 'M110 222 C 118 120 210 52 300 40 C 390 52 482 120 490 222';
    d += 'M205 222 C 210 140 250 70 300 40 M395 222 C 390 140 350 70 300 40 M300 222 V40';
    d += 'M150 222 C 160 150 230 80 300 40 M450 222 C 440 150 370 80 300 40';
    d += 'M286 40 V8 H314 V40 M282 8 H318 M290 8 L300 -22 L310 8 M300 -22 V-34';
    return { vb: '0 -40 600 380', d };
  },
  // Миланский собор: фасад, порталы и шпили
  milan() {
    let d = '', W = 700;
    d += `M60 360 H${W - 60} M80 360 V170 L350 70 L${W - 80} 170 V360`;
    for (let i = 0; i < 5; i++) { const x = 120 + i * 100; d += arch(x, i === 2 ? 70 : 50, 360, i === 2 ? 240 : 270); }
    const sp = [[80, 170, 60], [140, 148, 70], [210, 122, 80], [280, 96, 90], [350, 70, 130], [420, 96, 90], [490, 122, 80], [560, 148, 70], [620, 170, 60]];
    sp.forEach(([x, y, h]) => { d += `M${x - 6} ${y} V${y - h + 14} L${x} ${y - h} L${x + 6} ${y - h + 14} V${y}`; });
    d += 'M350 -60 V-80 M344 -66 H356';
    return { vb: '0 -90 700 470', d };
  }
};

function injectSymbols() {
  document.querySelectorAll('[data-symbol]').forEach(el => {
    const { vb, d } = SYMBOLS[el.dataset.symbol]();
    el.innerHTML = `<svg class="draw" viewBox="${vb}" preserveAspectRatio="xMidYMid meet"><path d="${d}"/></svg>`;
    const p = el.querySelector('path');
    const len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    p.getBoundingClientRect();
    p.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.6,.05,.3,1)';
    requestAnimationFrame(() => { p.style.strokeDashoffset = 0; });
  });
}

function injectStamps() {
  document.querySelectorAll('[data-stamp]').forEach((el, k) => {
    const [ru, lat, num] = el.dataset.stamp.split('|');
    const id = 'sc' + k;
    let waves = '';
    for (let i = 0; i < 4; i++) {
      let w = `M-150 ${-18 + i * 12}`;
      for (let x = -150; x < -66; x += 14) w += ` q 7 -5 14 0`;
      waves += `<path d="${w}" fill="none" stroke="currentColor" stroke-width="1"/>`;
    }
    el.innerHTML = `<svg viewBox="-66 -66 132 132">
      ${waves}
      <circle r="62" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle r="45" fill="none" stroke="currentColor" stroke-width="1"/>
      <defs><path id="${id}" d="M0 0 m-53 0 a53 53 0 1 1 106 0 a53 53 0 1 1 -106 0"/></defs>
      <text font-family="Golos Text" font-size="9.5" letter-spacing="2.6" fill="currentColor"><textPath href="#${id}">${ru} · ${lat} · KAVA HOME · МИНСК ·</textPath></text>
      <text y="-6" text-anchor="middle" font-family="Forum" font-size="22" fill="currentColor">№ ${num}</text>
      <text y="16" text-anchor="middle" font-family="Golos Text" font-size="8" letter-spacing="2" fill="currentColor">2026</text>
    </svg>`;
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await injectLogos();
  injectStamps();
  injectSymbols();
});
