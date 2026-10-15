import { gsap } from 'gsap';
import { C, rng, lin, canopy, bit, pollen, n } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { skills } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, float } from './util.js';

const CENTERS = [[380, 400], [800, 300], [1190, 420], [650, 610]];
// Portrait screens only see a narrow band around x=800, so stack the groups 2×2.
const CENTERS_P = [[668, 300], [850, 395], [668, 510], [850, 590]];

export function fireflies() {
  const r = rng(101);
  let groups = '', flies = '';
  const portrait = innerWidth / innerHeight < 0.9, fit = portrait ? 0.46 : 1, centers = portrait ? CENTERS_P : CENTERS;
  skills.forEach((g, gi) => {
    const [cx, cy] = centers[gi], pts = [];
    for (let k = 0; k < g.items.length; k++) {
      const a = k / g.items.length * Math.PI * 2 + gi, rad = 95 + (k % 2) * 30;
      pts.push([cx + Math.cos(a) * rad * 1.3 * fit, cy + Math.sin(a) * rad * 0.8 * fit]);
    }
    const d = 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z';
    groups += `<g class="constellation" data-g="${gi}"><path class="cline" d="${d}" stroke="#fff" stroke-opacity=".8" stroke-width="1.5" fill="none" stroke-dasharray="3 6"/>` +
      `<text class="gname" x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${portrait ? 24 : 30}" fill="${C.ink}">${g.group}</text>` +
      pts.map((p, k) => `<text class="sname" x="${n(p[0])}" y="${n(p[1] + 28)}" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="14" fill="${C.ink}" opacity=".85">${g.items[k]}</text>`).join('') + '</g>';
    pts.forEach((p) => {
      flies += `<g class="fly" data-x="${n(p[0])}" data-y="${n(p[1])}"><circle r="20" fill="url(#fireflies-lg)"/><circle r="4.5" fill="#FFF6CC"/></g>`;
    });
  });
  const art = `
    <rect width="1600" height="900" fill="url(#ff-sky)"/>
    <rect class="dusk" width="1600" height="900" fill="url(#ff-sky2)" opacity="0"/>
    <g class="motes">${pollen(60, 104, '#FFF2B0', 0, 0, 1600, 700)}</g>
    <g class="L-far">${canopy(760, 80, '#B7C9B8', 102, 160)}${canopy(840, 50, '#93B39E', 103, 120)}</g>
    ${groups}${flies}
    <path d="M900 820C1100 790 1300 800 1720 760L1720 790C1300 830 1100 820 900 846Z" fill="#7C6150"/>
    ${vardyMarkup({})}
    ${bit('fireflies-bit', 0.8)}`;
  const list = skills.map((g) => `<li><strong>${g.group}:</strong> ${g.items.join(', ')}</li>`).join('');
  const copy = `<p class="eyebrow" data-r>09 · The Firefly Crown</p><h2 class="title small" data-r>What I work with</h2><ul class="sr-only">${list}</ul>`;

  const s = makeScene('fireflies', { label: 'The Firefly Crown', focus: 760, art, copy, defs: lin('ff-sky', '#DCEFE3', '#FFF1DC') + lin('ff-sky2', '#CEC6F0', '#FFDCC6') });
  s.el.classList.add('copy-top');
  const rig = mountRig(s, '.vardy');
  rig.set('look', { x: portrait ? 905 : 1180, y: portrait ? 800 : 790, sc: 0.8, lookX: -2, lookY: -5, dangle: 1, follow: 0.4 });
  const b = bitAt(s, 1260, 650);
  s.$$('.fly').forEach((f) => gsap.set(f, { x: 100 + r() * 1400, y: 120 + r() * 560, scale: 0.6, autoAlpha: 0 }));
  gsap.set(s.$$('.cline'), { drawSVG: '0%' });
  gsap.set(s.$$('.gname, .sname'), { autoAlpha: 0 });
  float(s.$$('.mote'), { y: -20, x: 8, dur: 3 });

  // Day-to-dusk: the whole palette slowly grades to lavender and peach.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 0 }, 0)
      .to(s.el, { autoAlpha: 1, duration: 2, ease: 'none' }, 0)
      .to(prev.scene.el, { yPercent: -8, duration: 2, ease: 'power1.in' }, 0)
      .to(s.$('.dusk'), { opacity: 1, duration: 2.6, ease: 'none' }, 0.6)
      .set(prev.scene.el, { autoAlpha: 0, yPercent: 0 }, 2);
  }

  function play(tl) {
    tl.to(s.$$('.fly'), { autoAlpha: 1, duration: 0.6, stagger: 0.03 }, 2)
      .to(s.$$('.fly'), { x: (i, el) => +el.dataset.x, y: (i, el) => +el.dataset.y, scale: 1, duration: 1.8, stagger: { each: 0.04, from: 'random' }, ease: 'power2.inOut' }, 2.6)
      .to(s.$$('.cline'), { drawSVG: '100%', duration: 1.2, stagger: 0.3 }, 4.2)
      .to(s.$$('.gname'), { autoAlpha: 1, duration: 0.6, stagger: 0.3 }, 4.4)
      .to(s.$$('.sname'), { autoAlpha: 1, duration: 0.4, stagger: 0.03 }, 4.8)
      .to(b, { x: 1100, y: 600, duration: 2, ease: 'sine.inOut' }, 3)
      .to(rig.s, { happy: 1, head: -18, duration: 0.8 }, 5.2);
    revealCopy(tl, s, 2.2);
    cue(tl, 'chime', 4.3);
    tl.to({}, { duration: 1.2 }, 6.4);
  }

  // Hover a constellation to brighten it.
  s.$$('.constellation').forEach((g) => {
    g.addEventListener('pointerenter', () => gsap.to(g, { scale: 1.06, transformOrigin: '50% 50%', duration: 0.4 }));
    g.addEventListener('pointerleave', () => gsap.to(g, { scale: 1, duration: 0.4 }));
  });

  return { scene: s, rig, enter, play };
}
