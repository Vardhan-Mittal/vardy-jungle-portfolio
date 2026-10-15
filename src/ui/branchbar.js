// Branch scrollbar: a vine that grows up the right edge as you climb.
// Each chapter is a node; reaching it sprouts a pair of leaves and a berry.
import { gsap } from 'gsap';
import { chapters } from '../data/content.js';

const H = 800, X = 22;
const leafPath = (l, w = l * 0.36) => `M0 0C${w} ${-l * .25} ${w * .8} ${-l * .8} 0 ${-l}C${-w * .8} ${-l * .8} ${-w} ${-l * .25} 0 0Z`;

export function branchBar(root, onJump) {
  const count = chapters.length, ys = chapters.map((_, i) => H - 20 - i * ((H - 40) / (count - 1)));
  const stem = `M${X} ${H - 20}C${X - 8} ${H * .7} ${X + 8} ${H * .35} ${X} 20`;
  let nodes = '';
  ys.forEach((y, i) => {
    nodes += `<g class="bn" data-i="${i}" transform="translate(${X} ${y})">` +
      `<g class="bl"><path d="${leafPath(18)}" fill="#5BAE6A" transform="rotate(-58)"/><path d="${leafPath(15)}" fill="#A8D98A" transform="rotate(58)"/></g>` +
      `<circle class="dot" r="5" fill="none" stroke="#2F7D4F" stroke-opacity=".45" stroke-width="2"/><circle class="berry" r="6.5" fill="#FFC93C" stroke="#fff" stroke-width="2"/></g>`;
  });
  root.innerHTML = `<svg viewBox="0 0 44 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${stem}" stroke="#2F7D4F" stroke-opacity=".2" stroke-width="3" fill="none"/>` +
    `<path class="grow" d="${stem}" stroke="#2F7D4F" stroke-width="4" fill="none" stroke-linecap="round"/>${nodes}</svg>` +
    chapters.map((c, i) => `<button type="button" style="top:${(ys[i] / H) * 100}%" data-i="${i}" aria-label="Go to ${c}"><span class="tip">${c}</span></button>`).join('');

  const grow = root.querySelector('.grow');
  const bn = [...root.querySelectorAll('.bn')], btn = [...root.querySelectorAll('button')];
  bn.forEach((g) => {
    gsap.set(g.querySelector('.bl'), { scale: 0, transformOrigin: '0px 0px' });
    gsap.set(g.querySelector('.berry'), { scale: 0, transformOrigin: '50% 50%' });
  });
  gsap.set(grow, { drawSVG: '0%' });
  btn.forEach((b) => b.addEventListener('click', () => onJump(+b.dataset.i)));

  let reached = -1, current = -1;
  return {
    // index: current chapter; frac: 0..1 progress along the whole vine.
    update(index, frac) {
      gsap.set(grow, { drawSVG: `0% ${Math.max(0.5, frac * 100)}%` });
      while (reached < index) {
        reached++;
        gsap.to(bn[reached].querySelector('.bl'), { scale: 1, duration: 0.6, ease: 'back.out(2.5)' });
        gsap.to(bn[reached].querySelector('.berry'), { scale: 1, duration: 0.4, delay: 0.15, ease: 'back.out(3)' });
      }
      while (reached > index) {
        gsap.to(bn[reached].querySelector('.bl'), { scale: 0, duration: 0.3 });
        gsap.to(bn[reached].querySelector('.berry'), { scale: 0, duration: 0.3 });
        reached--;
      }
      if (index !== current) {
        btn[current]?.classList.remove('current');
        btn[index]?.classList.add('current');
        btn[index]?.setAttribute('aria-current', 'step');
        btn[current]?.removeAttribute('aria-current');
        current = index;
      }
    },
  };
}
