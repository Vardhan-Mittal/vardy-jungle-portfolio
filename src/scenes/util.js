import { gsap } from 'gsap';
import { glow } from '../art/kit.js';
import { Rig } from '../art/vardy.js';
import { sfx } from '../ui/sound.js';

export const rigs = [];
export const state = { dir: 1, building: null };

// Fire a sound cue only while scrolling forward (scrubbed calls fire both ways).
export function cue(tl, name, at) {
  tl.call(() => { if (state.dir > 0 && !state.jumping) sfx(name); }, null, at);
}

// Build a scene: full-viewport section with one slice-scaled SVG (art) and HTML copy.
export function makeScene(id, { defs = '', art, copy = '', focus = 800, label }) {
  const el = document.createElement('section');
  el.className = 'scene';
  el.id = 's-' + id;
  el.setAttribute('aria-label', label || id);
  el.innerHTML =
    `<svg class="art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
    `<defs>${glow(id + '-bit', '#FFE27A')}${glow(id + '-lg', '#FFD66B')}${defs}</defs><g class="world">${art}</g></svg>` +
    `<div class="copy">${copy}</div>`;
  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const scene = { id, el, focus, $, $$, svg: $('svg.art'), world: $('.world'), loops: [] };
  state.building = scene;
  return scene;
}

// Where a 1600×900 scene point lands on screen, from the slice-scaling maths
// alone, so it works even for scenes that are hidden.
export function viewPoint(scene, x, y) {
  const W = innerWidth, H = innerHeight, s = Math.max(W / 1600, H / 900);
  const vbX = (W / H < 0.9 ? scene.focus : 800) - 800;
  return { x: (W - 1600 * s) / 2 + (x - vbX) * s, y: (H - 900 * s) / 2 + y * s };
}

// Map a point in a scene SVG (1600×900 space) to screen pixels.
export function svgPoint(svg, x, y) {
  const pt = svg.createSVGPoint();
  pt.x = x; pt.y = y;
  return pt.matrixTransform(svg.getScreenCTM());
}

export function mountRig(scene, sel, init) {
  const rig = new Rig(scene.$(sel), init);
  rig.scene = scene;
  rigs.push(rig);
  return rig;
}

// Count a number up inside an element.
export function counter(tl, el, to, at, { duration = 1.6, decimals = 0, prefix = '', suffix = '' } = {}) {
  const o = { v: 0 };
  el.textContent = prefix + (0).toFixed(decimals) + suffix;
  tl.to(o, { v: to, duration, ease: 'power2.out', onUpdate: () => { el.textContent = prefix + o.v.toFixed(decimals) + suffix; } }, at);
}

// Reveal copy blocks: each [data-r] rises in with a soft stagger.
export function revealCopy(tl, scene, at, stagger = 0.25) {
  const items = scene.$$('.copy [data-r]');
  tl.fromTo(items, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, stagger, ease: 'power3.out' }, at);
}

export function hideCopy(tl, scene, at) {
  tl.to(scene.$$('.copy [data-r]'), { autoAlpha: 0, y: -30, duration: 0.8, stagger: 0.08, ease: 'power2.in' }, at);
}

export function show(tl, scene, at) { tl.set(scene.el, { autoAlpha: 1 }, at); }
export function hide(tl, scene, at) { tl.set(scene.el, { autoAlpha: 0 }, at); }

// Ambient loops that run regardless of scroll (skipped for reduced motion).
// They belong to the scene being built, which pauses them while it is hidden.
export function ambient(fn) {
  if (state.reduced) return;
  const ctx = gsap.context(() => fn(gsap));
  state.building?.loops.push(...ctx.getTweens());
}

export function float(targets, { y = 12, x = 0, rot = 0, dur = 3 } = {}) {
  ambient(() => gsap.utils.toArray(targets).forEach((t, i) => {
    gsap.to(t, { y: `+=${y}`, x: `+=${x}`, rotation: `+=${rot}`, duration: dur + (i % 5) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 7) * 0.3 });
  }));
}

export function bitAt(scene, x, y) {
  const b = scene.$('.bit');
  gsap.set(b, { x, y });
  ambient(() => {
    gsap.to(scene.$('.bit-bob'), { y: -10, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(scene.$$('.bit .wing'), { scaleY: 0.4, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: -1 });
    gsap.to(scene.$('.bit-glow'), { scale: 1.25, transformOrigin: '50% 50%', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });
  return b;
}
