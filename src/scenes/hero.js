import { gsap } from 'gsap';
import { C, rng, lin, glow, canopy, trunk, cluster, grass, leaf, bit } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { person } from '../data/content.js';
import { makeScene, mountRig, bitAt, float, ambient } from './util.js';
import { sfx } from '../ui/sound.js';

export function hero() {
  const r = rng(11);
  const rays = [0, 1, 2, 3].map((i) => `<path class="ray" d="M${1180 + i * 40} 0L${380 + i * 260} 900L${520 + i * 260} 900L${1230 + i * 40} 0Z" fill="#fff" opacity=".18"/>`).join('');
  const art = `
    <rect width="1600" height="900" fill="url(#hero-sky)"/>
    <g class="L-sky"><circle cx="1220" cy="160" r="260" fill="url(#hero-sun)"/><circle class="sun-core" cx="1220" cy="160" r="70" fill="#FFF0B8"/>${rays}</g>
    <g class="L-far">${canopy(560, 110, '#D9EFD5', 5, 150)}${trunk(260, 100, 760, 70, '#C4DFBC', 2)}${trunk(1080, 140, 760, 60, '#C4DFBC', 4)}${trunk(1380, 80, 760, 80, '#BCDAB3', 6)}
      ${cluster(260, 130, 170, 30, ['#B4DBA6', '#A6D398', '#C4E4B6'], r, 50, 90)}${cluster(1380, 110, 190, 30, ['#B4DBA6', '#A6D398', '#C4E4B6'], r, 50, 90)}</g>
    <g class="L-mid">${canopy(690, 70, '#A6D398', 7, 130)}</g>
    <g class="L-ground">${canopy(800, 45, C.g2, 8, 110)}${grass(805, C.g1, 3)}
      <g class="seed"><circle class="seed-glow" cx="800" cy="812" r="26" fill="url(#hero-lg)"/><ellipse cx="800" cy="812" rx="7" ry="9" fill="#C8873F"/></g></g>
    <g class="L-act">
      <path d="M-120 500C220 486 470 520 780 556L786 574C470 546 220 528 -120 548Z" fill="${C.bark}"/><path d="M-120 548C220 528 470 546 786 574" stroke="${C.bark2}" stroke-width="4" fill="none"/>
      ${cluster(40, 500, 130, 24, [C.g1, C.g2, C.g0], r, 50, 90)}<g class="sway">${leaf(690, 548, 60, 30, C.g2)}${leaf(620, 540, 50, -20, C.g1)}</g>
      ${vardyMarkup({ front: ['laptop'] })}
      ${bit('hero-bit')}
    </g>
    <g class="L-corner">${cluster(-10, 60, 200, 30, [C.g0, C.g1, C.g2], r, 70, 140)}${cluster(1520, 930, 220, 26, [C.g0, C.g1], r, 70, 140)}</g>
    <g class="L-curtL">${cluster(250, 450, 760, 110, [C.g0, C.g1, C.g2, '#2A6E45'], r, 140, 280)}</g>
    <g class="L-curtR">${cluster(1350, 450, 760, 110, [C.g0, C.g1, C.g2, '#2A6E45'], r, 140, 280)}</g>`;

  const letters = [...person.name].map((ch) => `<span class="ch">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  const copy = `
    <p class="eyebrow" data-h>${person.tagline}</p>
    <h1 class="title hero-name" aria-label="${person.name}">${letters}</h1>
    <svg class="underline" viewBox="0 0 520 34" aria-hidden="true"><path d="M6 20C160 34 320 6 514 22" /></svg>
    <p class="sub" data-h><em>Designs. Builds. Delights.</em></p>`;

  const s = makeScene('hero', {
    label: 'Hello', focus: 570, art, copy,
    defs: lin('hero-sky', '#E6F6EE', '#FFF4D8') + glow('hero-sun', '#FFE59A'),
  });
  s.el.classList.add('copy-right');
  const rig = mountRig(s, '.vardy');
  rig.set('laptop', { x: 470, y: 540, sc: 0.95, dangle: 1, lookX: 4, lookY: -2 });
  const b = bitAt(s, 1750, 260);

  float(s.$$('.ray'), { y: 0, x: 18, dur: 4 });
  ambient(() => {
    gsap.to(s.$('.sway'), { rotation: 4, svgOrigin: '660 560', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(s.$('.seed-glow'), { scale: 1.3, svgOrigin: '800 812', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });

  // Time-based opening, played once after the loader.
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(s.$('.L-curtL'), { x: -980, duration: 2.2, ease: 'power2.inOut' }, 0)
      .to(s.$('.L-curtR'), { x: 980, duration: 2.2, ease: 'power2.inOut' }, 0)
      .from(s.$$('.L-far, .L-mid'), { y: 40, duration: 2.4 }, 0)
      .from(s.$$('.hero-name .ch'), { yPercent: 110, rotate: 8, autoAlpha: 0, duration: 1, stagger: 0.04 }, 0.6)
      .from(s.$$('[data-h]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.2 }, 0.9)
      .fromTo(s.$('.underline path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 1.1)
      .to(b, { x: 720, duration: 1.8, ease: 'power1.inOut' }, 0.7)
      .to(b, { keyframes: { y: [260, 200, 330, 410] }, duration: 1.8, ease: 'sine.inOut' }, 0.7)
      .call(() => sfx('chime'), null, 2.0)
      .to(rig.s, { lookX: 6, lookY: -4, head: -6, duration: 0.5 }, 2.2)
      .to(rig.s, { uR: -125, fR: -35, open: 1, duration: 0.6, ease: 'back.out(2)' }, 2.5)
      .to(rig.s, { fR: -10, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 3.0)
      .to(rig.s, { uR: -46, fR: 104, open: 0, head: 0, lookX: 2, lookY: 0, music: 1, duration: 0.8, ease: 'sine.inOut' }, 4.0);
    return tl;
  }

  function play(tl) {
    tl.addLabel('hello', 0);
    tl.to(s.$$('.copy > *'), { y: -50, autoAlpha: 0, duration: 1.4, stagger: 0.06, ease: 'power2.in' }, 0.4)
      .to(s.$('.L-sky'), { y: 30, duration: 3 }, 0)
      .to(s.$('.L-far'), { y: 60, duration: 3 }, 0)
      .to(s.$('.L-mid'), { y: 30, duration: 3 }, 0)
      .to(s.$('.L-corner'), { scale: 1.12, svgOrigin: '800 450', duration: 3 }, 0)
      .to(rig.s, { music: 0, head: 12, lookX: 3, lookY: 5, duration: 1.2 }, 0.8)
      .to(b, { x: 800, y: 780, duration: 2, ease: 'sine.inOut' }, 0.9)
      .to(s.$('.seed-glow'), { attr: { r: 60 }, duration: 1.6 }, 1.4);
  }

  return { scene: s, rig, intro, play };
}
