import { gsap } from 'gsap';
import { C, rng, lin, canopy, grass, cluster, bit } from '../art/kit.js';
import { vardyMarkup } from '../art/vardy.js';
import { zscaler } from '../data/content.js';
import { makeScene, mountRig, bitAt, cue, revealCopy } from './util.js';

const LINES = [
  '[ERR] 02:14:07 auth: token refresh timeout',
  '[WARN] edge-svc retry 3/3 upstream=sso',
  '[ERR] 02:14:09 policy sync failed code=504',
  '[INFO] tunnel re-handshake id=7f2c',
];

export function logs() {
  const r = rng(91);
  const faceRings = [1, 2, 3, 4, 5, 6].map((i) => `<ellipse class="fr" cx="520" cy="605" rx="${110 - i * 15}" ry="${186 - i * 26}" fill="none" stroke="${C.bark}" stroke-opacity=".55" stroke-width="3"/>`).join('');
  const lines = LINES.map((t, i) => `<text class="logline" x="610" y="${514 + i * 46}" font-family="JetBrains Mono, Consolas, monospace" font-size="15" fill="${C.mute}">${t}</text>`).join('');
  const tunnelRings = Array.from({ length: 9 }, (_, i) => `<circle class="tr-ring" cx="800" cy="450" r="${70 + i * 70}" fill="none" stroke="${i % 2 ? C.bark : '#D9A877'}" stroke-width="${26 + i * 6}"/>`).join('');
  const art = `
    <rect width="1600" height="900" fill="url(#logs-sky)"/>
    <g class="L-far">${canopy(640, 70, C.g4, 92, 150)}</g>
    <rect x="-100" y="760" width="1800" height="160" fill="${C.g3}"/>${grass(762, C.g2, 93)}
    <path d="M-140 420H520V790H-140Z" fill="${C.bark}"/><path d="M-140 440H500M-140 520H510M-140 640H510M-140 740H500" stroke="#000" stroke-opacity=".1" stroke-width="5"/>
    <ellipse cx="520" cy="605" rx="110" ry="186" fill="#D9A877"/><g class="face">${faceRings}</g>
    ${cluster(40, 420, 80, 12, [C.g1, C.g2], r, 30, 60)}
    <g class="lines">${lines}</g>
    <g transform="translate(1050 470)"><g class="rc"><rect width="380" height="200" rx="20" fill="#fff" stroke="${C.g2}" stroke-width="2"/>
      <g font-family="Manrope, sans-serif"><text x="26" y="44" font-size="13" font-weight="800" letter-spacing="2" fill="${C.g1}">ROOT CAUSE</text>
      <text x="26" y="80" font-size="20" font-weight="700" fill="${C.ink}">SSO token expiry → refresh</text><text x="26" y="106" font-size="20" font-weight="700" fill="${C.ink}">storm on edge service.</text>
      <text class="fix" x="26" y="146" font-size="16" font-weight="600" fill="${C.g1}">✓ Rotate refresh window</text><text class="fix" x="26" y="172" font-size="16" font-weight="600" fill="${C.g1}">✓ Add jittered backoff</text></g></g></g>
    ${vardyMarkup({ front: ['book'] })}
    <g class="bubble" opacity="0"><rect x="380" y="170" width="250" height="52" rx="26" fill="#fff" stroke="${C.g1}" stroke-opacity=".25" stroke-width="2"/><path d="M410 220L398 244L430 220Z" fill="#fff"/>
      <text x="505" y="203" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="20" fill="${C.ink}">Logs have stories too.</text></g>
    ${bit('logs-bit', 1.4)}`;
  const copy = `
    <p class="eyebrow" data-r>08 · The Old Logs</p>
    <h2 class="title" data-r>${zscaler.company}</h2>
    <p class="sub" data-r>${zscaler.role} · ${zscaler.detail}</p>
    <p class="pill" data-r>${zscaler.extra}</p>`;

  const s = makeScene('logs', { label: 'The Old Logs', focus: 760, art, copy, defs: lin('logs-sky', '#EEF7EC', '#F8F3E2') });
  s.el.classList.add('copy-right');
  s.el.insertAdjacentHTML('beforeend', `<svg class="tunnel" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect class="tun-bg" x="-400" y="-400" width="2400" height="1700" fill="${C.bark2}"/><g class="tun">${tunnelRings}</g></svg>`);
  const rig = mountRig(s, '.vardy');
  rig.set('readStand', { x: 300, y: 360, sc: 0.8, happy: 1, follow: 0.4 });
  const b = bitAt(s, 1030, 560);
  gsap.set(s.$$('.logline'), { x: -80, autoAlpha: 0 });
  gsap.set(s.$('.rc'), { autoAlpha: 0, y: 30 });
  gsap.set(s.$$('.fix'), { autoAlpha: 0 });
  const rings = s.$$('.tr-ring');

  // Into the log: fly through a tunnel of tree rings and out into the light.
  function enter(tl, prev) {
    tl.set(s.el, { autoAlpha: 1 }, 0)
      .fromTo(s.$('.tunnel'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0)
      .fromTo(s.$('.tun'), { scale: 0.08, svgOrigin: '800 450' }, { scale: 1, duration: 1.2, ease: 'power2.in' }, 0)
      .set(prev.scene.el, { autoAlpha: 0 }, 1.2)
      .fromTo(rings, { scale: 1, svgOrigin: '800 450' }, { scale: 7, opacity: 0, duration: 1.4, stagger: { each: 0.06, from: 'end' }, ease: 'power2.in' }, 1.2)
      .to(s.$('.tun-bg'), { opacity: 0, duration: 0.8 }, 1.8)
      .set(s.$('.tunnel'), { autoAlpha: 0 }, 2.8);
    cue(tl, 'whoosh', 0.8);
  }

  function play(tl) {
    tl.to(s.$$('.logline'), { x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.3 }, 2.6)
      .to(s.$$('.fr'), { scale: 0.9, svgOrigin: '520 605', duration: 0.6, stagger: 0.08, yoyo: true, repeat: 1 }, 2.6)
      .to(s.$$('.logline'), { x: 380, autoAlpha: 0, duration: 1.2, stagger: 0.25, ease: 'power1.in' }, 4.4)
      .to(s.$('.bit-glow'), { attr: { r: 80 }, duration: 0.6, yoyo: true, repeat: 1 }, 5)
      .to(s.$('.rc'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.6)' }, 5.4)
      .to(s.$$('.fix'), { autoAlpha: 1, duration: 0.4, stagger: 0.3 }, 6)
      .to(s.$('.bubble'), { opacity: 1, duration: 0.5 }, 3.2)
      .to(s.$('.bubble'), { opacity: 0, duration: 0.5 }, 6.2)
      .to(rig.s, { head: 10, lookX: 6, lookY: 3, duration: 0.6 }, 5.4);
    revealCopy(tl, s, 2.6);
    cue(tl, 'chime', 5.5);
    tl.to({}, { duration: 1 }, 7);
  }

  return { scene: s, rig, enter, play };
}
