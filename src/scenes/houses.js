import { gsap } from 'gsap';
import { C, rng, lin, canopy, trunk, cluster, treehouse, bridge, bridgePoint, bit } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { projects } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy } from './util.js';

const XS = [300, 790, 1270], TOPS = [420, 360, 430];
const B1 = [370, 436, 720, 376, 70];

export function houses() {
  const r = rng(71);
  const cols = ['#E8C9A0', '#F2D7B0', '#E8C9A0'], roofs = [C.g1, '#E57B5A', C.g2];
  let trees = '', homes = '';
  XS.forEach((x, i) => {
    trees += trunk(x, 60, 920, 90, C.bark, 70 + i) + cluster(x, 80, 200, 34, [C.g1, C.g2, C.g0], r, 60, 110);
    homes += `<g class="home" data-i="${i}">${treehouse(x, TOPS[i], 150, cols[i], roofs[i], 'houses-lg')}</g>`;
  });
  const art = `
    <rect width="1600" height="900" fill="url(#houses-sky)"/>
    <g class="L-far">${canopy(760, 70, C.g4, 72, 150)}${canopy(860, 40, C.g3, 73, 120)}</g>
    <g class="L-mid">${trees}${bridge(...B1)}${bridge(860, 376, 1200, 446, 70)}${homes}</g>
    ${vardyMarkup({ handR: ['lantern'] })}
    ${bit('houses-bit', 0.8)}`;
  const cards = projects.map((p) => `
    <article class="card" data-r>
      <h3>${p.name}</h3>
      <p class="blurb">${p.blurb}</p>
      <ul class="chips">${p.stack.map((t) => `<li>${t}</li>`).join('')}</ul>
      ${p.href ? `<a class="btn" href="${p.href}" target="_blank" rel="noopener">Live demo →</a>` : '<span class="btn ghost">Mobile app</span>'}
    </article>`).join('');
  const copy = `<div class="cards"><p class="eyebrow" data-r>06 · The Treehouse Village</p>${cards}</div>`;

  const s = makeScene('houses', { label: 'The Treehouse Village', focus: 790, art, copy, defs: lin('houses-sky', '#E8F6EE', '#FBF6E6') + `<filter id="houses-ripple" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="4"/><feDisplacementMap class="disp" in="SourceGraphic" scale="0"/></filter>` });
  s.el.classList.add('copy-bottom');
  const rig = mountRig(s, '.vardy');
  const at = (t) => { const [x, y] = bridgePoint(...B1, t); return { x, y: y - 52 }; };
  rig.set('walkA', { ...at(0), sc: 0.62, lookX: 4 });
  const b = bitAt(s, 1010, 300);
  s.$$('.home').forEach((h) => {
    gsap.set(h.querySelectorAll('.plank'), { y: -90, autoAlpha: 0 });
    gsap.set(h.querySelector('.roof'), { y: -140, autoAlpha: 0 });
    gsap.set(h.querySelectorAll('.window, .lantern'), { autoAlpha: 0 });
  });

  // Bridge walk: the village slides in while Vardy strolls across the rope bridge.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1, xPercent: 100 }, 0)
      .to(prev.scene.el, { xPercent: -45, autoAlpha: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
      .to(s.el, { xPercent: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
      .set(prev.scene.el, { xPercent: 0 }, 2.2);
    cue(tl, 'rustle', 0.2);
  }

  function play(tl) {
    const walk = { t: 0 };
    tl.to(walk, { t: 1, duration: 4, ease: 'none', onUpdate: () => Object.assign(rig.s, at(walk.t)) }, 1);
    for (let i = 0; i < 10; i++) rig.to(tl, i % 2 ? 'walkA' : 'walkB', 1 + i * 0.4, 0.4);
    rig.to(tl, 'lantern', 5, 0.6, { happy: 1 });
    s.$$('.home').forEach((h, i) => {
      const t = 1.4 + i * 1.3;
      tl.to(h.querySelectorAll('.plank'), { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)' }, t)
        .to(h.querySelector('.roof'), { y: 0, autoAlpha: 1, duration: 0.7, ease: 'bounce.out' }, t + 0.6)
        .to(h.querySelectorAll('.window, .lantern'), { autoAlpha: 1, duration: 0.5 }, t + 1.1);
      cue(tl, 'pop', t + 0.7);
    });
    tl.to(b, { x: 1240, y: 250, duration: 3, ease: 'sine.inOut' }, 2);
    revealCopy(tl, s, 2, 0.5);
    tl.to({}, { duration: 1 }, 6.5);
  }

  return { scene: s, rig, enter, play };
}
