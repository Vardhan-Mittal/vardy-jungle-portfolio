import { gsap } from 'gsap';
import { C, rng, lin, trunk as trunkArt, cluster, leaf, bit, n } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { education } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, counter, float } from './util.js';

// A circuit trace climbing the bark: vertical runs with right-angle jogs.
function trace(seed, x0) {
  const r = rng(seed);
  let x = x0, y = 760, d = `M${x} ${y}`, nodes = [];
  while (y > -1300) {
    y -= 120 + r() * 160; d += `V${n(y)}`; nodes.push([x, y]);
    const nx = Math.min(950, Math.max(650, x + (r() > .5 ? 1 : -1) * (40 + r() * 50))); d += `H${n(nx)}`; x = nx; nodes.push([x, y]);
  }
  return { d, nodes };
}

export function trunk() {
  const r = rng(31);
  const traces = [trace(5, 700), trace(9, 790), trace(13, 880)];
  const traceSvg = traces.map((t) => `<path class="tr-glow" d="${t.d}"/><path class="tr" d="${t.d}"/>`).join('');
  const nodeSvg = traces.flatMap((t) => t.nodes.filter((_, i) => i % 2 === 0)).map(([x, y]) => `<circle cx="${x}" cy="${n(y)}" r="16" fill="url(#trunk-lg)"/><circle cx="${x}" cy="${n(y)}" r="5" fill="#FFF3C4"/>`).join('');
  const rn = [[520, 860], [620, 820], [800, 850], [980, 820], [1080, 860], [700, 885], [900, 885]];
  let net = '';
  for (let k = 0; k < rn.length; k++) for (let m = k + 1; m < rn.length; m++) if (Math.abs(rn[k][0] - rn[m][0]) < 260) net += `<path class="syn" d="M${rn[k][0]} ${rn[k][1]}L${rn[m][0]} ${rn[m][1]}" stroke="${C.water2}" stroke-opacity=".7" stroke-width="2"/>`;
  net += rn.map(([x, y]) => `<circle class="neuron" cx="${x}" cy="${y}" r="7" fill="${C.water}" stroke="#fff" stroke-width="2"/>`).join('');
  let stubs = '';
  for (let y = 300; y > -1300; y -= 330) {
    const side = (y / 330) % 2 ? 1 : -1, bx = 800 + side * 175;
    stubs += `<path d="M${800 + side * 140} ${y}L${bx + side * 90} ${y - 50}" stroke="${C.bark}" stroke-width="26" stroke-linecap="round"/>${cluster(bx + side * 120, y - 70, 90, 12, [C.g1, C.g2, C.g3], r, 30, 60)}`;
  }
  let falling = '';
  for (let i = 0; i < 8; i++) falling += `<g class="fall">${leaf(200 + r() * 1200, -60 - r() * 300, 26, r() * 360, i % 2 ? C.g2 : C.g3, false)}</g>`;

  const art = `
    <rect width="1600" height="900" fill="url(#trunk-sky)"/>
    <g class="L-far">${trunkArt(160, -700, 910, 90, '#D4EBCC', 1)}${trunkArt(1330, -700, 910, 110, '#D4EBCC', 2)}${cluster(1330, -100, 160, 20, ['#C4E4B6', '#B4DBA6'], r, 40, 80)}${cluster(160, 100, 140, 16, ['#C4E4B6', '#B4DBA6'], r, 40, 80)}</g>
    <g class="L-climb">
      <path d="M620 750C570 790 530 820 470 860M980 750C1030 790 1070 820 1130 860M760 760C740 800 720 830 700 880M840 760C860 800 880 830 900 880" stroke="${C.bark2}" stroke-width="26" fill="none" stroke-linecap="round"/>
      ${stubs}${trunkArt(800, -1400, 760, 380, C.bark, 7)}${traceSvg}${nodeSvg}<g class="net">${net}</g>
    </g>
    ${vardyMarkup({})}
    ${bit('trunk-bit', 0.9)}${falling}`;
  const copy = `
    <p class="eyebrow" data-r>02 · The Trunk of Light</p>
    <h2 class="title" data-r>${education.school}</h2>
    <p class="sub" data-r>${education.degree} · ${education.years}</p>
    <p class="big" data-r><span class="num" data-cgpa>0.00</span></p>
    <p class="label" data-r>CGPA / 10</p>`;

  const s = makeScene('trunk', { label: 'The Trunk of Light', focus: 800, art, copy, defs: lin('trunk-sky', '#EAF7F0', '#F7FBEF') });
  const rig = mountRig(s, '.vardy');
  rig.set('climbA', { x: 810, y: 560, sc: 0.9, lookY: -4, follow: 0.3 });
  const b = bitAt(s, 870, 300);
  gsap.set(s.$$('.tr, .tr-glow'), { drawSVG: '0%' });
  float(s.$$('.neuron'), { y: -4, dur: 1.2 });
  s.$$('.fall').forEach((f, i) => gsap.set(f, { y: -200 }));

  // Growth zoom: the sapling's stem rushes up past the camera and becomes this trunk.
  function enter(tl, prev) {
    tl.to(prev.scene.world, { scale: 10, svgOrigin: '800 430', duration: 2.4, ease: 'power3.in' }, 0)
      .set(s.el, { autoAlpha: 0 }, 0)
      .to(s.el, { autoAlpha: 1, duration: 1, ease: 'none' }, 1.4)
      .fromTo(s.world, { scale: 1.7, svgOrigin: '800 600' }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 1.4)
      .set(prev.scene.el, { autoAlpha: 0 }, 2.4);
    cue(tl, 'whoosh', 0.6);
  }

  function play(tl) {
    const t0 = 3, climb = 7;
    tl.to(s.$('.L-climb'), { y: 1250, duration: climb, ease: 'none' }, t0)
      .to(s.$('.L-far'), { y: 420, duration: climb, ease: 'none' }, t0)
      .to(s.$$('.tr, .tr-glow'), { drawSVG: '100%', duration: climb + 1.6, ease: 'none' }, t0 - 1.6)
      .to(b, { y: 220, x: 900, duration: climb, ease: 'sine.inOut' }, t0);
    for (let i = 0; i < 10; i++) rig.to(tl, i % 2 ? 'climbA' : 'climbB', t0 + i * (climb / 10), climb / 10, { y: 560 - (i % 2) * 8 });
    s.$$('.fall').forEach((f, i) => tl.to(f, { y: 1100, x: '+=' + (i % 2 ? 120 : -120), rotation: i % 2 ? 200 : -160, duration: 5, ease: 'none' }, t0 + i * 0.6));
    revealCopy(tl, s, 2.2);
    counter(tl, s.$('[data-cgpa]'), education.cgpa, 3.4, { decimals: 2, duration: 2.2 });
    cue(tl, 'pop', 5.4);
  }

  return { scene: s, rig, enter, play };
}
