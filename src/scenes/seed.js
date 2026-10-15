import { gsap } from 'gsap';
import { C, rng, lin, canopy, grass, leaf, bit, medal, n } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { makeScene, mountRig, bitAt, cue, revealCopy } from './util.js';

export function seed() {
  const r = rng(21);
  let pebbles = '';
  for (let i = 0; i < 40; i++) pebbles += `<ellipse cx="${n(r() * 1700 - 50)}" cy="${n(560 + r() * 330)}" rx="${n(4 + r() * 10)}" ry="${n(3 + r() * 6)}" fill="#8E6440" opacity=".35"/>`;
  const art = `
    <rect width="1600" height="900" fill="url(#seed-sky)"/>
    <g class="L-far">${canopy(470, 60, C.g4, 22, 160)}</g>
    <rect x="-100" y="520" width="1800" height="400" fill="url(#seed-soil)"/>${pebbles}
    <path class="root" d="M800 650C780 710 720 740 690 810" /><path class="root" d="M800 650C820 720 880 750 900 830"/><path class="root" d="M800 650C800 730 790 790 800 870"/>
    <path class="root thin" d="M720 735C690 760 650 770 620 800"/><path class="root thin" d="M870 760C900 780 930 790 960 800"/>
    ${grass(522, C.g2, 4)}<rect x="-100" y="516" width="1800" height="8" fill="${C.g2}"/>
    <circle class="seed-glow" cx="800" cy="640" r="70" fill="url(#seed-lg)"/>
    <path class="half-l" d="M770 650Q770 610 798 606L792 660Z" fill="#C8873F"/><path class="half-r" d="M830 650Q830 610 802 606L808 660Z" fill="#B57636"/>
    <path class="stem" d="M800 640C796 570 812 490 800 390" stroke="${C.g1}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <g class="sprout s1">${leaf(800, 392, 110, -55, C.g2)}</g><g class="sprout s2">${leaf(800, 392, 110, 55, C.g3)}</g><g class="sprout s3">${leaf(803, 470, 70, 60, C.g2)}</g>
    <g class="umbrella"><path d="M470 530L560 230" stroke="${C.bark}" stroke-width="6"/>${leaf(470, 530, 330, -24, C.g1)}</g>
    ${vardyMarkup({ front: ['book'], head: ['glasses'] })}
    <g class="bug"><circle r="7" fill="#E5533D"/><circle cx="0" cy="-5" r="4" fill="${C.ink}"/><circle cx="-3" cy="2" r="1.5" fill="${C.ink}"/><circle cx="3" cy="1" r="1.5" fill="${C.ink}"/></g>
    ${bit('seed-bit', 0.8)}`;
  const copy = `
    <p class="eyebrow" data-r>01 · The Seed</p>
    <svg class="medal" data-r viewBox="-64 -70 128 172" aria-hidden="true">${medal(62)}</svg>
    <h2 class="title" data-r>NTSE Scholar</h2>
    <p class="sub" data-r><em>where the curiosity took root</em></p>`;

  const s = makeScene('seed', { label: 'The Seed', focus: 640, art, copy, defs: lin('seed-sky', '#F1FAF2', '#FFF3D8') + lin('seed-soil', '#C79A6C', '#9C6B47') });
  s.el.classList.add('copy-right', 'clip');
  const rig = mountRig(s, '.vardy');
  rig.set('read', { x: 520, y: 470, sc: 0.7, happy: 1, follow: 0.4 });
  const b = bitAt(s, 940, 560);
  gsap.set(s.$('.bug'), { x: 260, y: 512 });
  gsap.set(s.$$('.root'), { drawSVG: '0%' });
  gsap.set(s.$('.stem'), { drawSVG: '0%' });
  gsap.set(s.$$('.s1, .s2'), { scale: 0, svgOrigin: '800 392' });
  gsap.set(s.$('.s3'), { scale: 0, svgOrigin: '803 470' });
  gsap.set(s.$('.umbrella'), { rotation: -70, svgOrigin: '470 530' });

  // Iris: dive into the glowing seed on the hero's forest floor.
  function enter(tl, prev) {
    s.anchor = { scene: prev.scene, x: 800, y: 812 };
    tl.set(s.el, { autoAlpha: 1, '--r': '0vmax' }, 0)
      .to(prev.scene.world, { scale: 7, svgOrigin: '800 812', duration: 2.4, ease: 'power2.in' }, 0)
      .to(s.el, { '--r': '150vmax', duration: 2.2, ease: 'power2.in' }, 0.3)
      .set(prev.scene.el, { autoAlpha: 0 }, 2.5);
    cue(tl, 'whoosh', 0.3);
  }

  function play(tl) {
    tl.to(s.$('.half-l'), { rotation: -32, svgOrigin: '795 660', duration: 0.8, ease: 'back.out(2)' }, 2.4)
      .to(s.$('.half-r'), { rotation: 32, svgOrigin: '805 660', duration: 0.8, ease: 'back.out(2)' }, 2.4)
      .to(s.$('.stem'), { drawSVG: '100%', duration: 1.6, ease: 'power1.inOut' }, 2.7)
      .to(s.$$('.root'), { drawSVG: '100%', duration: 1.8, stagger: 0.15 }, 2.6)
      .to(s.$$('.sprout'), { scale: 1, duration: 1, stagger: 0.25, ease: 'back.out(1.6)' }, 3.8)
      .to(s.$('.umbrella'), { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 3)
      .to(s.$('.bug'), { x: 548, y: 402, duration: 2.2, ease: 'sine.inOut' }, 3.4)
      .to(rig.s, { lookX: 6, lookY: -2, head: 8, duration: 0.8 }, 4.6)
      .to(b, { x: 870, y: 430, duration: 1.6 }, 3.6);
    cue(tl, 'pop', 2.5);
    revealCopy(tl, s, 3.6);
    tl.fromTo(s.$('.medal'), { scale: 0.2, rotation: -200 }, { scale: 1, rotation: 0, duration: 1.4, ease: 'back.out(1.4)' }, 3.9);
    cue(tl, 'chime', 4.1);
    tl.to({}, { duration: 1 }, 6);
  }

  return { scene: s, rig, enter, play };
}
