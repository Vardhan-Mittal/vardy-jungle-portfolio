// Vardy: a rigged SVG monkey. Markup is built in a neutral pose; a Rig instance
// owns a plain state object that GSAP tweens, and re-renders joint transforms
// every tick (pose + an always-on idle layer: breathing, blinking, tail sway).
import { C } from './kit.js';

// Joint pivots in Vardy's local space (hip = 100,212; rest height ≈ 250 units).
export const PIVOT = {
  head: [100, 134], uL: [82, 150], fL: [78, 201], uR: [118, 150], fR: [122, 201],
  tL: [92, 212], sL: [89, 252], tR: [108, 212], sR: [111, 252], tail: [106, 220],
};
const JOINTS = Object.keys(PIVOT);

const BASE = { head: 0, uL: 7, fL: 0, uR: -7, fR: 0, tL: 4, sL: 0, tR: -4, sR: 0, tail: 0 };
const SIT = { tL: 22, sL: -38, tR: -22, sR: 38 };

export const POSES = {
  stand: {},
  sit: SIT,
  wave: { uR: -125, fR: -35 },
  waveSit: { ...SIT, uR: -125, fR: -35 },
  laptop: { ...SIT, uL: 46, fL: -104, uR: -46, fR: 104 },
  laptopWave: { ...SIT, uL: 46, fL: -104, uR: -125, fR: -35 },
  climbA: { uL: 150, fL: 10, uR: -60, fR: -60, tL: 35, sL: -70, tR: -8, sR: 25, tail: 20 },
  climbB: { uL: 60, fL: 60, uR: -150, fR: -10, tL: 8, sL: -25, tR: -35, sR: 70, tail: -10 },
  swing: { uL: 60, fL: 30, uR: -158, fR: -8, tL: 14, sL: -24, tR: -10, sR: 18, tail: -25 },
  toss: { uL: 120, fL: 40, uR: -158, fR: -8, tL: 14, sL: -24, tR: -10, sR: 18, tail: -25 },
  read: { ...SIT, uL: 64, fL: -122, uR: -64, fR: 122 },
  readStand: { uL: 64, fL: -122, uR: -64, fR: 122 },
  paintA: { uR: -105, fR: -25, uL: 12, fL: 10 },
  paintB: { uR: -85, fR: -55, uL: 12, fL: 10, head: 4 },
  inspect: { uR: -60, fR: -40, head: 4 },
  paddleA: { ...SIT, uL: 50, fL: -100, uR: -20, fR: 60 },
  paddleB: { ...SIT, uL: 30, fL: -80, uR: -40, fR: 90 },
  walkA: { uL: -18, uR: -20, tL: -16, sL: 10, tR: 18, sR: 12 },
  walkB: { uL: 22, uR: 18, tL: 18, sL: 12, tR: -16, sR: 10 },
  lantern: { uR: -40, fR: -30 },
  look: { ...SIT, head: -14 },
  cheer: { uL: 135, fL: 20, uR: -135, fR: -20, head: -4 },
};

export function pose(name) {
  return { ...BASE, ...(POSES[name] || {}) };
}

export const PROPS = {
  laptop: `<rect x="70" y="182" width="60" height="40" rx="5" fill="#E8F1EC" stroke="#B9C9C0" stroke-width="2"/><path d="M100 194C106 198 106 206 100 210C94 206 94 198 100 194Z" fill="${C.g2}"/><rect x="64" y="220" width="72" height="7" rx="3.5" fill="#C5D3CB"/>`,
  book: `<path d="M100 176L70 170L70 204L100 210Z" fill="#fff" stroke="${C.g1}" stroke-width="2"/><path d="M100 176L130 170L130 204L100 210Z" fill="#F6FBF4" stroke="${C.g1}" stroke-width="2"/><path d="M76 180L94 183M76 188L94 191M106 183L124 180M106 191L124 188" stroke="${C.mute}" stroke-opacity=".5" stroke-width="2"/>`,
  brush: `<path d="M125 248L127 298" stroke="${C.bark}" stroke-width="5" stroke-linecap="round"/><path d="M123 296Q127 314 131 296Z" fill="#F08C6A"/>`,
  magnifier: `<path d="M125 248L125 274" stroke="${C.bark}" stroke-width="5" stroke-linecap="round"/><circle cx="125" cy="288" r="14" fill="${C.water}" fill-opacity=".6" stroke="${C.g1}" stroke-width="4"/>`,
  banana: `<path d="M69 244Q65 268 87 274Q73 264 77 244Z" fill="${C.banana}"/>`,
  lantern: `<path d="M125 252L125 268" stroke="${C.bark}" stroke-width="2"/><rect x="115" y="268" width="20" height="26" rx="6" fill="${C.sun}" stroke="${C.bark}" stroke-width="2"/>`,
  letter: `<rect x="111" y="250" width="34" height="23" rx="3" fill="#fff" stroke="${C.g1}" stroke-width="2"/><path d="M111 252L128 264L145 252" fill="none" stroke="${C.g1}" stroke-width="2"/>`,
  vine: `<path d="M125 250L131 760" stroke="${C.g1}" stroke-width="5" stroke-linecap="round"/>`,
  paddle: `<path d="M58 150L150 262" stroke="${C.bark}" stroke-width="6" stroke-linecap="round"/><ellipse cx="156" cy="272" rx="10" ry="22" transform="rotate(-40 156 272)" fill="${C.bark2}"/>`,
  glasses: `<circle cx="86" cy="93" r="14" fill="none" stroke="${C.ink}" stroke-width="2.5"/><circle cx="114" cy="93" r="14" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`,
  goggles: `<rect x="64" y="56" width="72" height="12" rx="6" fill="${C.g1}"/><circle cx="84" cy="62" r="11" fill="${C.water}" stroke="${C.g1}" stroke-width="3"/><circle cx="116" cy="62" r="11" fill="${C.water}" stroke="${C.g1}" stroke-width="3"/>`,
};

const seg = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${C.fur}" stroke-width="${w}" stroke-linecap="round"/>`;
const slot = (name, list) => (list || []).map((p) => `<g class="prop prop-${p}">${PROPS[p]}</g>`).join('');

// props: { lap:[], front:[], handL:[], handR:[], head:[] } — names from PROPS.
export function vardyMarkup(props = {}) {
  const arm = (L) => {
    const sx = L ? 82 : 118, ex = L ? 78 : 122, hx = L ? 75 : 125, k = L ? 'L' : 'R';
    return `<g data-j="u${k}">${seg(sx, 150, ex, 201, 11)}<g data-j="f${k}">${seg(ex, 201, hx, 250, 10)}${slot('', props['hand' + k])}<circle cx="${hx}" cy="253" r="8.5" fill="${C.tan2}"/></g></g>`;
  };
  const leg = (L) => {
    const hx = L ? 92 : 108, kx = L ? 89 : 111, fx = L ? 87 : 113, k = L ? 'L' : 'R';
    return `<g data-j="t${k}">${seg(hx, 212, kx, 252, 12)}<g data-j="s${k}">${seg(kx, 252, fx, 286, 11)}<ellipse cx="${L ? fx - 4 : fx + 4}" cy="291" rx="12" ry="6.5" fill="${C.tan2}"/></g></g>`;
  };
  const ink = C.ink;
  const head = `<g data-j="head">` +
    `<circle cx="55" cy="96" r="16" fill="${C.fur}"/><circle cx="55" cy="96" r="9" fill="${C.tan2}"/><circle cx="145" cy="96" r="16" fill="${C.fur}"/><circle cx="145" cy="96" r="9" fill="${C.tan2}"/>` +
    `<circle cx="100" cy="92" r="44" fill="${C.fur}"/><path d="M90 52Q92 36 100 48Q106 33 112 50" stroke="${C.fur}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    `<circle cx="86" cy="94" r="19" fill="${C.tan}"/><circle cx="114" cy="94" r="19" fill="${C.tan}"/><ellipse cx="100" cy="113" rx="27" ry="19" fill="${C.tan}"/>` +
    `<g data-j="eyes"><ellipse cx="86" cy="92" rx="10" ry="12" fill="#fff"/><ellipse cx="114" cy="92" rx="10" ry="12" fill="#fff"/>` +
    `<g data-j="pupils"><circle cx="87" cy="94" r="6" fill="${ink}"/><circle cx="115" cy="94" r="6" fill="${ink}"/><circle cx="89" cy="91" r="2" fill="#fff"/><circle cx="117" cy="91" r="2" fill="#fff"/></g></g>` +
    `<path data-j="happy" d="M78 95Q86 85 94 95M106 95Q114 85 122 95" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>` +
    `<ellipse cx="96" cy="107" rx="2" ry="1.6" fill="${ink}"/><ellipse cx="104" cy="107" rx="2" ry="1.6" fill="${ink}"/>` +
    `<path data-j="smile" d="M90 117Q100 127 110 117" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<g data-j="open" opacity="0"><path d="M90 116Q100 132 110 116Z" fill="${ink}"/><path d="M95 122Q100 127 105 122" stroke="${C.pink}" stroke-width="3" fill="none"/></g>` +
    `<ellipse cx="72" cy="110" rx="6" ry="4" fill="${C.pink}" opacity=".5"/><ellipse cx="128" cy="110" rx="6" ry="4" fill="${C.pink}" opacity=".5"/>` +
    slot('', props.head) +
    `<path d="M58 90C56 34 144 34 142 90" stroke="${C.banana}" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="44" y="80" width="18" height="32" rx="8" fill="${C.g2}"/><rect x="138" y="80" width="18" height="32" rx="8" fill="${C.g2}"/>` +
    `</g>`;
  const body = `<path d="M100 128C122 128 128 160 126 190C124 214 112 224 100 224C88 224 76 214 74 190C72 160 78 128 100 128Z" fill="${C.fur}"/><ellipse cx="100" cy="186" rx="15" ry="24" fill="${C.tan}"/>`;
  const tail = `<g data-j="tail"><path d="M106 220C150 236 174 202 162 170C154 148 128 150 133 170" stroke="${C.fur}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  return `<g class="vardy" role="img" aria-label="Vardy the monkey"><g data-j="root">${tail}${leg(true)}${leg(false)}${body}${slot('', props.lap)}${arm(false)}${arm(true)}${head}${slot('', props.front)}</g></g>`;
}

const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });
}

export class Rig {
  constructor(el, init = {}) {
    this.el = el;
    this.j = {};
    el.querySelectorAll('[data-j]').forEach((g) => { this.j[g.dataset.j] = g; });
    // Animatable state: GSAP tweens these values directly.
    this.s = { x: 0, y: 0, sc: 1, rot: 0, flip: 0, hop: 0, happy: 0, open: 0, music: 0, dangle: 0, lookX: 0, lookY: 0, follow: 1, ...pose('stand'), ...init };
    this.blinkAt = 1 + Math.random() * 3;
    this.blink = 1;
    this.react = 0;
    this.calm = false;
    this.render(0);
  }

  set(name, extra = {}) { Object.assign(this.s, pose(name), extra); return this; }

  // Add a pose tween to a timeline. Unspecified joints return to rest.
  to(tl, name, at, duration = 1, extra = {}, ease = 'sine.inOut') {
    tl.to(this.s, { ...pose(name), ...extra, duration, ease }, at);
    return this;
  }

  render(t) {
    const s = this.s, j = this.j, idle = !this.calm;
    const bob = idle ? Math.sin(t * 2.1) * 1.4 + Math.sin(t * 7) * 2.2 * s.music : 0;
    const tailSway = idle ? Math.sin(t * 1.3) * 7 : 0;
    const headBob = idle ? Math.sin(t * 1.6) * 2 + Math.sin(t * 7) * 4 * s.music : 0;
    const dangle = idle ? Math.sin(t * 1.9) * 9 * s.dangle : 0;
    const hop = s.hop - this.react * 26;
    j.root.setAttribute('transform', `translate(${s.x} ${s.y + hop}) scale(${s.flip ? -s.sc : s.sc} ${s.sc}) rotate(${s.rot}) translate(-100 ${-212 + bob})`);
    for (const k of JOINTS) {
      let a = s[k];
      if (k === 'tail') a += tailSway;
      else if (k === 'head') a += headBob;
      else if (k === 'tL') a += dangle;
      else if (k === 'tR') a -= dangle * 0.8;
      const p = PIVOT[k];
      j[k].setAttribute('transform', `rotate(${a.toFixed(2)} ${p[0]} ${p[1]})`);
    }
    // Blink every few seconds.
    if (idle && t > this.blinkAt) { this.blink = 0.1; if (t > this.blinkAt + 0.13) { this.blink = 1; this.blinkAt = t + 2 + Math.random() * 3.5; } }
    const happy = Math.max(s.happy, this.react);
    j.eyes.setAttribute('transform', `translate(0 92) scale(1 ${this.blink * (1 - happy)}) translate(0 -92)`);
    j.happy.setAttribute('opacity', happy);
    const open = Math.max(s.open, this.react);
    j.open.setAttribute('opacity', open);
    j.smile.setAttribute('opacity', 1 - open);
    const lx = s.lookX + pointer.x * 7 * s.follow, ly = s.lookY + pointer.y * 5 * s.follow;
    j.pupils.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
  }
}
