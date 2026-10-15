import { gsap } from 'gsap';
import { C, rng, lin, canopy, grass, leaf, bit, pollen } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { makeScene, mountRig, bitAt, cue, revealCopy } from './util.js';

const dash = `fill="none" stroke="${C.ink}" stroke-opacity=".45" stroke-width="2.5" stroke-dasharray="8 6"`;

export function design() {
  const r = rng(61);
  const strokes = [
    'M-100 160C300 60 700 260 1100 120S1600 80 1800 200',
    'M-100 420C260 340 640 520 1000 400S1500 300 1800 460',
    'M-100 680C300 600 700 760 1100 640S1500 560 1800 720',
    'M-100 900C400 820 800 940 1200 860S1600 820 1800 900',
    'M200 -60C260 300 160 600 260 980M1300 -60C1260 300 1380 600 1300 980',
  ].map((d, i) => `<path class="brush" d="${d}" stroke="#fff" stroke-width="${i === 4 ? 360 : 300}" stroke-linecap="round" fill="none"/>`).join('');
  const ui = `
    <rect x="-230" y="-150" width="460" height="300" rx="14" fill="#fff" ${dash}/>
    <circle cx="-208" cy="-130" r="5" fill="${C.pink}"/><circle cx="-192" cy="-130" r="5" fill="${C.banana}"/><circle cx="-176" cy="-130" r="5" fill="${C.g2}"/>
    <rect x="-210" y="-106" width="200" height="120" rx="10" ${dash}/><rect x="-210" y="34" width="150" height="14" rx="7" ${dash}/><rect x="-210" y="60" width="200" height="10" rx="5" ${dash}/><rect x="-210" y="98" width="110" height="32" rx="16" ${dash}/>
    <rect x="20" y="-106" width="190" height="16" rx="8" ${dash}/><rect x="20" y="-74" width="160" height="10" rx="5" ${dash}/><rect x="20" y="-40" width="190" height="120" rx="10" ${dash}/><rect x="20" y="98" width="110" height="32" rx="16" ${dash}/>
    <g class="paint"><rect x="-210" y="-106" width="200" height="120" rx="10" fill="${C.g3}"/><circle cx="-150" cy="-60" r="22" fill="${C.sun}"/><path d="M-210 14L-140 -40L-90 0L-50 -24L-10 14Z" fill="${C.g1}"/></g>
    <rect class="paint" x="-210" y="34" width="150" height="14" rx="7" fill="${C.ink}"/>
    <rect class="paint" x="-210" y="60" width="200" height="10" rx="5" fill="${C.mute}" opacity=".45"/>
    <rect class="paint" x="-210" y="98" width="110" height="32" rx="16" fill="${C.banana}"/>
    <rect class="paint" x="20" y="-106" width="190" height="16" rx="8" fill="${C.ink}"/>
    <rect class="paint" x="20" y="-74" width="160" height="10" rx="5" fill="${C.mute}" opacity=".45"/>
    <g class="paint"><rect x="20" y="-40" width="190" height="120" rx="10" fill="${C.peach}"/><circle cx="70" cy="20" r="26" fill="${C.lav}"/><rect x="110" y="0" width="80" height="12" rx="6" fill="#fff"/><rect x="110" y="22" width="60" height="10" rx="5" fill="#fff"/></g>
    <rect class="paint" x="20" y="98" width="110" height="32" rx="16" fill="${C.g1}"/>`;
  const art = `
    <g mask="url(#design-mask)">
      <rect width="1600" height="900" fill="url(#design-sky)"/>
      <path class="wash" d="M640 300C760 200 980 250 1100 320C1180 370 1300 360 1400 330" stroke="#FFC9A8" stroke-width="80" stroke-linecap="round" fill="none" opacity=".55"/>
      <path class="wash" d="M700 640C860 600 1100 680 1380 600" stroke="${C.g3}" stroke-width="70" stroke-linecap="round" fill="none" opacity=".5"/>
      ${canopy(800, 50, C.g4, 62, 140)}${grass(840, C.g2, 63)}
      <g class="canvas" transform="translate(1030 470) rotate(-4)"><path d="M-380 0C-300 -260 300 -260 380 0C300 260 -300 260 -380 0Z" fill="#FBFFF8" stroke="${C.g1}" stroke-width="4"/><path d="M-370 0H370" stroke="${C.g3}" stroke-width="3"/>${ui}</g>
      <g class="splat">${pollen(26, 64, '#F08C6A', 620, 560, 300, 200, 'sp')}${pollen(20, 65, C.g2, 1250, 200, 250, 200, 'sp')}</g>
      <g class="palette">${leaf(330, 760, 160, 60, C.g2)}<circle cx="368" cy="738" r="12" fill="${C.pink}"/><circle cx="397" cy="721" r="12" fill="${C.banana}"/><circle cx="426" cy="704" r="12" fill="${C.water2}"/><circle cx="455" cy="687" r="11" fill="${C.lav}"/></g>
      ${vardyMarkup({ handR: ['brush'] })}
      ${bit('design-bit', 0.8)}
    </g>`;
  const copy = `
    <p class="eyebrow" data-r>05 · The Painted Leaves</p>
    <h2 class="title" data-r>Design</h2>
    <p class="sub" data-r><em>every leaf, a little canvas</em></p>`;

  const s = makeScene('design', {
    label: 'The Painted Leaves', focus: 820, art, copy,
    defs: lin('design-sky', '#FFF4EA', '#EEF8EE') + `<mask id="design-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1300"><rect x="-200" y="-200" width="2000" height="1300" fill="#000"/>${strokes}<rect class="mask-full" x="-200" y="-200" width="2000" height="1300" fill="#fff" opacity="0"/></mask>`,
  });
  const rig = mountRig(s, '.vardy');
  rig.set('paintA', { x: 600, y: 650, sc: 0.95, happy: 1, lookX: 5 });
  const b = bitAt(s, 1300, 260);
  gsap.set(s.$$('.brush'), { drawSVG: '0%' });
  gsap.set(s.$$('.paint'), { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(s.$$('.sp'), { scale: 0, transformOrigin: '50% 50%' });

  // Watercolor brush reveal: wet strokes paint the scene over the previous one.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1 }, 0)
      .to(s.$$('.brush'), { drawSVG: '100%', duration: 1.1, stagger: 0.38, ease: 'power1.inOut' }, 0)
      .to(s.$('.mask-full'), { opacity: 1, duration: 0.6 }, 2.4)
      .set(prev.scene.el, { autoAlpha: 0 }, 3);
    cue(tl, 'whoosh', 0.1);
  }

  function play(tl) {
    for (let i = 0; i < 8; i++) rig.to(tl, i % 2 ? 'paintA' : 'paintB', 3 + i * 0.45, 0.45, { happy: 1 });
    tl.to(s.$$('.paint'), { scaleX: 1, duration: 0.5, stagger: 0.42, ease: 'power2.out' }, 3.1)
      .to(s.$$('.sp'), { scale: 1, duration: 0.4, stagger: 0.03, ease: 'back.out(3)' }, 3.4)
      .to(b, { x: 1220, y: 330, duration: 2.6, ease: 'sine.inOut' }, 3)
      .to(rig.s, { head: 8, lookX: 6, lookY: 2, duration: 0.6 }, 6.8);
    revealCopy(tl, s, 2.6);
    cue(tl, 'pop', 3.2); cue(tl, 'pop', 4.4); cue(tl, 'pop', 5.6);
    tl.to({}, { duration: 1 }, 7);
  }

  return { scene: s, rig, enter, play };
}
