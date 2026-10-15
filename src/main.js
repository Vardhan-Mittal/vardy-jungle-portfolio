import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';
import { inject } from '@vercel/analytics';
import 'lenis/dist/lenis.css';
import './styles.css';

import { rigs, state, viewPoint } from './scenes/util.js';
import { hero } from './scenes/hero.js';
import { seed } from './scenes/seed.js';
import { trunk } from './scenes/trunk.js';
import { vines } from './scenes/vines.js';
import { sunlit } from './scenes/sunlit.js';
import { design } from './scenes/design.js';
import { houses } from './scenes/houses.js';
import { river } from './scenes/river.js';
import { logs } from './scenes/logs.js';
import { fireflies } from './scenes/fireflies.js';
import { treetop } from './scenes/treetop.js';
import { mailbox } from './scenes/mailbox.js';
import { branchBar } from './ui/branchbar.js';
import { leafCursor } from './ui/cursor.js';
import { sfx, toggleSound, initSound } from './ui/sound.js';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
// Vercel Web Analytics: anonymous page views, no cookies (live site only).
if (!/^(localhost|127.|[::1])/.test(location.hostname)) inject();
state.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const stage = document.getElementById('stage');
const spacer = document.getElementById('scroll-space');
// The hero is built straight away; the other chapters are built one per frame
// while the loader plays, so no single long task blocks the page.
const chapters = [hero()];
stage.appendChild(chapters[0].scene.el);
const LATER = [seed, trunk, vines, sunlit, design, houses, river, logs, fireflies, treetop, mailbox];
async function buildScenes() {
  for (const make of LATER) {
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r)));
    const c = make();
    stage.appendChild(c.scene.el);
    gsap.set(c.scene.el, { autoAlpha: 0 });
    chapters.push(c);
  }
}

// ---------- Layout: portrait focus and transition anchors ----------
function layout() {
  const portrait = innerWidth / innerHeight < 0.9;
  chapters.forEach(({ scene }) => scene.svg.setAttribute('viewBox', `${(portrait ? scene.focus : 800) - 800} 0 1600 900`));
  chapters.forEach(({ scene }) => {
    if (!scene.anchor) return;
    const p = viewPoint(scene.anchor.scene, scene.anchor.x, scene.anchor.y);
    scene.el.style.setProperty('--cx', `${p.x}px`);
    scene.el.style.setProperty('--cy', `${p.y}px`);
  });
}

// ---------- Only visible chapters animate ----------
// Hidden chapters pause their ambient loops (and skip rendering via CSS);
// rigs re-render every tick only while their chapter is on screen.
gsap.ticker.add((time) => {
  for (const { scene } of chapters) {
    const vis = scene.el.style.visibility !== 'hidden';
    if (vis !== scene.vis) {
      scene.vis = vis;
      for (const t of scene.loops) vis ? t.resume() : t.pause();
    }
  }
  for (const r of rigs) if (r.scene.vis) r.render(time);
});
function wireRigs() {
  rigs.forEach((r) => {
    r.calm = state.reduced;
    r.el.addEventListener('click', () => {
      gsap.timeline().to(r, { react: 1, duration: 0.22, ease: 'power2.out' }).to(r, { react: 0, duration: 0.5, ease: 'bounce.out' });
      sfx('chirp');
    });
  });
}

// ---------- Smooth scroll ----------
const lenis = new Lenis({ lerp: state.reduced ? 1 : 0.085, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();
document.body.classList.add('locked');

// ---------- Master scroll story ----------
const UNIT = () => Math.max(110, innerHeight * 0.15); // scroll px per timeline unit
let master, starts = [], bar, syncUI = () => {};

function buildStory() {
  master = gsap.timeline({ paused: true });
  chapters.forEach((c, i) => {
    const sub = gsap.timeline();
    if (i) c.enter(sub, chapters[i - 1]);
    c.play(sub);
    starts.push(master.duration() + (i ? 2.4 : 0));
    master.add(sub, master.duration());
  });
  const setHeight = () => { spacer.style.height = `${master.duration() * UNIT() + innerHeight}px`; };
  setHeight();
  ScrollTrigger.addEventListener('refreshInit', () => { setHeight(); layout(); });

  bar = branchBar(document.getElementById('branch'), jump);
  const cue = document.querySelector('.scroll-cue');
  let lastIndex = 0;
  syncUI = (dir = 1) => {
    const t = master.time();
    let i = 0;
    while (i < starts.length - 1 && t >= starts[i + 1] - 1.2) i++;
    const next = starts[i + 1] ?? master.duration();
    const local = Math.min(1, Math.max(0, (t - starts[i]) / (next - starts[i])));
    bar.update(i, (i + local) / (chapters.length - 1));
    setSection(SECTION_OF(i));
    if (i !== lastIndex && dir > 0 && !jumping) sfx('rustle');
    lastIndex = i;
    cue.style.opacity = t > 0.3 ? 0 : 1;
  };
  ScrollTrigger.create({
    trigger: spacer, start: 'top top', end: 'bottom bottom',
    animation: master, scrub: state.reduced ? true : 0.9,
    onUpdate(self) {
      state.dir = self.direction;
      syncUI(self.direction);
    },
  });
  bar.update(0, 0);
  if (import.meta.env.DEV) window.__story = { master, starts, lenis, go: (t) => { const st = master.scrollTrigger; lenis.scrollTo(st.start + (t / master.duration()) * (st.end - st.start), { immediate: true }); } };
}

// Jump straight to a chapter: a quick leaf veil hides the cut, so the visitor
// skips the in-between chapters instead of watching them fast-forward.
const veil = document.getElementById('veil');
let jumping = false;
function jump(i) {
  if (!master || jumping) return;
  const st = master.scrollTrigger, toY = (t) => st.start + (t / master.duration()) * (st.end - st.start);
  // Land where the chapter begins, then glide through its own reveal.
  const y = toY(starts[i]);
  const settle = i === 0 ? y : i >= chapters.length - 1 ? st.end : toY(starts[i + 1] - 2.45);
  if (Math.abs(settle - lenis.scroll) < 4) return;
  jumping = true;
  sfx('rustle');
  gsap.timeline({ onComplete: () => { jumping = false; } })
    .set(veil, { visibility: 'visible' })
    .to(veil, { opacity: 1, duration: 0.3, ease: 'power2.in' })
    .fromTo(veil.firstElementChild, { rotation: -50, scale: 0.5 }, { rotation: 15, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0)
    .call(() => {
      state.jumping = true;
      lenis.scrollTo(y, { immediate: true, force: true });
      ScrollTrigger.update();
      st.getTween()?.progress(1); // finish the scrub instantly
      state.jumping = false;
      syncUI(0);
    })
    .to(veil, { opacity: 0, duration: 0.45, ease: 'power2.out' }, '+=0.08')
    .set(veil, { visibility: 'hidden' })
    .call(() => lenis.scrollTo(settle, { duration: 2.2, easing: (x) => 1 - Math.pow(1 - x, 3) }));
}

// ---------- Floating nav ----------
const navLinks = [...document.querySelectorAll('.navpill a')];
const marker = document.querySelector('.navpill .marker');
const SECTION_OF = (i) => (i < 6 ? 0 : i < 9 ? 1 : i < 10 ? 2 : 3);
let section = -1;
function setSection(k, instant = false) {
  if (k === section && !instant) return;
  section = k;
  navLinks.forEach((a, j) => { a.classList.toggle('active', j === k); if (j === k) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  const a = navLinks[k];
  gsap.to(marker, { x: a.offsetLeft, width: a.offsetWidth, duration: instant ? 0 : 0.55, ease: 'back.out(1.5)' });
}
navLinks.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); jump(+a.dataset.go); }));
window.addEventListener('resize', () => setSection(Math.max(0, section), true));
setSection(0, true);

// Little jungle sounds on clicks (when sound is on).
document.addEventListener('click', (e) => {
  if (e.target.closest('.vardy, .sound')) return;
  if (e.target.closest('a, button, .card, .constellation, #branch')) sfx(Math.random() < 0.5 ? 'chirp' : 'leaf');
});

// ---------- Chrome ----------
const soundBtn = document.querySelector('.sound');
const showSound = (on) => {
  soundBtn.setAttribute('aria-pressed', on);
  soundBtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
};
// On by default; remember a visitor who muted it.
let savedSound = null;
try { savedSound = localStorage.getItem('vardy-sound'); } catch {}
showSound(initSound(savedSound !== 'off'));
soundBtn.addEventListener('click', () => {
  const on = toggleSound();
  showSound(on);
  try { localStorage.setItem('vardy-sound', on ? 'on' : 'off'); } catch {}
});
document.querySelector('.brand').addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(0, { duration: 2.5 }); });
leafCursor();
window.addEventListener('resize', () => layout());

// ---------- Loader → ripple → hero intro → story ----------
async function boot() {
  const scenesReady = buildScenes();
  layout();
  const loader = document.getElementById('loader');
  const pct = loader.querySelector('.pct span');
  const fill = loader.querySelector('.fill');
  const progress = { v: 0 };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const loading = gsap.to(progress, { v: 90, duration: 1, ease: 'power1.out', onUpdate: () => { pct.textContent = Math.round(progress.v); gsap.set(fill, { attr: { y: 292 - progress.v * 1.35 } }); } });
  await Promise.all([fontsReady, loading.then(), scenesReady]);
  wireRigs();
  await gsap.to(progress, { v: 100, duration: 0.3, onUpdate: () => { pct.textContent = Math.round(progress.v); gsap.set(fill, { attr: { y: 292 - progress.v * 1.35 } }); } }).then();
  layout();

  const open = gsap.timeline();
  open.to(loader.querySelector('.pct'), { autoAlpha: 0, duration: 0.3 })
    .to(loader.querySelector('.drop'), { y: 420, duration: 0.55, ease: 'power2.in' }, 0.1)
    .call(() => sfx('drop'), null, 0.6)
    .set(stage, { '--lr': '0vmax' }, 0.62)
    .set(loader, { background: 'transparent' }, 0.62)
    .to(loader.querySelector('svg'), { autoAlpha: 0, duration: 0.2 }, 0.62)
    .to(stage, { '--lr': '150vmax', duration: 1.6, ease: 'power2.in' }, 0.62)
    .set(loader, { display: 'none' });
  const intro = chapters[0].intro();
  open.add(intro, 0.7);
  const skip = () => intro.timeScale(3);
  window.addEventListener('wheel', skip, { once: true, passive: true });
  window.addEventListener('touchstart', skip, { once: true, passive: true });
  await open.then();
  window.removeEventListener('wheel', skip);
  window.removeEventListener('touchstart', skip);

  buildStory();
  setSection(0, true);
  document.body.classList.remove('locked');
  lenis.start();
  ScrollTrigger.refresh();
}
boot();
