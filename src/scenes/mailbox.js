import { gsap } from 'gsap';
import { C, rng, lin, glow, canopy, cluster, vine, flower, leaf, bit, pollen } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { person } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy, float, svgPoint } from './util.js';
import { sfx } from '../ui/sound.js';

// Web3Forms access key (free, front-end safe: it can only deliver to your inbox).
// Put VITE_WEB3FORMS_KEY=... in .env; without it the form falls back to mailto.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const SLOT = [560, 418];

export function mailbox() {
  const r = rng(121);
  const puffs = [];
  for (let y = -40; y <= 940; y += 90) {
    puffs.push(`<circle cx="${600 + (r() - 0.5) * 40}" cy="${y}" r="${110 + r() * 70}"/>`, `<circle cx="${1800 + (r() - 0.5) * 40}" cy="${y + 45}" r="${110 + r() * 70}"/>`);
  }
  const art = `
    <rect width="1600" height="900" fill="url(#mail-sky)"/>
    <circle cx="320" cy="620" r="360" fill="url(#mail-sun)"/>
    <g class="motes">${pollen(40, 122, '#FFF1B8', 0, 0, 1600, 650)}</g>
    <g class="L-far">${canopy(700, 80, '#D6ECCB', 123, 160)}${canopy(800, 60, '#B8DFA6', 124, 130)}</g>
    <g class="garland">${vine(120, -10, 330, C.g1, 125, 12)}${flower(132, 344, 16, C.pink)}${vine(1460, -10, 280, C.g1, 126, -12)}${flower(1448, 294, 16, C.peach)}</g>
    <path d="M-120 628C200 618 600 610 960 596L962 618C600 632 200 640 -120 652Z" fill="${C.bark}"/>
    ${cluster(40, 610, 120, 20, [C.g1, C.g2, C.g0], r, 50, 90)}${leaf(860, 600, 70, 50, C.g2)}${leaf(820, 604, 56, -30, C.g1)}
    <g class="box">
      <rect x="552" y="452" width="16" height="160" fill="${C.bark2}"/>
      <path d="M484 470V420A76 54 0 0 1 636 420V470Z" fill="${C.g2}" stroke="${C.g0}" stroke-width="4"/>
      <path d="M496 466V424A64 44 0 0 1 624 424V466Z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
      <rect x="530" y="414" width="60" height="8" rx="4" fill="${C.g0}"/>
      <text x="560" y="454" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="22" fill="#fff">VM</text>
      <g class="flag"><rect x="632" y="372" width="7" height="62" rx="3" fill="${C.bark2}"/><path d="M639 374H676L668 386L676 398H639Z" fill="#E5533D"/></g>
    </g>
    ${vardyMarkup({ handL: ['letter'] })}
    ${bit('mailbox-bit', 0.9)}`;
  const copy = `
    <p class="eyebrow" data-r>11 · The Mailbox</p>
    <h2 class="title small" data-r>Leave a note</h2>
    <p class="sub" data-r>Vardy will carry it straight to my inbox.</p>
    <form class="mail" data-r novalidate>
      <input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <div class="row">
        <label><span>Name</span><input name="name" required autocomplete="name" placeholder="Your name" /></label>
        <label><span>Email</span><input name="email" type="email" required autocomplete="email" placeholder="you@example.com" /></label>
      </div>
      <label><span>Message</span><textarea name="message" rows="4" required placeholder="Hi Vardhan, let’s build…"></textarea></label>
      <button class="btn send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-6 18-3-7z" fill="currentColor"/></svg><span>Send with Vardy</span></button>
      <p class="status" role="status" aria-live="polite"></p>
    </form>
    <div class="sent" hidden>
      <p class="sent-title">Delivered! 🍃</p>
      <p>Thanks for the note. I’ll reply to you soon.</p>
      <button class="btn again" type="button">Send another</button>
    </div>
    <p class="credit" data-r>Hand-drawn in SVG, animated with GSAP, powered by bananas · © ${new Date().getFullYear()} ${person.name}</p>`;

  const s = makeScene('mailbox', { label: 'The Mailbox', focus: 600, art, copy, defs: lin('mail-sky', '#FFE7D8', '#FFF7EC') + glow('mail-sun', '#FFE2B0') });
  s.el.classList.add('copy-right');
  s.el.insertAdjacentHTML('beforeend',
    `<svg class="cloudwipe" viewBox="0 0 2400 900" preserveAspectRatio="none" aria-hidden="true"><g fill="#fff"><rect x="600" y="-100" width="1200" height="1100"/>${puffs.join('')}</g></svg>` +
    `<div class="envelope" aria-hidden="true"><svg viewBox="0 0 64 44"><rect x="2" y="2" width="60" height="40" rx="6" fill="#fff" stroke="${C.g1}" stroke-width="3"/><path d="M4 5L32 25L60 5" fill="none" stroke="${C.g1}" stroke-width="3"/></svg></div>`);
  const rig = mountRig(s, '.vardy');
  rig.set('lantern', { x: 430, y: 546, sc: 0.9, lookX: 5, follow: 0.6 });
  const b = bitAt(s, 720, 330);
  const flag = s.$('.flag');
  gsap.set(flag, { rotation: 90, svgOrigin: '635 432' });
  float(s.$$('.mote'), { y: -16, x: 6, dur: 3.2 });

  // ---------- Contact form ----------
  const form = s.$('.mail'), status = s.$('.status'), sent = s.$('.sent'), env = s.$('.envelope'), btn = s.$('.send');
  function deliver() {
    const card = form.getBoundingClientRect(), slot = svgPoint(s.svg, ...SLOT);
    const sx = card.left + card.width / 2, sy = card.top + card.height / 2;
    gsap.timeline()
      .to(form, { scaleY: 0.05, autoAlpha: 0, duration: 0.45, ease: 'power2.in', transformOrigin: '50% 50%' })
      .set(env, { x: sx, y: sy, scale: 1.6, rotation: 0, autoAlpha: 1 }, 0.35)
      .to(env, { x: slot.x, duration: 1.1, ease: 'power1.inOut' }, 0.45)
      .to(env, { keyframes: { y: [sy, Math.min(sy, slot.y) - 160, slot.y] }, scale: 0.35, rotation: -20, duration: 1.1, ease: 'sine.inOut' }, 0.45)
      .set(env, { autoAlpha: 0 }, 1.55)
      .to(flag, { rotation: 0, duration: 0.6, ease: 'back.out(3)' }, 1.55)
      .call(() => sfx('send'), null, 1.55)
      .to(rig, { react: 1, duration: 0.22, ease: 'power2.out' }, 1.6)
      .to(rig, { react: 0, duration: 0.6, ease: 'bounce.out' }, 1.85)
      .call(() => { form.hidden = true; sent.hidden = false; }, null, 1.9)
      .fromTo(sent, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.9);
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    if (!KEY) {
      const body = encodeURIComponent(`${data.message}\n\n${data.name} · ${data.email}`);
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${body}`;
      status.textContent = 'Opening your email app…';
      return;
    }
    btn.disabled = true;
    status.textContent = 'Folding your note…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: KEY, subject: `New note from ${data.name} via your portfolio`, from_name: 'Vardy’s Jungle', name: data.name, email: data.email, message: data.message }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'send failed');
      status.textContent = '';
      deliver();
    } catch {
      status.innerHTML = `The vine snapped. Please email me at <a href="mailto:${person.email}">${person.email}</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
  s.$('.again').addEventListener('click', () => {
    form.reset();
    gsap.to(sent, { autoAlpha: 0, duration: 0.3, onComplete: () => { sent.hidden = true; form.hidden = false; gsap.to(form, { scaleY: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' }); } });
    gsap.to(flag, { rotation: 90, duration: 0.5 });
  });

  // Cloud wipe: a bank of clouds rolls across and leaves the mailbox behind.
  function enter(tl, prev) {
    const wipe = s.$('.cloudwipe');
    tl.set(s.el, { autoAlpha: 1 }, 0)
      .set(s.$$('.art, .copy'), { autoAlpha: 0 }, 0)
      .fromTo(wipe, { autoAlpha: 1, xPercent: 34 }, { xPercent: -34, duration: 1.3, ease: 'power2.in' }, 0)
      .to(prev.scene.el, { scale: 1.05, duration: 1.3, ease: 'power1.in' }, 0)
      .set(prev.scene.el, { autoAlpha: 0, scale: 1 }, 1.3)
      .set(s.$$('.art, .copy'), { autoAlpha: 1 }, 1.3)
      .to(wipe, { xPercent: -100, duration: 1.3, ease: 'power2.out' }, 1.3)
      .set(wipe, { autoAlpha: 0 }, 2.6);
    cue(tl, 'whoosh', 0.2);
  }

  function play(tl) {
    rig.to(tl, 'wave', 2.8, 0.6, { happy: 1, open: 1 });
    tl.to(rig.s, { fR: -10, duration: 0.3, yoyo: true, repeat: 3 }, 3.4);
    rig.to(tl, 'lantern', 4.8, 0.6, { happy: 0, open: 0, lookX: 6 });
    tl.to(b, { x: 600, y: 360, duration: 2.4, ease: 'sine.inOut' }, 2.6);
    revealCopy(tl, s, 2.6, 0.2);
    tl.to({}, { duration: 2 }, 5.4);
  }

  return { scene: s, rig, enter, play };
}
