import { gsap } from 'gsap';
import { C, rng, lin, canopy, grass, frond, bird, bit, n } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { hackathons } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, counter, ambient } from './util.js';

const STONES = [[930, 790], [1170, 740], [1400, 800]];

export function river() {
  const r = rng(81);
  let waves = '';
  for (let i = 0; i < 30; i++) {
    const x = r() * 1800 - 100, y = 600 + r() * 280, w = 40 + r() * 90;
    waves += `<path class="wave" d="M${n(x)} ${n(y)}q${n(w / 4)} -6 ${n(w / 2)} 0t${n(w / 2)} 0" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  const stones = STONES.map(([x, y], i) => `<g class="stone" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="70" ry="24" fill="#9AA79E"/><ellipse cx="${x}" cy="${y - 8}" rx="60" ry="18" fill="#B7C2BA"/>` +
    `<g class="lamp"><circle cx="${x}" cy="${y - 50}" r="46" fill="url(#river-lg)"/><rect x="${x - 13}" y="${y - 66}" width="26" height="34" rx="8" fill="${C.sun}" stroke="${C.bark2}" stroke-width="2"/></g></g>`).join('');
  const rings = [1, 2, 3].map((k) => `<ellipse class="ring" cx="600" cy="750" rx="${220 + k * 60}" ry="${26 + k * 10}" fill="none" stroke="#fff" stroke-opacity="${0.5 - k * 0.12}" stroke-width="2"/>`).join('');
  const art = `
    <rect width="1600" height="900" fill="url(#river-sky)"/>
    <g class="L-far">${canopy(520, 90, C.g4, 82, 160)}${canopy(580, 50, C.g3, 83, 120)}</g>
    <path d="M-100 560C400 540 1200 580 1700 556V920H-100Z" fill="url(#river-water)"/>
    <g class="waves">${waves}</g>
    ${grass(566, C.g1, 84)}<g class="fronds">${frond(60, 600, 200, 20, C.g1)}${frond(1520, 610, 220, -25, C.g2)}</g>
    ${stones}
    <g class="boat">
      <g class="boat-bob">${rings}
        <ellipse cx="600" cy="740" rx="210" ry="22" fill="#5FAFBC" opacity=".4"/>
        <path d="M380 700C470 770 730 770 820 700C760 730 440 730 380 700Z" fill="${C.g2}"/><path d="M380 700C470 740 730 740 820 700" stroke="${C.g1}" stroke-width="4" fill="none"/>
        ${vardyMarkup({ front: ['paddle'] })}
        <g class="bird">${bird(1.1)}</g>
      </g>
    </g>
    <g class="splash">${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="drop" cx="600" cy="720" r="${5 + (i % 3) * 2}" fill="#fff" opacity="0"/>`).join('')}</g>
    ${bit('river-bit', 0.8)}`;
  const parse = (big) => { const m = big.match(/^(#?)(\d+)(.*)$/); return { pre: m[1], v: +m[2], suf: m[3] }; };
  const stats = hackathons.map((h, i) => `<div class="stat" data-r><span class="num" data-h="${i}">${h.big}</span><span class="label">${h.label} · ${h.note}</span></div>`).join('');
  const copy = `
    <p class="eyebrow" data-r>07 · The Gentle River</p>
    <h2 class="title" data-r>Hackathons</h2>
    <p class="sub" data-r><em>drifting through long, bright nights</em></p>
    <div class="stats">${stats}</div>`;

  const s = makeScene('river', { label: 'The Gentle River', focus: 760, art, copy, defs: lin('river-sky', '#EAF7F0', '#F9F6E4') + lin('river-water', C.water, C.water2) });
  s.el.classList.add('clip');
  const rig = mountRig(s, '.vardy');
  rig.set('paddleA', { x: 600, y: 690, sc: 0.75, happy: 1, follow: 0.3 });
  const b = bitAt(s, 820, 520);
  gsap.set(s.$('.boat'), { x: -420 });
  gsap.set(s.$('.bird'), { x: 1180, y: 260 });
  gsap.set(s.$$('.lamp'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 100%' });
  ambient(() => {
    gsap.to(s.$$('.wave'), { x: '+=40', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.1, from: 'random' } });
    gsap.to(s.$('.boat-bob'), { rotation: 1.6, y: 4, svgOrigin: '600 730', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(s.$$('.ring'), { scale: 1.08, svgOrigin: '600 750', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });
  });

  // Water ripple: the village wobbles under a displacement ripple and dissolves.
  function enter(tl, prev) {
    s.anchor = { scene: prev.scene, x: 800, y: 450 };
    const w = prev.scene.world;
    tl.set(w, { attr: { filter: 'url(#houses-ripple)' } }, 0)
      .to(prev.scene.$('.disp'), { attr: { scale: 120 }, duration: 2.2, ease: 'power1.in' }, 0)
      .set(s.el, { autoAlpha: 1, '--r': '0vmax' }, 0.6)
      .to(s.el, { '--r': '150vmax', duration: 2, ease: 'power2.in' }, 0.6)
      .set(prev.scene.el, { autoAlpha: 0 }, 2.6)
      .set(w, { attr: { filter: 'none' } }, 2.6);
    cue(tl, 'splash', 0.4);
  }

  function play(tl) {
    tl.to(s.$('.boat'), { x: 120, duration: 7, ease: 'sine.inOut' }, 2.2);
    for (let i = 0; i < 12; i++) rig.to(tl, i % 2 ? 'paddleA' : 'paddleB', 2.2 + i * 0.55, 0.55, { happy: 1 });
    tl.to(s.$('.bird'), { x: 760, duration: 1.6, ease: 'power1.inOut' }, 4.2)
      .to(s.$('.bird'), { keyframes: { y: [260, 200, 560, 694] }, duration: 1.6, ease: 'sine.inOut' }, 4.2)
      .to(b, { x: 1200, y: 480, duration: 4, ease: 'sine.inOut' }, 2.4);
    s.$$('.lamp').forEach((l, i) => {
      tl.to(l, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, 3.2 + i * 1.2);
      cue(tl, 'pop', 3.3 + i * 1.2);
    });
    s.$$('.drop').forEach((d, i) => {
      tl.fromTo(d, { attr: { cx: 600, cy: 720 }, opacity: 1 }, { attr: { cx: 600 + (i - 2.5) * 40, cy: 660 - (i % 3) * 20 }, opacity: 0, duration: 0.8, ease: 'power2.out' }, 2.4);
    });
    revealCopy(tl, s, 2.4, 0.35);
    hackathons.forEach((h, i) => { const p = parse(h.big); counter(tl, s.$(`[data-h="${i}"]`), p.v, 3.2 + i * 1.2, { prefix: p.pre, suffix: p.suf, duration: 1.2 }); });
  }

  return { scene: s, rig, enter, play };
}
