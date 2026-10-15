// A small leaf that follows the pointer (fine pointers only).
import { gsap } from 'gsap';

export function leafCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const el = document.querySelector('.cursor');
  el.innerHTML = '<svg viewBox="-14 -26 28 30"><path d="M0 0C9 -6 8 -20 0 -26C-8 -20 -9 -6 0 0Z" fill="#2F7D4F"/><path d="M0 0L0 -22" stroke="#A8D98A" stroke-width="1.6"/></svg>';
  document.documentElement.classList.add('has-cursor');
  const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    el.style.opacity = 1;
    xTo(e.clientX); yTo(e.clientY);
    el.classList.toggle('big', !!e.target.closest('a, button, .vardy, .card, .constellation'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => { el.style.opacity = 0; });
}
