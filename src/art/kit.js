// Jungle art kit: small pure functions that return SVG markup strings.
// Shared visual language with the storyboard (storyboard/art.js).

export const C = {
  sky: '#EAF7F0', cream: '#FFF6DA', g0: '#1F5E3A', g1: '#2F7D4F', g2: '#5BAE6A', g3: '#A8D98A', g4: '#CFE9CF', g5: '#E2F3DE',
  sun: '#FFD66B', bark: '#8A5A3B', bark2: '#6E4428', banana: '#FFC93C', ink: '#1E2B24', mute: '#5D6F65',
  peach: '#FFD9C2', lav: '#D9D3F5', fur: '#7A4A2A', tan: '#F2D3A8', tan2: '#E4B98A', pink: '#F4A3A3',
  water: '#BDE7EA', water2: '#7FCAD3', white: '#FFFFFF',
};

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const n = (v) => Math.round(v * 10) / 10;

export function leaf(x, y, l, r, fill, vein = true, cls = '') {
  const w = l * 0.36;
  let s = `<g${cls ? ` class="${cls}"` : ''} transform="translate(${n(x)} ${n(y)}) rotate(${n(r)})"><path d="M0 0C${n(w)} ${n(-l * .25)} ${n(w * .8)} ${n(-l * .8)} 0 ${n(-l)}C${n(-w * .8)} ${n(-l * .8)} ${n(-w)} ${n(-l * .25)} 0 0Z" fill="${fill}"/>`;
  if (vein) s += `<path d="M0 0L0 ${n(-l * .9)}" stroke="#000" stroke-opacity=".13" stroke-width="${n(Math.max(1, l * .025))}" fill="none"/>`;
  return s + '</g>';
}

export function cluster(cx, cy, rad, count, cols, rnd, lmin, lmax) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2, d = rad * Math.sqrt(rnd()) * .7;
    s += leaf(cx + Math.cos(a) * d, cy + Math.sin(a) * d, lmin + rnd() * (lmax - lmin), a * 180 / Math.PI + 90 + (rnd() - .5) * 40, cols[i % cols.length]);
  }
  return s;
}

export function frond(x, y, len, rot, col, cnt = 9) {
  let s = `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rot)})"><path d="M0 0Q${n(len * .15)} ${n(-len * .5)} 0 ${n(-len)}" stroke="${col}" stroke-width="${n(len * .025)}" fill="none" stroke-linecap="round"/>`;
  for (let i = 1; i <= cnt; i++) {
    const t = i / (cnt + 1), px = 2 * t * (1 - t) * len * .15, py = -len * t, ll = len * .34 * (1 - t * .55);
    s += leaf(px, py, ll, -62 + t * 25, col, false) + leaf(px, py, ll, 62 - t * 25, col, false);
  }
  return s + '</g>';
}

export function canopy(y, amp, col, seed, step = 120, x0 = -100, x1 = 1700) {
  const r = rng(seed);
  let d = `M${x0} 1000L${x0} ${y}`;
  for (let x = x0; x < x1; x += step) d += `Q${n(x + step / 2)} ${n(y - amp * (.5 + r() * .7))} ${n(x + step)} ${n(y + (r() - .5) * amp * .3)}`;
  return `<path d="${d}L${x1 + step} 1000Z" fill="${col}"/>`;
}

export function trunk(x, yt, yb, w, col, seed = 3) {
  const r = rng(seed), h = yb - yt;
  let s = `<path d="M${n(x - w / 2)} ${yb}C${n(x - w * .44)} ${n(yb - h * .5)} ${n(x - w * .4)} ${n(yt + 30)} ${n(x - w * .38)} ${yt}L${n(x + w * .38)} ${yt}C${n(x + w * .4)} ${n(yt + 30)} ${n(x + w * .44)} ${n(yb - h * .5)} ${n(x + w / 2)} ${yb}Z" fill="${col}"/>`;
  for (let k = 0; k < Math.max(2, w / 28) * Math.max(1, h / 900); k++) {
    const bx = x - w * .32 + r() * w * .64, y0 = yt + r() * h * .85, y1 = y0 + Math.min(h * .4, 120 + r() * 300);
    s += `<path d="M${n(bx)} ${n(y0)}Q${n(bx + (r() - .5) * 16)} ${n((y0 + y1) / 2)} ${n(bx)} ${n(y1)}" stroke="#000" stroke-opacity=".12" stroke-width="${n(Math.max(2, w * .02))}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

export function vine(x, y0, y1, col, seed, sway = 0) {
  const r = rng(seed);
  let s = `<path d="M${x} ${y0}Q${n(x + sway * 1.6)} ${n((y0 + y1) / 2)} ${n(x + sway)} ${y1}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  for (let yy = y0 + 30; yy < y1 - 10; yy += 34 + r() * 20) {
    const t = (yy - y0) / (y1 - y0), px = x + 2 * t * (1 - t) * sway * 1.6 + t * t * sway;
    s += leaf(px, yy, 18 + r() * 10, (r() > .5 ? 1 : -1) * (50 + r() * 30), r() > .5 ? C.g2 : C.g1, false);
  }
  return s;
}

export function grass(y, col, seed, x0 = -100, x1 = 1700) {
  const r = rng(seed);
  let d = '';
  for (let x = x0; x < x1; x += 9 + r() * 10) {
    const h = 14 + r() * 26;
    d += `M${n(x)} ${y}Q${n(x + (r() - .5) * 10)} ${n(y - h * .6)} ${n(x + (r() - .5) * 14)} ${n(y - h)}`;
  }
  return `<path d="${d}" stroke="${col}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

export function flower(x, y, r, col) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = i * 72 * Math.PI / 180;
    s += `<circle cx="${n(x + Math.cos(a) * r * .62)}" cy="${n(y + Math.sin(a) * r * .62)}" r="${n(r * .5)}" fill="${col}"/>`;
  }
  return s + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * .36)}" fill="${C.banana}"/>`;
}

// Individual dots so they can be animated as a drifting swarm.
export function pollen(count, seed, col, x0, y0, w, h, cls = 'mote') {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < count; i++) s += `<circle class="${cls}" cx="${n(x0 + r() * w)}" cy="${n(y0 + r() * h)}" r="${n(1.5 + r() * 3.5)}" fill="${col}" opacity="${n(.35 + r() * .5)}"/>`;
  return s;
}

export const glow = (id, col) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity=".95"/><stop offset=".35" stop-color="${col}" stop-opacity=".45"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
export const lin = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

// Bit the firefly. Outer group is positioned by GSAP; inner bobs on its own.
export function bit(glowId, s = 1) {
  return `<g class="bit"><g class="bit-bob" transform="scale(${s})"><circle class="bit-glow" r="46" fill="url(#${glowId})"/>` +
    `<ellipse class="wing" cx="-9" cy="-9" rx="10" ry="6" fill="#fff" opacity=".85" transform="rotate(-30 -9 -9)"/><ellipse class="wing" cx="9" cy="-9" rx="10" ry="6" fill="#fff" opacity=".85" transform="rotate(30 9 -9)"/>` +
    `<circle r="9" fill="#FFE27A"/><circle cx="-3" cy="-1" r="1.6" fill="${C.ink}"/><circle cx="3" cy="-1" r="1.6" fill="${C.ink}"/></g></g>`;
}

export function sloth(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M-26 -10L-30 -70M26 -10L30 -70" stroke="#9C8B78" stroke-width="12" stroke-linecap="round"/>` +
    `<ellipse cx="0" cy="20" rx="34" ry="44" fill="#A8977F"/><circle cx="0" cy="-14" r="28" fill="#A8977F"/><ellipse cx="0" cy="-10" rx="22" ry="16" fill="#E9DCC6"/>` +
    `<path d="M-14 -14Q-8 -10 -3 -14M3 -14Q8 -10 14 -14" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="-11" cy="-13" rx="8" ry="5" fill="#6E5E4D" opacity=".5"/><ellipse cx="11" cy="-13" rx="8" ry="5" fill="#6E5E4D" opacity=".5"/>` +
    `<path d="M-4 -2Q0 2 4 -2" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
    `<g class="zzz" font-family="Manrope, sans-serif" font-weight="700" fill="${C.mute}"><text x="30" y="-40" font-size="18">z</text><text x="42" y="-56" font-size="13">z</text></g></g>`;
}

export function bird(s = 1, col = '#F08C6A') {
  return `<g transform="scale(${s})"><ellipse cx="0" cy="0" rx="16" ry="13" fill="${col}"/><circle cx="12" cy="-8" r="9" fill="${col}"/>` +
    `<path d="M20 -8L28 -5L20 -3Z" fill="${C.banana}"/><circle cx="14" cy="-10" r="2" fill="${C.ink}"/><path d="M-6 -2Q-2 8 8 2" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>` +
    `<path d="M-2 12L-2 18M4 12L4 18" stroke="${C.ink}" stroke-width="2"/></g>`;
}

// Treehouse built from separately animatable parts (.plank, .roof, .window, .lantern).
export function treehouse(x, y, w, col, roof, glowId) {
  const h = w * .7;
  let s = `<g class="house" transform="translate(${x} ${y})">`;
  s += `<rect class="deck" x="${n(-w * .65)}" y="0" width="${n(w * 1.3)}" height="16" rx="4" fill="${C.bark2}"/>`;
  for (let i = 0; i < 6; i++) s += `<rect class="plank" x="${n(-w / 2 + i * w / 6)}" y="${n(-h)}" width="${n(w / 6 - 3)}" height="${n(h)}" fill="${col}" stroke="${C.bark2}" stroke-opacity=".3"/>`;
  s += `<path class="roof" d="M${n(-w * .66)} ${n(-h)}L0 ${n(-h - w * .55)}L${n(w * .66)} ${n(-h)}Z" fill="${roof}"/>`;
  s += `<g class="window"><rect x="${n(-w * .16)}" y="${n(-h * .72)}" width="${n(w * .32)}" height="${n(h * .4)}" rx="6" fill="${C.sun}"/><path d="M0 ${n(-h * .72)}V${n(-h * .32)}M${n(-w * .16)} ${n(-h * .52)}H${n(w * .16)}" stroke="${C.bark2}" stroke-width="3"/></g>`;
  s += `<g class="lantern"><circle class="lantern-glow" cx="${n(w * .58)}" cy="${n(-h * .2)}" r="30" fill="url(#${glowId})"/><rect x="${n(w * .58 - 8)}" y="${n(-h * .28)}" width="16" height="20" rx="5" fill="${C.sun}" stroke="${C.bark2}" stroke-width="2"/></g>`;
  return s + '</g>';
}

export function bridge(x1, y1, x2, y2, sag) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  const q = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * t * (1 - t) * b + t * t * c;
  let s = `<path d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}" stroke="${C.bark2}" stroke-width="3" fill="none"/>`;
  s += `<path d="M${x1} ${y1 - 40}Q${mx} ${my - 40} ${x2} ${y2 - 40}" stroke="${C.bark}" stroke-width="3" fill="none"/>`;
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, px = q(t, x1, mx, x2), py = q(t, y1, my, y2), ry = q(t, y1 - 40, my - 40, y2 - 40);
    s += `<path d="M${n(px)} ${n(ry)}L${n(px)} ${n(py)}" stroke="${C.bark}" stroke-width="2"/><rect x="${n(px - 9)}" y="${n(py - 3)}" width="18" height="8" rx="2" fill="${C.tan2}" stroke="${C.bark2}" stroke-opacity=".4"/>`;
  }
  return s;
}

// Point on the bridge deck at parameter t (0..1) — used to walk Vardy across.
export function bridgePoint(x1, y1, x2, y2, sag, t) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  const q = (a, b, c) => (1 - t) * (1 - t) * a + 2 * t * (1 - t) * b + t * t * c;
  return [q(x1, mx, x2), q(y1, my, y2)];
}

export function medal(r) {
  return `<path d="M-22 10L-40 90L-16 76L-4 98L8 20Z" fill="${C.g2}"/><path d="M22 10L40 90L16 76L4 98L-8 20Z" fill="${C.g1}"/>` +
    `<circle r="${r}" fill="${C.banana}" stroke="#E7A92A" stroke-width="6"/><circle r="${r - 14}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>` +
    `<path d="M0 -26L8 -8L27 -8L12 4L18 23L0 12L-18 23L-12 4L-27 -8L-8 -8Z" fill="#fff"/>`;
}
