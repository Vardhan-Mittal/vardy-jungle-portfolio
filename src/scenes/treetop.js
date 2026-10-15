import { gsap } from 'gsap';
import { C, lin, glow, canopy, leaf, bit } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { person, links } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, ambient } from './util.js';

const ICONS = {
  email: '<path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
  github: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" fill="currentColor"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 10v7M7.5 7v.01M11.5 17v-4a2 2 0 0 1 4 0v4M11.5 10v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  leetcode: '<path d="M14 4l-7 7 7 7M8 11h11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  codechef: '<path d="M6 14c-2-1-2-5 1-5 0-3 4-4 5-2 1-2 5-1 5 2 3 0 3 4 1 5v5H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  resume: '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12h7M9 16h7M9 8h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};

export function treetop() {
  const clouds = [[300, 220, 1], [1260, 180, 1.2], [760, 120, 0.7], [1500, 330, 0.8]].map(([x, y, k]) =>
    `<g class="cloud" transform="translate(${x} ${y}) scale(${k})"><ellipse rx="120" ry="34" fill="#fff"/><ellipse cx="60" cy="-20" rx="80" ry="34" fill="#fff"/><ellipse cx="-50" cy="-12" rx="60" ry="28" fill="#fff"/></g>`).join('');
  const art = `
    <rect width="1600" height="900" fill="url(#top-sky)"/>
    <circle cx="800" cy="640" r="420" fill="url(#top-sun)"/><circle class="sun" cx="800" cy="640" r="130" fill="#FFE9A8"/>
    <g class="clouds">${clouds}</g>
    <g class="L-sea">${canopy(640, 90, '#CFE6B8', 112, 170)}${canopy(720, 80, '#A9D493', 113, 150)}${canopy(820, 70, C.g2, 114, 130)}</g>
    <g class="lift">${leaf(800, 620, 260, -90, C.g1)}${leaf(800, 620, 260, 90, C.g2)}${vardyMarkup({})}</g>
    ${bit('treetop-bit', 1)}`;
  const linkHtml = links.map((l) => `<a class="link" href="${l.href}" ${l.id === 'email' ? '' : 'target="_blank" rel="noopener"'} aria-label="${l.label}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[l.id]}</svg><span>${l.label}</span></a>`).join('');
  const copy = `
    <p class="eyebrow" data-r>10 · The Treetop</p>
    <h2 class="title" data-r>Say hello</h2>
    <p class="sub" data-r><a href="mailto:${person.email}">${person.email}</a></p>
    <div class="sign"><div class="rope"></div><div class="board"><p class="sign-title">Let’s build<br/>something together.</p><nav class="links" aria-label="Contact links">${linkHtml}</nav></div></div>`;

  const s = makeScene('treetop', { label: 'The Treetop', focus: 800, art, copy, defs: lin('top-sky', '#FFF3D6', '#FFD4A6') + glow('top-sun', '#FFE29A') });
  const rig = mountRig(s, '.vardy');
  rig.set('stand', { x: 800, y: 510, sc: 1.05, lookY: -2 });
  const b = bitAt(s, 940, 340);
  gsap.set(s.$('.sign'), { rotation: -100, transformOrigin: '50% 0%', autoAlpha: 0 });
  gsap.set(s.$$('.link'), { scale: 0, autoAlpha: 0 });
  ambient(() => s.$$('.cloud').forEach((c, i) => gsap.to(c, { x: '+=' + (60 + i * 20), duration: 9 + i * 2, yoyo: true, repeat: -1, ease: 'sine.inOut' })));

  // Leaf lift: a breeze carries Vardy up; the old scene drops away below.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1 }, 0)
      .to(prev.scene.el, { yPercent: 70, duration: 2.6, ease: 'power2.inOut' }, 0)
      .fromTo(s.$('.L-sea'), { y: 700 }, { y: 0, duration: 2.6, ease: 'power2.out' }, 0)
      .fromTo(s.$('.lift'), { y: 900 }, { y: 0, duration: 2.8, ease: 'power3.out' }, 0)
      .fromTo(s.$('.clouds'), { y: -500 }, { y: 0, duration: 2.6, ease: 'power2.out' }, 0)
      .fromTo(s.$('.sun'), { attr: { r: 60 } }, { attr: { r: 130 }, duration: 2.6 }, 0)
      .set(prev.scene.el, { autoAlpha: 0, yPercent: 0 }, 2.6);
    cue(tl, 'whoosh', 0.2);
  }

  function play(tl) {
    rig.to(tl, 'cheer', 2.6, 0.7, { happy: 1, open: 1 });
    rig.to(tl, 'wave', 3.6, 0.6, { happy: 1, open: 0 });
    tl.to(rig.s, { fR: -10, duration: 0.3, yoyo: true, repeat: 3 }, 4.2)
      .to(s.$('.sign'), { rotation: 0, autoAlpha: 1, duration: 1.6, ease: 'elastic.out(1, 0.45)' }, 3)
      .to(s.$$('.link'), { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2.5)' }, 3.8)
      .to(b, { x: 1000, y: 300, duration: 2, ease: 'sine.inOut' }, 3);
    revealCopy(tl, s, 2.6);
    cue(tl, 'chime', 3.8);
    tl.to({}, { duration: 1.5 }, 5.5);
  }

  return { scene: s, rig, enter, play };
}
