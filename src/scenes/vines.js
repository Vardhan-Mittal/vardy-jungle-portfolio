import { gsap } from 'gsap';
import { C, rng, lin, canopy, cluster, vine, flower, sloth, bit } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { cp } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, counter } from './util.js';

const SPEED = 300;           // track units per timeline unit
const VINES = [400, 760, 1120, 1480, 1840, 2200, 2560, 2920, 3280];
const SLOTH_X = 2500;

export function vines() {
  const r = rng(41);
  let band = `<path d="M-200 0H3900V150Q3400 200 2900 150Q2400 110 1900 165Q1400 210 900 150Q400 110 -200 170Z" fill="${C.g1}"/>`;
  for (let x = 0; x < 3900; x += 500) band += cluster(x, 70, 380, 34, [C.g0, C.g1, C.g2], r, 60, 110);
  let vs = '';
  VINES.forEach((x, i) => {
    const len = 420 + (i * 97) % 200, sway = i % 2 ? 14 : -14;
    vs += vine(x, 110, len, C.g1, 50 + i, sway);
    vs += `<g class="knot" data-x="${x}"><circle cx="${x + sway}" cy="${len + 12}" r="30" fill="url(#vines-lg)"/><circle cx="${x + sway}" cy="${len + 12}" r="10" fill="${C.sun}" stroke="${C.bark}" stroke-width="3"/></g>`;
    vs += `<g class="bloom" data-o="${x + sway} ${len + 12}">${flower(x + sway, len + 14, 20, [C.pink, C.peach, C.lav][i % 3])}</g>`;
  });
  const art = `
    <rect width="1600" height="900" fill="url(#vines-sky)"/>
    <g class="L-far">${canopy(820, 60, '#D2ECCB', 42, 140, -200, 3200)}</g>
    <g class="track">${band}${vs}
      <path d="M${SLOTH_X} 110L${SLOTH_X} 400" stroke="${C.g1}" stroke-width="5"/>
      <g class="sloth">${sloth(SLOTH_X, 470, 1)}<path class="sloth-banana" d="M${SLOTH_X - 12} 470Q${SLOTH_X - 16} 494 ${SLOTH_X + 6} 500Q${SLOTH_X - 8} 490 ${SLOTH_X - 4} 470Z" fill="${C.banana}" opacity="0"/></g>
    </g>
    <g class="pendulum">${vardyMarkup({ handR: ['vine'], handL: ['banana'] })}</g>
    <path class="flying-banana" d="M-8 -14Q-12 10 10 16Q-4 6 0 -14Z" fill="${C.banana}" opacity="0"/>
    <g class="bubble" opacity="0"><rect x="560" y="250" width="250" height="52" rx="26" fill="#fff" stroke="${C.g1}" stroke-opacity=".25" stroke-width="2"/><path d="M700 300L716 324L730 300Z" fill="#fff"/>
      <text x="685" y="283" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="20" fill="${C.ink}">600 puzzles. Still fun.</text></g>
    ${bit('vines-bit', 0.8)}`;
  const stats = cp.map((c, i) => `<div class="stat" data-r><span class="num" data-cp="${i}">0</span><span class="label">${c.label}</span></div>`).join('');
  const copy = `<div class="stats"><p class="eyebrow" data-r>03 · The Puzzle Vines</p>${stats}</div>`;

  const s = makeScene('vines', { label: 'The Puzzle Vines', focus: 820, art, copy, defs: lin('vines-sky', '#E3F4E6', '#F6FBEE') });
  s.el.classList.add('copy-bottom');
  const rig = mountRig(s, '.vardy');
  rig.set('swing', { x: 758, y: 553, sc: 0.85, happy: 1, follow: 0.3 });
  const pend = s.$('.pendulum');
  gsap.set(pend, { rotation: -16, svgOrigin: '800 0' });
  const b = bitAt(s, 1120, 640);
  s.$$('.bloom').forEach((el) => gsap.set(el, { scale: 0, svgOrigin: el.dataset.o }));

  // Swing pan: the camera turns sideways and follows Vardy's swing.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1, xPercent: 100 }, 0)
      .to(prev.scene.el, { xPercent: -100, duration: 2.2, ease: 'power2.inOut' }, 0)
      .to(s.el, { xPercent: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
      .to(pend, { rotation: 16, duration: 2.2, ease: 'sine.inOut' }, 0)
      .set(prev.scene.el, { autoAlpha: 0, xPercent: 0 }, 2.2);
    cue(tl, 'rustle', 0.2);
  }

  function play(tl) {
    const t0 = 2.2, dist = 2600, D = dist / SPEED, swings = 7;
    tl.to(s.$('.track'), { x: -dist, duration: D, ease: 'none' }, t0)
      .to(s.$('.L-far'), { x: -dist * 0.35, duration: D, ease: 'none' }, t0)
      .to(b, { x: 1000, y: 560, duration: D, ease: 'sine.inOut' }, t0);
    for (let i = 0; i < swings; i++) tl.to(pend, { rotation: i % 2 ? 16 : -16, duration: D / swings, ease: 'sine.inOut' }, t0 + i * (D / swings));
    s.$$('.knot').forEach((k, i) => {
      const x = +k.dataset.x, at = t0 + (x - 800) / SPEED;
      if (x < 800) { tl.set(k, { autoAlpha: 0 }, 0); tl.set(s.$$('.bloom')[i], { scale: 1 }, 0); return; }
      tl.to(k, { scale: 0, svgOrigin: `${x} 500`, autoAlpha: 0, duration: 0.4 }, at)
        .to(s.$$('.bloom')[i], { scale: 1, rotation: 90, duration: 0.8, ease: 'back.out(2)' }, at);
      cue(tl, 'pop', at);
    });
    // Toss a banana to the sleepy sloth.
    const tToss = t0 + 4.0, fb = s.$('.flying-banana');
    rig.to(tl, 'toss', tToss - 0.4, 0.4, { happy: 1 });
    tl.set(s.$('.prop-banana'), { autoAlpha: 0 }, tToss)
      .set(fb, { opacity: 1, x: 690, y: 560 }, tToss)
      .to(fb, { x: 1060, duration: 0.8, ease: 'none' }, tToss)
      .to(fb, { keyframes: { y: [560, 380, 480] }, rotation: 540, duration: 0.8, ease: 'sine.inOut' }, tToss)
      .set(fb, { opacity: 0 }, tToss + 0.8)
      .set(s.$('.sloth-banana'), { opacity: 1 }, tToss + 0.8)
      .to(s.$('.zzz'), { autoAlpha: 0, duration: 0.3 }, tToss + 0.8);
    rig.to(tl, 'swing', tToss + 0.2, 0.6, { happy: 1 });
    tl.to(s.$('.bubble'), { opacity: 1, duration: 0.5 }, t0 + 1).to(s.$('.bubble'), { opacity: 0, duration: 0.5 }, t0 + 3.4);
    revealCopy(tl, s, t0 + 0.6, 0.4);
    cp.forEach((c, i) => counter(tl, s.$(`[data-cp="${i}"]`), c.value, t0 + 1 + i * 0.6, { suffix: c.suffix }));
  }

  return { scene: s, rig, enter, play };
}
