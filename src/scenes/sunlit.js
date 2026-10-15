import { gsap } from 'gsap';
import { C, rng, lin, canopy, cluster, grass, bit, n } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { research } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, counter, float } from './util.js';

// Points along the fitted curve (cubic from 800,610 to 1360,320).
function curvePoint(t) {
  const p = [[800, 610], [950, 570], [1100, 470], [1360, 320]];
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
}

export function sunlit() {
  const r = rng(51);
  const rays = [0, 1, 2, 3, 4].map((i) => `<path class="ray" d="M${120 + i * 120} -20L${700 + i * 220} 920L${820 + i * 230} 920L${200 + i * 120} -20Z" fill="#FFE9A6" opacity=".3"/>`).join('');
  let cells = '';
  for (let k = 1; k < 7; k++) cells += `<path class="cell" d="M${-130 + k * 4} ${-k * 78}L${130 - k * 4} ${-k * 78}" />`;
  cells += `<path class="cell" d="M0 0V-540M-60 -60V-480M60 -60V-480"/>`;
  let dots = '';
  for (let i = 0; i < 16; i++) dots += `<circle class="dp" cx="${n(820 + r() * 560)}" cy="${n(180 + r() * 420)}" r="7" fill="${C.banana}" stroke="#fff" stroke-width="2"/>`;
  const art = `
    <rect width="1600" height="900" fill="url(#sun-sky)"/><g class="rays">${rays}</g>
    <g class="L-far">${canopy(720, 60, '#CFEAC6', 52, 150)}</g>
    ${canopy(800, 40, C.g3, 53, 120)}${grass(805, C.g2, 54)}
    <g class="L-corner">${cluster(1520, 0, 260, 40, [C.g1, C.g2, C.g0], r, 70, 120)}${cluster(60, 0, 220, 30, [C.g1, C.g2], r, 60, 110)}</g>
    <g class="solar" transform="translate(1180 760) rotate(-18)"><path d="M0 0C150 -110 150 -440 0 -560C-150 -440 -150 -110 0 0Z" fill="${C.g2}"/>${cells}</g>
    <path class="axes" d="M780 640L1380 640M780 640L780 300" stroke="${C.ink}" stroke-opacity=".25" stroke-width="2" fill="none"/>
    <g class="data"><path class="fit" d="M800 610C950 570 1100 470 1360 320" stroke="${C.g1}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${dots}</g>
    ${vardyMarkup({ head: ['goggles'], handR: ['magnifier'] })}
    ${bit('sunlit-bit', 0.9)}`;
  const copy = `
    <p class="eyebrow" data-r>04 · The Sunlit Hollow</p>
    <p class="big" data-r><span class="num" data-gain>+0.00%</span></p>
    <p class="sub" data-r>model accuracy · solar-cell research</p>
    <p class="label" data-r>${research.role} · Published</p>`;

  const s = makeScene('sunlit', { label: 'The Sunlit Hollow', focus: 900, art, copy, defs: lin('sun-sky', '#FFF7DF', '#EAF7F0') });
  s.el.classList.add('clip-beam');
  const rig = mountRig(s, '.vardy');
  rig.set('stand', { x: 560, y: 690, sc: 0.9, lookX: 3, follow: 0.5 });
  const b = bitAt(s, 700, 420);
  gsap.set(s.$('.fit'), { drawSVG: '0%' });
  float(s.$('.data'), { y: 8, dur: 2.6 });
  float(s.$$('.ray'), { x: 16, y: 0, dur: 4.5 });

  // Sunbeam wipe: a warm diagonal beam sweeps across and reveals the glade.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1, '--p': -40 }, 0)
      .to(s.el, { '--p': 140, duration: 2.6, ease: 'power1.inOut' }, 0)
      .to(prev.scene.el, { scale: 1.08, duration: 2.6, ease: 'power1.in' }, 0)
      .set(prev.scene.el, { autoAlpha: 0, scale: 1 }, 2.6);
    cue(tl, 'chime', 0.4);
  }

  function play(tl) {
    rig.to(tl, 'inspect', 2.2, 0.8);
    tl.to(s.$$('.cell'), { stroke: '#FFF4B0', strokeWidth: 4, duration: 0.5, stagger: 0.12 }, 2.4);
    // Data points stop drifting and snap onto the fitted curve.
    s.$$('.dp').forEach((d, i) => {
      const [x, y] = curvePoint(i / 15);
      tl.to(d, { attr: { cx: x, cy: y + (i % 2 ? 12 : -10) }, duration: 1.2, ease: 'back.out(1.6)' }, 3 + i * 0.07);
    });
    tl.to(s.$('.fit'), { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut' }, 4.2)
      .to(b, { x: 1090, y: 300, duration: 2, ease: 'sine.inOut' }, 3)
      .to(rig.s, { lookX: 6, lookY: -3, head: -4, happy: 1, duration: 0.6 }, 5);
    revealCopy(tl, s, 2.4);
    counter(tl, s.$('[data-gain]'), research.gain, 3, { decimals: 2, prefix: '+', suffix: '%', duration: 2.2 });
    cue(tl, 'pop', 5.2);
    tl.to({}, { duration: 1 }, 6.4);
  }

  return { scene: s, rig, enter, play };
}
