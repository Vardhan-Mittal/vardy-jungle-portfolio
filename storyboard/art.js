// Storyboard art kit: pure functions that return SVG strings.
// Runs unchanged in the browser preview and inside the Figma plugin sandbox.
var C = {
  sky: '#EAF7F0', cream: '#FFF6DA', g0: '#1F5E3A', g1: '#2F7D4F', g2: '#5BAE6A', g3: '#A8D98A', g4: '#CFE9CF', g5: '#E2F3DE',
  sun: '#FFD66B', bark: '#8A5A3B', bark2: '#6E4428', banana: '#FFC93C', ink: '#1E2B24', mute: '#5D6F65',
  peach: '#FFD9C2', lav: '#D9D3F5', fur: '#7A4A2A', tan: '#F2D3A8', tan2: '#E4B98A', pink: '#F4A3A3',
  water: '#BDE7EA', water2: '#7FCAD3', soil: '#B8875D', white: '#FFFFFF'
};
var SERIF = "Fraunces, Georgia, serif", SANS = "Manrope, Inter, Arial, sans-serif";

function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function n(v) { return Math.round(v * 10) / 10; }

function T(x, y, s, size, fill, o) {
  o = o || {};
  return '<text x="' + n(x) + '" y="' + n(y) + '" font-family="' + (o.serif ? SERIF : SANS) + '" font-size="' + size + '" font-weight="' + (o.w || (o.serif ? 600 : 500)) + '" fill="' + (fill || C.ink) + '"' +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + (o.op ? ' opacity="' + o.op + '"' : '') + (o.it ? ' font-style="italic"' : '') + '>' + s + '</text>';
}

function leaf(x, y, l, r, fill, vein) {
  var w = l * 0.36;
  var s = '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(r) + ')"><path d="M0 0C' + n(w) + ' ' + n(-l * .25) + ' ' + n(w * .8) + ' ' + n(-l * .8) + ' 0 ' + n(-l) + 'C' + n(-w * .8) + ' ' + n(-l * .8) + ' ' + n(-w) + ' ' + n(-l * .25) + ' 0 0Z" fill="' + fill + '"/>';
  if (vein !== false) s += '<path d="M0 0L0 ' + n(-l * .9) + '" stroke="#000" stroke-opacity=".13" stroke-width="' + n(Math.max(1, l * .025)) + '" fill="none"/>';
  return s + '</g>';
}

function cluster(cx, cy, rad, count, cols, rnd, lmin, lmax) {
  var s = '';
  for (var i = 0; i < count; i++) {
    var a = rnd() * Math.PI * 2, d = rad * Math.sqrt(rnd()) * .7;
    s += leaf(cx + Math.cos(a) * d, cy + Math.sin(a) * d, lmin + rnd() * (lmax - lmin), a * 180 / Math.PI + 90 + (rnd() - .5) * 40, cols[i % cols.length]);
  }
  return s;
}

function frond(x, y, len, rot, col, cnt) {
  cnt = cnt || 9;
  var s = '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rot) + ')"><path d="M0 0Q' + n(len * .15) + ' ' + n(-len * .5) + ' 0 ' + n(-len) + '" stroke="' + col + '" stroke-width="' + n(len * .025) + '" fill="none" stroke-linecap="round"/>';
  for (var i = 1; i <= cnt; i++) {
    var t = i / (cnt + 1), px = 2 * t * (1 - t) * len * .15, py = -len * t, ll = len * .34 * (1 - t * .55);
    s += leaf(px, py, ll, -62 + t * 25, col, false) + leaf(px, py, ll, 62 - t * 25, col, false);
  }
  return s + '</g>';
}

function canopy(y, amp, col, seed, step) {
  var r = rng(seed), st = step || 120, d = 'M0 1000L0 ' + y;
  for (var x = 0; x < 1700; x += st) d += 'Q' + n(x + st / 2) + ' ' + n(y - amp * (.5 + r() * .7)) + ' ' + n(x + st) + ' ' + n(y + (r() - .5) * amp * .3);
  return '<path d="' + d + 'L1700 1000Z" fill="' + col + '"/>';
}

function trunk(x, yt, yb, w, col, seed) {
  var r = rng(seed || 3), h = yb - yt;
  var s = '<path d="M' + n(x - w / 2) + ' ' + yb + 'C' + n(x - w * .44) + ' ' + n(yb - h * .5) + ' ' + n(x - w * .4) + ' ' + n(yt + 30) + ' ' + n(x - w * .38) + ' ' + yt + 'L' + n(x + w * .38) + ' ' + yt + 'C' + n(x + w * .4) + ' ' + n(yt + 30) + ' ' + n(x + w * .44) + ' ' + n(yb - h * .5) + ' ' + n(x + w / 2) + ' ' + yb + 'Z" fill="' + col + '"/>';
  for (var k = 0; k < Math.max(2, w / 28); k++) {
    var bx = x - w * .32 + r() * w * .64, y0 = yt + r() * h * .4, y1 = y0 + h * (.25 + r() * .4);
    s += '<path d="M' + n(bx) + ' ' + n(y0) + 'Q' + n(bx + (r() - .5) * 16) + ' ' + n((y0 + y1) / 2) + ' ' + n(bx) + ' ' + n(y1) + '" stroke="#000" stroke-opacity=".12" stroke-width="' + n(Math.max(2, w * .02)) + '" fill="none" stroke-linecap="round"/>';
  }
  return s;
}

function vine(x, y0, y1, col, seed, sway) {
  var r = rng(seed), sw = sway || 0;
  var s = '<path d="M' + x + ' ' + y0 + 'Q' + n(x + sw * 1.6) + ' ' + n((y0 + y1) / 2) + ' ' + n(x + sw) + ' ' + y1 + '" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
  for (var yy = y0 + 30; yy < y1 - 10; yy += 34 + r() * 20) {
    var t = (yy - y0) / (y1 - y0), px = x + 2 * t * (1 - t) * sw * 1.6 + t * t * sw;
    s += leaf(px, yy, 18 + r() * 10, (r() > .5 ? 1 : -1) * (50 + r() * 30), r() > .5 ? C.g2 : C.g1, false);
  }
  return s;
}

function grass(y, col, seed, x0, x1) {
  var r = rng(seed), s = '';
  for (var x = x0 || 0; x < (x1 || 1600); x += 9 + r() * 10) {
    var h = 14 + r() * 26;
    s += '<path d="M' + n(x) + ' ' + y + 'Q' + n(x + (r() - .5) * 10) + ' ' + n(y - h * .6) + ' ' + n(x + (r() - .5) * 14) + ' ' + n(y - h) + '" stroke="' + col + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }
  return s;
}

function flower(x, y, r, col) {
  var s = '';
  for (var i = 0; i < 5; i++) { var a = i * 72 * Math.PI / 180; s += '<circle cx="' + n(x + Math.cos(a) * r * .62) + '" cy="' + n(y + Math.sin(a) * r * .62) + '" r="' + n(r * .5) + '" fill="' + col + '"/>'; }
  return s + '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r * .36) + '" fill="' + C.banana + '"/>';
}

function pollen(count, seed, col, x0, y0, w, h) {
  var r = rng(seed), s = '';
  for (var i = 0; i < count; i++) s += '<circle cx="' + n(x0 + r() * w) + '" cy="' + n(y0 + r() * h) + '" r="' + n(1.5 + r() * 3.5) + '" fill="' + col + '" opacity="' + n(.35 + r() * .5) + '"/>';
  return s;
}

function glow(id, col) { return '<radialGradient id="' + id + '"><stop offset="0" stop-color="' + col + '" stop-opacity=".95"/><stop offset=".35" stop-color="' + col + '" stop-opacity=".45"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></radialGradient>'; }
function lin(id, a, b, vertical) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }

function bit(id, x, y, s) {
  s = s || 1;
  return '<g transform="translate(' + n(x) + ' ' + n(y) + ') scale(' + s + ')"><circle r="46" fill="url(#' + id + 'gl)"/>' +
    '<ellipse cx="-9" cy="-9" rx="10" ry="6" fill="#fff" opacity=".85" transform="rotate(-30 -9 -9)"/><ellipse cx="9" cy="-9" rx="10" ry="6" fill="#fff" opacity=".85" transform="rotate(30 9 -9)"/>' +
    '<circle r="9" fill="#FFE27A"/><circle cx="-3" cy="-1" r="1.6" fill="' + C.ink + '"/><circle cx="3" cy="-1" r="1.6" fill="' + C.ink + '"/></g>';
}

function bubble(x, y, txt, w) {
  w = w || txt.length * 10.5 + 40;
  return '<g transform="translate(' + n(x) + ' ' + n(y) + ')"><rect x="0" y="0" width="' + n(w) + '" height="52" rx="26" fill="#fff" stroke="' + C.g1 + '" stroke-opacity=".25" stroke-width="2"/>' +
    '<path d="M28 50L18 70L46 50Z" fill="#fff"/>' + T(w / 2, 33, txt, 20, C.ink, { a: 'middle', w: 600 }) + '</g>';
}

// ---- Vardy: rigged monkey. (x,y) = hip point, s = scale. Rest pose height ≈ 250 units.
var POSES = {
  stand: {}, wave: { uR: -125, fR: -35 },
  sit: { tL: 22, sL: -38, tR: -22, sR: 38 },
  laptop: { uL: 46, fL: -104, uR: -46, fR: 104, tL: 22, sL: -38, tR: -22, sR: 38 },
  climb: { uL: 150, fL: 10, uR: -60, fR: -60, tL: 35, sL: -70, tR: -8, sR: 25, tail: 20 },
  swing: { uL: 60, fL: 30, uR: -158, fR: -8, tL: 14, sL: -24, tR: -10, sR: 18, tail: -25 },
  read: { uL: 64, fL: -122, uR: -64, fR: 122, tL: 22, sL: -38, tR: -22, sR: 38 },
  paint: { uR: -105, fR: -25, uL: 12, fL: 10 },
  paddle: { uL: 50, fL: -100, uR: -20, fR: 60, tL: 22, sL: -38, tR: -22, sR: 38 },
  cheer: { uL: 135, fL: 20, uR: -135, fR: -20, head: -4 },
  look: { head: -10, tL: 22, sL: -38, tR: -22, sR: 38 }
};

function vardy(x, y, s, poseName, o) {
  o = o || {};
  var p = { head: 0, uL: 7, fL: 0, uR: -7, fR: 0, tL: 4, sL: 0, tR: -4, sR: 0, tail: 0, rot: 0 }, k, src = POSES[poseName] || {};
  for (k in src) p[k] = src[k];
  if (o.p) for (k in o.p) p[k] = o.p[k];
  var fur = C.fur;
  function seg(x1, y1, x2, y2, w) { return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + fur + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function arm(L) {
    var sx = L ? 82 : 118, ex = L ? 78 : 122, hx = L ? 75 : 125, u = L ? p.uL : p.uR, fa = L ? p.fL : p.fR, prop = (L ? o.propL : o.propR) || '';
    return '<g transform="rotate(' + u + ' ' + sx + ' 150)">' + seg(sx, 150, ex, 201, 11) + '<g transform="rotate(' + fa + ' ' + ex + ' 201)">' + seg(ex, 201, hx, 250, 10) + prop + '<circle cx="' + hx + '" cy="253" r="8.5" fill="' + C.tan2 + '"/></g></g>';
  }
  function leg(L) {
    var hx = L ? 92 : 108, kx = L ? 89 : 111, fx = L ? 87 : 113, t = L ? p.tL : p.tR, sh = L ? p.sL : p.sR;
    return '<g transform="rotate(' + t + ' ' + hx + ' 212)">' + seg(hx, 212, kx, 252, 12) + '<g transform="rotate(' + sh + ' ' + kx + ' 252)">' + seg(kx, 252, fx, 286, 11) + '<ellipse cx="' + (L ? fx - 4 : fx + 4) + '" cy="291" rx="12" ry="6.5" fill="' + C.tan2 + '"/></g></g>';
  }
  var eyes;
  var lk = o.look || [1.5, 1];
  if (o.eyes === 'happy') eyes = '<path d="M78 95Q86 85 94 95M106 95Q114 85 122 95" stroke="' + C.ink + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  else if (o.eyes === 'sleepy') eyes = '<path d="M78 93Q86 99 94 93M106 93Q114 99 122 93" stroke="' + C.ink + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  else eyes = '<ellipse cx="86" cy="92" rx="10" ry="12" fill="#fff"/><ellipse cx="114" cy="92" rx="10" ry="12" fill="#fff"/>' +
    '<circle cx="' + (87 + lk[0]) + '" cy="' + (94 + lk[1]) + '" r="6" fill="' + C.ink + '"/><circle cx="' + (115 + lk[0]) + '" cy="' + (94 + lk[1]) + '" r="6" fill="' + C.ink + '"/>' +
    '<circle cx="' + (89 + lk[0]) + '" cy="' + (91 + lk[1]) + '" r="2" fill="#fff"/><circle cx="' + (117 + lk[0]) + '" cy="' + (91 + lk[1]) + '" r="2" fill="#fff"/>';
  var mouth = o.mouth === 'open' ? '<path d="M90 116Q100 132 110 116Z" fill="' + C.ink + '"/><path d="M95 122Q100 127 105 122" stroke="' + C.pink + '" stroke-width="3" fill="none"/>' :
    o.mouth === 'o' ? '<ellipse cx="100" cy="120" rx="4" ry="5" fill="' + C.ink + '"/>' :
      '<path d="M90 117Q100 127 110 117" stroke="' + C.ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  var head = '<g transform="rotate(' + p.head + ' 100 134)">' +
    '<circle cx="55" cy="96" r="16" fill="' + fur + '"/><circle cx="55" cy="96" r="9" fill="' + C.tan2 + '"/><circle cx="145" cy="96" r="16" fill="' + fur + '"/><circle cx="145" cy="96" r="9" fill="' + C.tan2 + '"/>' +
    '<circle cx="100" cy="92" r="44" fill="' + fur + '"/><path d="M90 52Q92 36 100 48Q106 33 112 50" stroke="' + fur + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="86" cy="94" r="19" fill="' + C.tan + '"/><circle cx="114" cy="94" r="19" fill="' + C.tan + '"/><ellipse cx="100" cy="113" rx="27" ry="19" fill="' + C.tan + '"/>' +
    eyes + '<ellipse cx="96" cy="107" rx="2" ry="1.6" fill="' + C.ink + '"/><ellipse cx="104" cy="107" rx="2" ry="1.6" fill="' + C.ink + '"/>' + mouth +
    '<ellipse cx="72" cy="110" rx="6" ry="4" fill="' + C.pink + '" opacity=".5"/><ellipse cx="128" cy="110" rx="6" ry="4" fill="' + C.pink + '" opacity=".5"/>' +
    (o.glasses ? '<circle cx="86" cy="93" r="14" fill="none" stroke="' + C.ink + '" stroke-width="2.5"/><circle cx="114" cy="93" r="14" fill="none" stroke="' + C.ink + '" stroke-width="2.5"/><path d="M100 93h0" stroke="' + C.ink + '" stroke-width="2.5"/>' : '') +
    (o.goggles ? '<rect x="64" y="56" width="72" height="12" rx="6" fill="' + C.g1 + '"/><circle cx="84" cy="62" r="11" fill="' + C.water + '" stroke="' + C.g1 + '" stroke-width="3"/><circle cx="116" cy="62" r="11" fill="' + C.water + '" stroke="' + C.g1 + '" stroke-width="3"/>' : '') +
    (o.noPhones ? '' : '<path d="M58 90C56 34 144 34 142 90" stroke="' + C.banana + '" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="44" y="80" width="18" height="32" rx="8" fill="' + C.g2 + '"/><rect x="138" y="80" width="18" height="32" rx="8" fill="' + C.g2 + '"/>') +
    '</g>';
  var body = '<path d="M100 128C122 128 128 160 126 190C124 214 112 224 100 224C88 224 76 214 74 190C72 160 78 128 100 128Z" fill="' + fur + '"/><ellipse cx="100" cy="186" rx="15" ry="24" fill="' + C.tan + '"/>';
  var tail = '<g transform="rotate(' + p.tail + ' 106 220)"><path d="M106 220C150 236 174 202 162 170C154 148 128 150 133 170" stroke="' + fur + '" stroke-width="7" fill="none" stroke-linecap="round"/></g>';
  var front = o.front || '';
  return '<g transform="translate(' + n(x) + ' ' + n(y) + ') scale(' + (o.flip ? -s : s) + ' ' + s + ') rotate(' + p.rot + ') translate(-100 -212)">' + tail + leg(true) + leg(false) + body + (o.lap || '') + arm(false) + arm(true) + head + front + '</g>';
}

// Props (local Vardy coordinates)
var PROP = {
  laptop: '<g><rect x="70" y="182" width="60" height="40" rx="5" fill="#E8F1EC" stroke="#B9C9C0" stroke-width="2"/>' + '<path d="M100 194C106 198 106 206 100 210C94 206 94 198 100 194Z" fill="' + C.g2 + '"/><rect x="64" y="220" width="72" height="7" rx="3.5" fill="#C5D3CB"/></g>',
  book: '<g><path d="M100 176L70 170L70 204L100 210Z" fill="#fff" stroke="' + C.g1 + '" stroke-width="2"/><path d="M100 176L130 170L130 204L100 210Z" fill="#F6FBF4" stroke="' + C.g1 + '" stroke-width="2"/><path d="M76 180L94 183M76 188L94 191M106 183L124 180M106 191L124 188" stroke="' + C.mute + '" stroke-opacity=".5" stroke-width="2"/></g>',
  brush: '<path d="M125 248L127 298" stroke="' + C.bark + '" stroke-width="5" stroke-linecap="round"/><path d="M123 296Q127 314 131 296Z" fill="#F08C6A"/>',
  magnifier: '<path d="M125 248L125 274" stroke="' + C.bark + '" stroke-width="5" stroke-linecap="round"/><circle cx="125" cy="288" r="14" fill="' + C.water + '" fill-opacity=".6" stroke="' + C.g1 + '" stroke-width="4"/>',
  banana: '<path d="M69 244Q65 268 87 274Q73 264 77 244Z" fill="' + C.banana + '"/>',
  lantern: '<path d="M125 252L125 268" stroke="' + C.bark + '" stroke-width="2"/><rect x="115" y="268" width="20" height="26" rx="6" fill="' + C.sun + '" stroke="' + C.bark + '" stroke-width="2"/>',
  vine: '<path d="M125 250L131 700" stroke="' + C.g1 + '" stroke-width="5" stroke-linecap="round"/>',
  paddle: '<g><path d="M58 150L150 262" stroke="' + C.bark + '" stroke-width="6" stroke-linecap="round"/><ellipse cx="156" cy="272" rx="10" ry="22" transform="rotate(-40 156 272)" fill="' + C.bark2 + '"/></g>'
};

function sloth(x, y, s) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-26 -10L-30 -70M26 -10L30 -70" stroke="#9C8B78" stroke-width="12" stroke-linecap="round"/>' +
    '<ellipse cx="0" cy="20" rx="34" ry="44" fill="#A8977F"/><circle cx="0" cy="-14" r="28" fill="#A8977F"/><ellipse cx="0" cy="-10" rx="22" ry="16" fill="#E9DCC6"/>' +
    '<path d="M-14 -14Q-8 -10 -3 -14M3 -14Q8 -10 14 -14" stroke="' + C.ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="-11" cy="-13" rx="8" ry="5" fill="#6E5E4D" opacity=".5"/><ellipse cx="11" cy="-13" rx="8" ry="5" fill="#6E5E4D" opacity=".5"/>' +
    '<path d="M-4 -2Q0 2 4 -2" stroke="' + C.ink + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' + T(30, -40, 'z', 18, C.mute, { w: 700 }) + T(42, -56, 'z', 13, C.mute, { w: 700 }) + '</g>';
}

function bird(x, y, s, col) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="0" cy="0" rx="16" ry="13" fill="' + (col || '#F08C6A') + '"/><circle cx="12" cy="-8" r="9" fill="' + (col || '#F08C6A') + '"/>' +
    '<path d="M20 -8L28 -5L20 -3Z" fill="' + C.banana + '"/><circle cx="14" cy="-10" r="2" fill="' + C.ink + '"/><path d="M-6 -2Q-2 8 8 2" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>' +
    '<path d="M-2 12L-2 18M4 12L4 18" stroke="' + C.ink + '" stroke-width="2"/></g>';
}

function treehouse(x, y, w, col, roof) {
  var h = w * .7, s = '<g transform="translate(' + x + ' ' + y + ')">';
  s += '<rect x="' + n(-w * .65) + '" y="0" width="' + n(w * 1.3) + '" height="16" rx="4" fill="' + C.bark2 + '"/>';
  for (var i = 0; i < 6; i++) s += '<rect x="' + n(-w / 2 + i * w / 6) + '" y="' + n(-h) + '" width="' + n(w / 6 - 3) + '" height="' + n(h) + '" fill="' + col + '" stroke="' + C.bark2 + '" stroke-opacity=".3"/>';
  s += '<path d="M' + n(-w * .66) + ' ' + n(-h) + 'L0 ' + n(-h - w * .55) + 'L' + n(w * .66) + ' ' + n(-h) + 'Z" fill="' + roof + '"/>';
  s += '<rect x="' + n(-w * .16) + '" y="' + n(-h * .72) + '" width="' + n(w * .32) + '" height="' + n(h * .4) + '" rx="6" fill="' + C.sun + '"/><path d="M0 ' + n(-h * .72) + 'V' + n(-h * .32) + 'M' + n(-w * .16) + ' ' + n(-h * .52) + 'H' + n(w * .16) + '" stroke="' + C.bark2 + '" stroke-width="3"/>';
  s += '<circle cx="' + n(w * .58) + '" cy="' + n(-h * .2) + '" r="26" fill="url(#lg)"/><rect x="' + n(w * .58 - 8) + '" y="' + n(-h * .28) + '" width="16" height="20" rx="5" fill="' + C.sun + '" stroke="' + C.bark2 + '" stroke-width="2"/>';
  return s + '</g>';
}

function bridge(x1, y1, x2, y2, sag) {
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag, s = '';
  s += '<path d="M' + x1 + ' ' + (y1 - 40) + 'Q' + mx + ' ' + (my - 40) + ' ' + x2 + ' ' + (y2 - 40) + '" stroke="' + C.bark + '" stroke-width="3" fill="none"/>';
  for (var i = 0; i <= 14; i++) {
    var t = i / 14, px = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * mx + t * t * x2, py = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * my + t * t * y2;
    var ry = (1 - t) * (1 - t) * (y1 - 40) + 2 * t * (1 - t) * (my - 40) + t * t * (y2 - 40);
    s += '<path d="M' + n(px) + ' ' + n(ry) + 'L' + n(px) + ' ' + n(py) + '" stroke="' + C.bark + '" stroke-width="2"/><rect x="' + n(px - 9) + '" y="' + n(py - 3) + '" width="18" height="8" rx="2" fill="' + C.tan2 + '" stroke="' + C.bark2 + '" stroke-opacity=".4"/>';
  }
  return '<path d="M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '" stroke="' + C.bark2 + '" stroke-width="3" fill="none"/>' + s;
}

function medal(x, y, r) {
  return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-22 10L-40 90L-16 76L-4 98L8 20Z" fill="' + C.g2 + '"/><path d="M22 10L40 90L16 76L4 98L-8 20Z" fill="' + C.g1 + '"/>' +
    '<circle r="' + r + '" fill="' + C.banana + '" stroke="#E7A92A" stroke-width="6"/><circle r="' + (r - 14) + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>' +
    '<path d="M0 -26L8 -8L27 -8L12 4L18 23L0 12L-18 23L-12 4L-27 -8L-8 -8Z" fill="#fff"/></g>';
}

// Branch scrollbar: chapter `i` of 0..10 is current.
function branchBar(i, light) {
  var x = 1540, top = 90, bot = 830, step = (bot - top) / 10, yc = bot - i * step, s = '';
  var col = light ? '#fff' : C.g1;
  s += '<path d="M' + x + ' ' + bot + 'C' + (x - 10) + ' 600 ' + (x + 10) + ' 350 ' + x + ' ' + top + '" stroke="' + col + '" stroke-opacity=".22" stroke-width="4" fill="none"/>';
  s += '<path d="M' + x + ' ' + bot + 'L' + x + ' ' + n(yc) + '" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>';
  for (var k = 0; k <= 10; k++) {
    var y = bot - k * step;
    if (k < i) s += leaf(x, y, 22, k % 2 ? 55 : -55, C.g2) + '<circle cx="' + x + '" cy="' + n(y) + '" r="6" fill="' + C.banana + '"/>';
    else if (k === i) s += leaf(x, y, 30, -55, C.g2) + leaf(x, y, 26, 55, C.g3) + '<circle cx="' + x + '" cy="' + n(y) + '" r="11" fill="' + C.banana + '" stroke="#fff" stroke-width="3"/>';
    else s += '<circle cx="' + x + '" cy="' + n(y) + '" r="5" fill="none" stroke="' + col + '" stroke-opacity=".45" stroke-width="2"/>';
  }
  return s;
}

function note(num, title, trans, motion) {
  return '<rect x="0" y="900" width="1600" height="180" fill="#FBFDFB"/><rect x="0" y="900" width="1600" height="2" fill="' + C.g4 + '"/>' +
    T(60, 978, num, 64, C.g3, { serif: 1, w: 700 }) + T(170, 958, title, 30, C.ink, { serif: 1 }) +
    T(170, 1000, 'TRANSITION IN', 13, C.g1, { w: 800, ls: 2 }) + T(320, 1000, trans, 18, C.ink) +
    T(170, 1036, 'MOTION', 13, C.g1, { w: 800, ls: 2 }) + T(320, 1036, motion, 18, C.mute);
}

function frame(id, defs, body, nt) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1080" viewBox="0 0 1600 1080"><defs>' + glow(id + 'gl', '#FFE27A') + glow('lg', '#FFD66B') + defs + '<clipPath id="' + id + 'c"><rect width="1600" height="900"/></clipPath></defs>' +
    '<g clip-path="url(#' + id + 'c)">' + body + '</g>' + (nt || '') + '</svg>';
}

// ================= FRAMES =================
var FRAMES = {};

FRAMES.sheet = function () {
  var id = 'sh', r = rng(9), b = '<rect width="1600" height="900" fill="' + C.sky + '"/>' + canopy(860, 40, C.g4, 4) + cluster(-20, -10, 110, 20, [C.g2, C.g1, C.g3], r, 40, 90) + cluster(1560, 880, 160, 26, [C.g2, C.g1, C.g3], r, 40, 90);
  b += T(80, 120, 'Meet Vardy', 72, C.ink, { serif: 1, w: 700 }) + T(84, 160, 'Thin, chill, curious. Headphones always on.', 22, C.mute);
  var poses = [['wave', 'Hello'], ['laptop', 'Builder'], ['climb', 'Climb'], ['swing', 'Swing'], ['read', 'Learn'], ['paint', 'Design'], ['paddle', 'Drift'], ['cheer', 'Yay']];
  for (var i = 0; i < poses.length; i++) {
    var x = 150 + i * 182, y = 470, o = {};
    if (poses[i][0] === 'read') { o.front = PROP.book; o.glasses = 1; o.eyes = 'happy'; }
    if (poses[i][0] === 'paint') o.propR = PROP.brush;
    if (poses[i][0] === 'paddle') o.front = PROP.paddle;
    if (poses[i][0] === 'cheer') { o.eyes = 'happy'; o.mouth = 'open'; }
    if (poses[i][0] === 'wave') o.mouth = 'open';
    if (poses[i][0] === 'swing') { o.propR = PROP.vine; o.propL = PROP.banana; o.eyes = 'happy'; }
    if (poses[i][0] === 'laptop') o.front = PROP.laptop;
    b += '<ellipse cx="' + x + '" cy="' + (y + 92) + '" rx="60" ry="10" fill="' + C.g1 + '" opacity=".1"/>' + vardy(x, y, .82, poses[i][0], o) + T(x, y + 140, poses[i][1], 20, C.g1, { a: 'middle', w: 700 });
  }
  b += bit(id, 1450, 230, 1.6) + T(1450, 320, 'Bit, the firefly guide', 18, C.mute, { a: 'middle' });
  var sw = [['#2F7D4F', 'Canopy'], ['#5BAE6A', 'Leaf'], ['#A8D98A', 'Sprout'], ['#EAF7F0', 'Mist'], ['#FFD66B', 'Sun'], ['#FFC93C', 'Banana'], ['#8A5A3B', 'Bark'], ['#FFD9C2', 'Dusk'], ['#D9D3F5', 'Lavender'], ['#1E2B24', 'Ink']];
  for (var j = 0; j < sw.length; j++) b += '<circle cx="' + (110 + j * 74) + '" cy="760" r="26" fill="' + sw[j][0] + '" stroke="#000" stroke-opacity=".08"/>' + T(110 + j * 74, 808, sw[j][1], 13, C.mute, { a: 'middle' });
  b += T(900, 752, 'Fraunces: storybook titles', 34, C.ink, { serif: 1 }) + T(900, 800, 'Manrope: UI, numbers, labels  1628 · 9.56 · 500+', 22, C.mute, { w: 600 });
  return frame(id, '', b, note('00', 'Character & style sheet', 'Vardy is one rigged SVG: 12 joints (head, arms ×2 segments, legs ×2 segments, tail) blend between poses.', 'Always-on idle: breathing, blinking, tail sway, head-bob to music. Pupils follow the cursor; click him for a reaction.'));
};

FRAMES.loader = function () {
  var id = 'lo', b = '<rect width="1600" height="900" fill="#F4FBF6"/>';
  for (var i = 1; i <= 4; i++) b += '<circle cx="800" cy="470" r="' + (120 + i * 70) + '" fill="none" stroke="' + C.g3 + '" stroke-opacity="' + (.5 - i * .1) + '" stroke-width="2"/>';
  b += leaf(800, 620, 330, 0, C.g2) + leaf(800, 620, 260, -8, C.g3, false);
  b += '<path d="M800 380C830 420 842 448 842 470C842 494 823 512 800 512C777 512 758 494 758 470C758 448 770 420 800 380Z" fill="' + C.water + '" stroke="#fff" stroke-width="3"/>' +
    '<path d="M760 478C770 470 830 470 840 478C840 498 822 512 800 512C778 512 760 498 760 478Z" fill="' + C.water2 + '"/><ellipse cx="785" cy="440" rx="7" ry="12" fill="#fff" opacity=".8"/>';
  b += T(800, 720, '62%', 28, C.g1, { a: 'middle', w: 700 });
  return frame(id, '', b, note('L', 'Loader: the dewdrop', 'Page opens on a single leaf. A dewdrop fills as assets load.', 'At 100% the drop falls, hits the ground and its ripple expands into a circular reveal of the jungle.'));
};

FRAMES.hero = function () {
  var id = 'he', r = rng(11), b = '<rect width="1600" height="900" fill="url(#heS)"/><circle cx="1220" cy="160" r="260" fill="url(#heSun)"/><circle cx="1220" cy="160" r="70" fill="#FFF0B8"/>';
  for (var i = 0; i < 4; i++) b += '<path d="M' + (1180 + i * 40) + ' 0L' + (380 + i * 260) + ' 900L' + (520 + i * 260) + ' 900L' + (1230 + i * 40) + ' 0Z" fill="#fff" opacity=".18"/>';
  b += canopy(560, 110, '#D9EFD5', 5, 150);
  b += trunk(260, 120, 760, 70, '#C4DFBC', 2) + trunk(1080, 160, 760, 60, '#C4DFBC', 4) + trunk(1380, 100, 760, 80, '#BCDAB3', 6);
  b += cluster(260, 140, 170, 30, ['#B4DBA6', '#A6D398', '#C4E4B6'], r, 50, 90) + cluster(1380, 120, 190, 30, ['#B4DBA6', '#A6D398', '#C4E4B6'], r, 50, 90);
  b += canopy(690, 70, '#A6D398', 7, 130) + canopy(800, 45, C.g2, 8, 110) + grass(805, C.g1, 3);
  b += '<path d="M-20 500C220 486 470 520 780 556L786 574C470 546 220 528 -20 548Z" fill="' + C.bark + '"/><path d="M-20 548C220 528 470 546 786 574" stroke="' + C.bark2 + '" stroke-width="4" fill="none"/>';
  b += cluster(60, 500, 120, 22, [C.g1, C.g2, C.g0], r, 50, 90) + leaf(690, 548, 60, 30, C.g2) + leaf(620, 540, 50, -20, C.g1);
  b += vardy(470, 540, .95, 'laptop', { front: PROP.laptop, look: [4, -2] });
  b += bit(id, 720, 410, 1) + '<path d="M700 430Q650 470 610 440" stroke="' + C.banana + '" stroke-dasharray="4 8" stroke-width="2" fill="none"/>';
  b += T(930, 300, 'CREATIVE DESIGNER × SOFTWARE ENGINEER', 16, C.g1, { w: 800, ls: 3 }) + T(925, 400, 'Vardhan Mittal', 88, C.ink, { serif: 1, w: 700 });
  b += '<path d="M930 425C1080 440 1220 415 1380 432" stroke="' + C.g2 + '" stroke-width="5" fill="none" stroke-linecap="round"/>' + leaf(1060, 434, 26, 60, C.g2) + leaf(1200, 425, 22, -60, C.g1) + leaf(1340, 428, 26, 60, C.g3);
  b += T(930, 488, 'Designs. Builds. Delights.', 34, C.g1, { serif: 1, it: 1, w: 500 });
  b += '<circle cx="800" cy="812" r="22" fill="url(#lg)"/><ellipse cx="800" cy="812" rx="7" ry="9" fill="#C8873F"/>';
  b += T(800, 866, 'scroll to climb', 15, C.g0, { a: 'middle', w: 700, ls: 2 });
  b += cluster(-10, 60, 200, 30, [C.g0, C.g1, C.g2], r, 70, 140) + cluster(1500, 930, 220, 26, [C.g0, C.g1], r, 70, 140) + branchBar(0);
  var d = lin('heS', '#E6F6EE', '#FFF4D8') + glow('heSun', '#FFE59A');
  return frame(id, d, b, note('01', 'Hello: Morning Canopy (hero)', 'Ripple from the dewdrop; foreground leaf curtains part left and right.', 'Name letters rise in, vine underline draws, Bit flies in and Vardy looks up from his laptop and waves. Scroll = layers drift (climb).'));
};

FRAMES.seed = function () {
  var id = 'se', r = rng(21), b = '<rect width="1600" height="900" fill="url(#seS)"/>';
  b += canopy(470, 60, C.g4, 22, 160) + '<rect y="520" width="1600" height="380" fill="url(#seSoil)"/>';
  for (var i = 0; i < 40; i++) b += '<ellipse cx="' + n(r() * 1600) + '" cy="' + n(560 + r() * 330) + '" rx="' + n(4 + r() * 10) + '" ry="' + n(3 + r() * 6) + '" fill="#8E6440" opacity=".35"/>';
  b += '<path d="M800 640C780 700 720 730 690 800M800 640C820 710 880 740 900 820M800 640C800 720 790 780 800 860" stroke="#E9C79B" stroke-width="4" fill="none" opacity=".8"/>';
  b += grass(522, C.g2, 4) + '<rect y="516" width="1600" height="8" fill="' + C.g2 + '"/>';
  b += '<circle cx="800" cy="630" r="70" fill="url(#lg)"/><path d="M770 640Q770 600 798 596L792 650Z" fill="#C8873F"/><path d="M830 640Q830 600 802 596L808 650Z" fill="#B57636"/>';
  b += '<path d="M800 630C796 560 812 480 800 380" stroke="' + C.g1 + '" stroke-width="8" fill="none" stroke-linecap="round"/>' + leaf(800, 390, 110, -55, C.g2) + leaf(800, 390, 110, 55, C.g3) + leaf(804, 470, 70, 60, C.g2);
  b += leaf(470, 530, 330, -24, C.g1) + '<path d="M470 530L560 230" stroke="' + C.bark + '" stroke-width="6"/>';
  b += vardy(520, 470, .7, 'read', { front: PROP.book, glasses: 1, eyes: 'happy' }) + '<circle cx="534" cy="590" r="0" fill="none"/>';
  b += '<g transform="translate(548 402)"><circle r="7" fill="#E5533D"/><circle cx="0" cy="-5" r="4" fill="' + C.ink + '"/><circle cx="-3" cy="2" r="1.5" fill="' + C.ink + '"/><circle cx="3" cy="1" r="1.5" fill="' + C.ink + '"/></g>';
  b += medal(1190, 270, 62) + T(1190, 440, 'NTSE Scholar', 52, C.ink, { serif: 1, a: 'middle', w: 700 }) + T(1190, 200, '01 · THE SEED', 15, C.g1, { a: 'middle', w: 800, ls: 3 });
  b += bit(id, 900, 520, .8) + branchBar(1);
  var d = lin('seS', '#F1FAF2', '#FFF3D8') + lin('seSoil', '#C79A6C', '#9C6B47');
  return frame(id, d, b, note('02', 'The Seed', 'Iris zoom: camera dives into the glowing seed on the hero ground and opens inside it.', 'Seed cracks, stem draws upward, leaves unfurl. Kid Vardy reads under a leaf; a ladybug lands. Medal flips in with a shine.'));
};

FRAMES.trunk = function () {
  var id = 'tr', r = rng(31), b = '<rect width="1600" height="900" fill="url(#trS)"/>';
  b += trunk(160, -10, 910, 90, '#D4EBCC', 1) + trunk(1330, -10, 910, 110, '#D4EBCC', 2) + cluster(1330, 120, 160, 20, ['#C4E4B6', '#B4DBA6'], r, 40, 80);
  b += trunk(800, -20, 760, 380, C.bark, 7);
  var paths = ['M700 760V640H760V520H720V300', 'M760 760V700H830V460H790V120', 'M860 760V660H900V380H850V0', 'M650 700H700M830 460H880M720 300H680'];
  for (var i = 0; i < paths.length; i++) b += '<path d="' + paths[i] + '" stroke="' + C.sun + '" stroke-opacity=".35" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="' + paths[i] + '" stroke="#FFE9A0" stroke-width="3.5" fill="none" stroke-linejoin="round"/>';
  var nodes = [[700, 640], [760, 520], [720, 300], [830, 460], [790, 120], [900, 380], [850, 0], [760, 700]];
  for (var j = 0; j < nodes.length; j++) b += '<circle cx="' + nodes[j][0] + '" cy="' + nodes[j][1] + '" r="16" fill="url(#lg)"/><circle cx="' + nodes[j][0] + '" cy="' + nodes[j][1] + '" r="5.5" fill="#FFF3C4"/>';
  var rn = [[520, 860], [620, 820], [800, 850], [980, 820], [1080, 860], [700, 885], [900, 885]];
  b += '<path d="M620 750C570 790 530 820 470 860M980 750C1030 790 1070 820 1130 860M760 760C740 800 720 830 700 880M840 760C860 800 880 830 900 880" stroke="' + C.bark2 + '" stroke-width="26" fill="none" stroke-linecap="round"/>';
  for (var k = 0; k < rn.length; k++) for (var m = k + 1; m < rn.length; m++) if (Math.abs(rn[k][0] - rn[m][0]) < 260) b += '<path d="M' + rn[k][0] + ' ' + rn[k][1] + 'L' + rn[m][0] + ' ' + rn[m][1] + '" stroke="' + C.water2 + '" stroke-opacity=".6" stroke-width="2"/>';
  for (k = 0; k < rn.length; k++) b += '<circle cx="' + rn[k][0] + '" cy="' + rn[k][1] + '" r="7" fill="' + C.water + '" stroke="#fff" stroke-width="2"/>';
  b += leaf(990, 300, 70, 70, C.g2) + leaf(1000, 296, 50, 110, C.g1) + leaf(610, 560, 60, -70, C.g2);
  b += vardy(810, 540, .9, 'climb', { look: [0, -4] }) + bit(id, 860, 300, .9);
  b += T(120, 250, '02 · THE TRUNK OF LIGHT', 15, C.g1, { w: 800, ls: 3 }) + T(115, 340, 'NIT Delhi', 84, C.ink, { serif: 1, w: 700 }) + T(120, 388, 'B.Tech ECE · Minor in ML', 24, C.mute, { w: 600 });
  b += T(112, 600, '9.56', 168, C.g1, { serif: 1, w: 700 }) + T(120, 646, 'CGPA / 10', 20, C.mute, { w: 700, ls: 2 });
  b += branchBar(2);
  var d = lin('trS', '#EAF7F0', '#F7FBEF');
  return frame(id, d, b, note('03', 'The Trunk of Light (NIT Delhi)', 'Growth zoom: the sapling shoots up and its stem fills the screen, becoming this giant trunk.', 'Scroll = Vardy climbs; circuit traces in the bark light up as he passes (ECE); roots pulse as a neural net (ML); 9.56 counts up.'));
};

FRAMES.vines = function () {
  var id = 'vi', r = rng(41), b = '<rect width="1600" height="900" fill="url(#viS)"/>';
  b += canopy(820, 60, '#D2ECCB', 42, 140);
  b += '<path d="M0 0H1600V150Q1200 200 800 150Q400 110 0 170Z" fill="' + C.g1 + '"/>' + cluster(400, 80, 400, 50, [C.g0, C.g1, C.g2], r, 60, 110) + cluster(1200, 80, 400, 50, [C.g0, C.g1, C.g2], r, 60, 110);
  var vx = [180, 470, 860, 1190, 1440], vl = [520, 600, 470, 420, 560];
  for (var i = 0; i < vx.length; i++) {
    if (i === 2) continue;
    b += vine(vx[i], 120, vl[i], C.g1, 50 + i, i % 2 ? 14 : -14);
    if (i < 2) b += flower(vx[i] + (i % 2 ? 14 : -14), vl[i] + 14, 18, i ? C.peach : C.pink);
    else if (i !== 3) b += '<circle cx="' + (vx[i] - 14) + '" cy="' + (vl[i] + 10) + '" r="30" fill="url(#lg)"/><circle cx="' + (vx[i] - 14) + '" cy="' + (vl[i] + 10) + '" r="10" fill="' + C.sun + '" stroke="' + C.bark + '" stroke-width="3"/>';
  }
  
  b += vardy(860, 560, .85, 'swing', { p: { rot: -12 }, eyes: 'happy', mouth: 'open', propL: PROP.banana, propR: PROP.vine });
  b += sloth(1190, 470, 1);
  b += '<path d="M990 380Q1080 280 1160 400" stroke="' + C.banana + '" stroke-width="3" stroke-dasharray="6 9" fill="none"/>' + '<path d="M1150 392Q1146 416 1168 422Q1154 412 1158 392Z" fill="' + C.banana + '"/>';
  b += bubble(700, 330, '500 puzzles. Still fun.');
  var st = [['1628', 'Codeforces Expert'], ['3★', 'CodeChef'], ['500+', 'Problems solved']];
  for (var j = 0; j < 3; j++) b += T(220 + j * 380, 760, st[j][0], 92, C.ink, { serif: 1, w: 700 }) + T(224 + j * 380, 800, st[j][1], 20, C.g1, { w: 700, ls: 1 });
  b += T(220, 660, '03 · THE PUZZLE VINES', 15, C.g1, { w: 800, ls: 3 }) + '<path d="M1180 830H1400" stroke="' + C.g1 + '" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/><path d="M1395 820L1412 830L1395 840" stroke="' + C.g1 + '" stroke-width="3" fill="none"/>' + T(1180, 870, 'scroll moves sideways', 14, C.g1, { w: 700, ls: 1 });
  b += branchBar(3);
  var d = lin('viS', '#E3F4E6', '#F6FBEE');
  return frame(id, d, b, note('04', 'The Puzzle Vines (competitive programming)', 'Swing pan: the camera turns horizontal and follows Vardy’s swing arc from vine to vine.', 'Each glowing knot he passes blossoms into a flower; counters tick to 1628 · 3★ · 500+. He tosses a banana to a sleepy sloth.'));
};

FRAMES.sun = function () {
  var id = 'su', r = rng(51), b = '<rect width="1600" height="900" fill="url(#suS)"/>';
  for (var i = 0; i < 5; i++) b += '<path d="M' + (120 + i * 120) + ' -20L' + (700 + i * 220) + ' 920L' + (820 + i * 230) + ' 920L' + (200 + i * 120) + ' -20Z" fill="#FFE9A6" opacity=".28"/>';
  b += canopy(720, 60, '#CFEAC6', 52, 150) + canopy(800, 40, C.g3, 53, 120) + grass(805, C.g2, 54);
  b += cluster(1500, 0, 260, 40, [C.g1, C.g2, C.g0], r, 70, 120) + cluster(60, 0, 220, 30, [C.g1, C.g2], r, 60, 110);
  b += '<g transform="translate(1180 760) rotate(-18)"><path d="M0 0C150 -110 150 -440 0 -560C-150 -440 -150 -110 0 0Z" fill="' + C.g2 + '"/>';
  for (var k = 1; k < 7; k++) b += '<path d="M' + (-130 + k * 4) + ' ' + (-k * 78) + 'L' + (130 - k * 4) + ' ' + (-k * 78) + '" stroke="#DFF5C9" stroke-width="2.5"/>';
  b += '<path d="M0 0V-540M-60 -60V-480M60 -60V-480" stroke="#DFF5C9" stroke-width="2.5"/></g>';
  b += '<path d="M780 640L1380 640M780 640L780 300" stroke="' + C.ink + '" stroke-opacity=".25" stroke-width="2"/>';
  var pts = [[820, 600], [870, 585], [920, 560], [980, 540], [1040, 500], [1100, 470], [1160, 430], [1220, 400], [1280, 360], [1340, 330]];
  b += '<path d="M800 610C950 570 1100 470 1360 320" stroke="' + C.g1 + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  for (var j = 0; j < pts.length; j++) b += '<circle cx="' + pts[j][0] + '" cy="' + (pts[j][1] + (j % 2 ? 14 : -10)) + '" r="7" fill="' + C.banana + '" stroke="#fff" stroke-width="2"/>';
  b += pollen(30, 55, C.banana, 820, 200, 600, 300);
  b += vardy(560, 690, .9, 'stand', { goggles: 1, propR: PROP.magnifier, p: { uR: -60, fR: -40 }, look: [3, 0] }) + bit(id, 700, 420, .9);
  b += T(120, 230, '04 · THE SUNLIT HOLLOW', 15, C.g1, { w: 800, ls: 3 }) + T(110, 360, '+23.95%', 140, C.ink, { serif: 1, w: 700 }) + T(120, 410, 'model accuracy · solar-cell research · published', 22, C.mute, { w: 600 });
  b += branchBar(4);
  var d = lin('suS', '#FFF7DF', '#EAF7F0');
  return frame(id, d, b, note('05', 'The Sunlit Hollow (research)', 'Sunbeam wipe: a warm beam sweeps diagonally across and reveals the glade behind it.', 'Pollen-like data points drift, then snap onto a curve that draws itself; the solar leaf’s cells glow; +23.95% counts up.'));
};

FRAMES.design = function () {
  var id = 'de', r = rng(61), b = '<rect width="1600" height="900" fill="url(#deS)"/>';
  b += canopy(800, 50, C.g4, 62, 140) + grass(840, C.g2, 63);
  b += '<path d="M640 300C760 200 980 250 1100 320C1180 370 1300 360 1400 330" stroke="#FFC9A8" stroke-width="80" stroke-linecap="round" fill="none" opacity=".55"/><path d="M700 640C860 600 1100 680 1380 600" stroke="' + C.g3 + '" stroke-width="70" stroke-linecap="round" fill="none" opacity=".5"/>';
  b += '<g transform="translate(1030 470) rotate(-4)"><path d="M-380 0C-300 -260 300 -260 380 0C300 260 -300 260 -380 0Z" fill="#FBFFF8" stroke="' + C.g1 + '" stroke-width="4"/><path d="M-370 0H370" stroke="' + C.g3 + '" stroke-width="3"/>';
  b += '<rect x="-230" y="-150" width="460" height="300" rx="14" fill="#fff" stroke="' + C.ink + '" stroke-opacity=".5" stroke-width="2.5" stroke-dasharray="8 6"/><circle cx="-208" cy="-130" r="5" fill="' + C.pink + '"/><circle cx="-192" cy="-130" r="5" fill="' + C.banana + '"/><circle cx="-176" cy="-130" r="5" fill="' + C.g2 + '"/>';
  b += '<rect x="-210" y="-106" width="200" height="120" rx="10" fill="' + C.g3 + '"/><circle cx="-150" cy="-60" r="22" fill="' + C.sun + '"/><path d="M-210 14L-140 -40L-90 0L-50 -24L-10 14Z" fill="' + C.g1 + '"/>';
  b += '<rect x="-210" y="34" width="150" height="14" rx="7" fill="' + C.ink + '"/><rect x="-210" y="60" width="200" height="10" rx="5" fill="' + C.mute + '" opacity=".4"/><rect x="-210" y="98" width="110" height="32" rx="16" fill="' + C.banana + '"/>';
  b += '<rect x="20" y="-106" width="190" height="16" rx="8" fill="none" stroke="' + C.ink + '" stroke-opacity=".5" stroke-dasharray="6 5" stroke-width="2"/><rect x="20" y="-74" width="160" height="10" rx="5" fill="none" stroke="' + C.ink + '" stroke-opacity=".4" stroke-dasharray="6 5" stroke-width="2"/>';
  b += '<rect x="20" y="-40" width="190" height="120" rx="10" fill="none" stroke="' + C.ink + '" stroke-opacity=".4" stroke-dasharray="6 5" stroke-width="2"/><path d="M20 -40L210 80M210 -40L20 80" stroke="' + C.ink + '" stroke-opacity=".2" stroke-width="2"/><rect x="20" y="98" width="110" height="32" rx="16" fill="none" stroke="' + C.ink + '" stroke-opacity=".4" stroke-dasharray="6 5" stroke-width="2"/></g>';
  b += pollen(26, 64, '#F08C6A', 620, 560, 300, 200) + pollen(20, 65, C.g2, 1250, 200, 250, 200);
  b += '<g transform="translate(330 760) rotate(-20)">' + leaf(0, 0, 160, 80, C.g2) + '</g><circle cx="368" cy="738" r="12" fill="' + C.pink + '"/><circle cx="397" cy="721" r="12" fill="' + C.banana + '"/><circle cx="426" cy="704" r="12" fill="' + C.water2 + '"/><circle cx="455" cy="687" r="11" fill="' + C.lav + '"/>';
  b += vardy(600, 650, .95, 'paint', { propR: PROP.brush, eyes: 'happy', p: { head: 6 } });
  b += T(120, 210, '05 · THE PAINTED LEAVES', 15, C.g1, { w: 800, ls: 3 }) + T(112, 320, 'Design', 110, C.ink, { serif: 1, w: 700 }) + T(120, 372, 'every leaf, a little canvas', 26, C.g1, { serif: 1, it: 1, w: 500 });
  b += branchBar(5);
  var d = lin('deS', '#FFF4EA', '#EEF8EE');
  return frame(id, d, b, note('06', 'The Painted Leaves (design)', 'Watercolor brush reveal: wet strokes paint the whole scene in from blank paper.', 'Vardy paints a giant leaf: a dashed wireframe fills with color stroke by stroke. Your real design work replaces this mock.'));
};

FRAMES.houses = function () {
  var id = 'ho', r = rng(71), b = '<rect width="1600" height="900" fill="url(#hoS)"/>';
  b += canopy(760, 70, C.g4, 72, 150) + canopy(860, 40, C.g3, 73, 120);
  var xs = [300, 790, 1270], tops = [420, 360, 430], cols = ['#E8C9A0', '#F2D7B0', '#E8C9A0'], roofs = [C.g1, '#E57B5A', C.g2], names = ['AI Interview Coach', 'DevTrack', 'WanderWise'];
  for (var i = 0; i < 3; i++) b += trunk(xs[i], 60, 920, 90, C.bark, 70 + i) + cluster(xs[i], 80, 200, 34, [C.g1, C.g2, C.g0], r, 60, 110);
  b += bridge(370, 436, 720, 376, 70) + bridge(860, 376, 1200, 446, 70);
  for (i = 0; i < 3; i++) b += treehouse(xs[i], tops[i], 150, cols[i], roofs[i]) + '<rect x="' + (xs[i] - 105) + '" y="' + (tops[i] + 40) + '" width="210" height="40" rx="10" fill="#fff" opacity=".92"/>' + T(xs[i], tops[i] + 67, names[i], 19, C.ink, { a: 'middle', w: 800 });
  b += vardy(560, 440, .62, 'stand', { propR: PROP.lantern, p: { uR: -40, fR: -30 }, look: [3, 0] });
  b += '<g transform="translate(910 520)"><rect width="420" height="250" rx="22" fill="#fff" stroke="' + C.g1 + '" stroke-opacity=".2" stroke-width="2"/>' + T(28, 52, 'DevTrack', 32, C.ink, { serif: 1, w: 700 }) +
    T(28, 86, 'Developer command center: LeetCode +', 17, C.mute) + T(28, 110, 'Codeforces stats, AI architecture engine.', 17, C.mute);
  var ch = ['Next.js 16', 'Prisma', 'Postgres', 'NextAuth'], cx = 28;
  for (var j = 0; j < ch.length; j++) { var w = ch[j].length * 9 + 26; b += '<rect x="' + cx + '" y="134" width="' + w + '" height="30" rx="15" fill="' + C.g5 + '"/>' + T(cx + w / 2, 154, ch[j], 14, C.g1, { a: 'middle', w: 700 }); cx += w + 8; }
  b += '<rect x="28" y="186" width="150" height="40" rx="20" fill="' + C.g1 + '"/>' + T(103, 212, 'Live demo →', 16, '#fff', { a: 'middle', w: 700 }) + '</g>';
  b += '<rect x="100" y="826" width="330" height="40" rx="20" fill="#fff" opacity=".9"/>' + T(124, 852, '06 · THE TREEHOUSE VILLAGE', 15, C.g1, { w: 800, ls: 3 }) + bit(id, 1010, 300, .8) + branchBar(6);
  var d = lin('hoS', '#E8F6EE', '#FBF6E6');
  return frame(id, d, b, note('07', 'The Treehouse Village (projects)', 'Bridge walk: camera tracks Vardy across a swaying rope bridge into the village.', 'Each house builds itself plank by plank, roof drops, lantern lights. Hover/tap a house to open its card with stack and live demo.'));
};

FRAMES.river = function () {
  var id = 'ri', r = rng(81), b = '<rect width="1600" height="900" fill="url(#riS)"/>';
  b += canopy(520, 90, C.g4, 82, 160) + canopy(580, 50, C.g3, 83, 120);
  b += '<path d="M0 560C400 540 1200 580 1600 556V900H0Z" fill="url(#riW)"/>';
  for (var i = 0; i < 26; i++) { var x = r() * 1600, y = 600 + r() * 280, w = 40 + r() * 90; b += '<path d="M' + n(x) + ' ' + n(y) + 'q' + n(w / 4) + ' -6 ' + n(w / 2) + ' 0t' + n(w / 2) + ' 0" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  b += grass(566, C.g1, 84) + frond(60, 600, 200, 20, C.g1) + frond(1500, 610, 220, -25, C.g2);
  var st = [[880, 800, '150k+', 'Flipkart GRID 6.0', 'Semi-finalist'], [1120, 760, '47k+', 'HackVega 2.0', 'Finalist'], [1360, 820, '#4', 'NxtWave DSA', 'of 1,000+']];
  for (var j = 0; j < 3; j++) {
    var s = st[j];
    b += '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="70" ry="24" fill="#9AA79E"/><ellipse cx="' + s[0] + '" cy="' + (s[1] - 8) + '" rx="60" ry="18" fill="#B7C2BA"/>';
    b += '<circle cx="' + s[0] + '" cy="' + (s[1] - 50) + '" r="44" fill="url(#lg)"/><rect x="' + (s[0] - 13) + '" y="' + (s[1] - 66) + '" width="26" height="34" rx="8" fill="' + C.sun + '" stroke="' + C.bark2 + '" stroke-width="2"/>';
    b += '<rect x="' + (s[0] - 100) + '" y="' + (s[1] - 232) + '" width="200" height="126" rx="18" fill="#fff" opacity=".85"/>' + T(s[0], s[1] - 172, s[2], 52, C.ink, { serif: 1, a: 'middle', w: 700 }) + T(s[0], s[1] - 144, s[3], 15, C.g1, { a: 'middle', w: 800 }) + T(s[0], s[1] - 122, s[4], 14, C.mute, { a: 'middle', w: 600 });
  }
  b += '<ellipse cx="600" cy="740" rx="210" ry="22" fill="#5FAFBC" opacity=".4"/><path d="M380 700C470 770 730 770 820 700C760 730 440 730 380 700Z" fill="' + C.g2 + '"/><path d="M380 700C470 740 730 740 820 700" stroke="' + C.g1 + '" stroke-width="4" fill="none"/>';
  b += vardy(600, 690, .75, 'paddle', { front: PROP.paddle, eyes: 'happy' }) + bird(760, 694, 1.1);
  for (var k = 1; k < 4; k++) b += '<ellipse cx="600" cy="750" rx="' + (220 + k * 60) + '" ry="' + (26 + k * 10) + '" fill="none" stroke="#fff" stroke-opacity="' + (.5 - k * .12) + '" stroke-width="2"/>';
  b += T(120, 200, '07 · THE GENTLE RIVER', 15, C.g1, { w: 800, ls: 3 }) + T(115, 290, 'Hackathons', 84, C.ink, { serif: 1, w: 700 }) + T(120, 336, 'drifting through long, bright nights', 24, C.g1, { serif: 1, it: 1, w: 500 });
  b += bit(id, 820, 560, .8) + branchBar(7);
  var d = lin('riS', '#EAF7F0', '#F9F6E4') + lin('riW', C.water, C.water2);
  return frame(id, d, b, note('08', 'The Gentle River (hackathons)', 'Water ripple: the village wobbles under a displacement ripple and dissolves into the river.', 'Leaf boat drifts with the scroll; each stone it passes blooms a lantern and its number counts up. A bird hops aboard.'));
};

FRAMES.logs = function () {
  var id = 'lg2', r = rng(91), b = '<rect width="1600" height="900" fill="url(#lgS)"/>';
  b += canopy(640, 70, C.g4, 92, 150) + '<rect y="760" width="1600" height="140" fill="' + C.g3 + '"/>' + grass(762, C.g2, 93);
  b += '<path d="M-40 420H520V790H-40Z" fill="' + C.bark + '"/><path d="M-40 440H500M-40 520H510M-40 640H510M-40 740H500" stroke="#000" stroke-opacity=".1" stroke-width="5"/>';
  b += '<ellipse cx="520" cy="605" rx="110" ry="186" fill="#D9A877"/>';
  for (var i = 1; i < 7; i++) b += '<ellipse cx="520" cy="605" rx="' + (110 - i * 15) + '" ry="' + (186 - i * 26) + '" fill="none" stroke="' + C.bark + '" stroke-opacity=".55" stroke-width="3"/>';
  b += cluster(40, 420, 80, 12, [C.g1, C.g2], r, 30, 60) + '<path d="M150 420Q160 470 140 520" stroke="' + C.g1 + '" stroke-width="4" fill="none"/>';
  var lines = ['[ERR] 02:14:07 auth: token refresh timeout', '[WARN] edge-svc retry 3/3 upstream=sso', '[ERR] 02:14:09 policy sync failed code=504', '[INFO] tunnel re-handshake id=7f2c'];
  for (var j = 0; j < lines.length; j++) b += '<path d="M600 ' + (520 + j * 46) + 'C700 ' + (500 + j * 46) + ' 760 ' + (520 + j * 46) + ' 860 ' + (510 + j * 46) + '" stroke="' + C.bark + '" stroke-opacity=".25" stroke-width="2" fill="none"/>' + '<text x="610" y="' + (514 + j * 46) + '" font-family="JetBrains Mono, Courier New, monospace" font-size="15" fill="' + C.mute + '">' + lines[j] + '</text>';
  b += bit(id, 1030, 560, 1.4);
  b += '<g transform="translate(1110 460)"><rect width="380" height="200" rx="20" fill="#fff" stroke="' + C.g2 + '" stroke-width="2"/>' + T(26, 44, 'ROOT CAUSE', 13, C.g1, { w: 800, ls: 2 }) + T(26, 80, 'SSO token expiry → refresh', 20, C.ink, { w: 700 }) + T(26, 106, 'storm on edge service.', 20, C.ink, { w: 700 }) + T(26, 146, '✓ Rotate refresh window', 16, C.g1, { w: 600 }) + T(26, 172, '✓ Add jittered backoff', 16, C.g1, { w: 600 }) + '</g>';
  b += vardy(300, 360, .8, 'read', { front: PROP.book, eyes: 'happy' }) + bubble(370, 160, 'Logs have stories too.');
  b += T(860, 200, '08 · THE OLD LOGS', 15, C.g1, { w: 800, ls: 3 }) + T(855, 290, 'Zscaler', 92, C.ink, { serif: 1, w: 700 }) + T(860, 336, 'SDE Intern · fine-tuned small LMs (LoRA / QLoRA) as a log analyzer', 20, C.mute, { w: 600 });
  b += '<rect x="1110" y="700" width="380" height="48" rx="24" fill="' + C.banana + '"/>' + T(1300, 731, 'Amazon ML Summer School ’26', 17, C.ink, { a: 'middle', w: 800 });
  b += branchBar(8);
  var d = lin('lgS', '#EEF7EC', '#F8F3E2');
  return frame(id, d, b, note('09', 'The Old Logs (Zscaler)', 'Into the log: camera flies through a tunnel of tree rings and comes out into light.', 'Log rings unroll into scrolling log lines; as they pass through Bit’s glow they become a clean root-cause card (your LoRA log analyzer).'));
};

FRAMES.fireflies = function () {
  var id = 'ff', r = rng(101), b = '<rect width="1600" height="900" fill="url(#ffS)"/>';
  b += canopy(760, 80, '#B7C9B8', 102, 160) + canopy(840, 50, '#93B39E', 103, 120);
  var groups = [['Languages', 300, 260, ['C++', 'Python', 'Go', 'Java', 'JavaScript', 'SQL']], ['Frameworks', 720, 190, ['React', 'Next.js', 'Node', 'Express', 'Flask', 'Tailwind']], ['AI / ML', 1120, 270, ['PyTorch', 'TensorFlow', 'HF', 'LoRA', 'Sklearn', 'Pandas']], ['Tools', 560, 500, ['PostgreSQL', 'Firebase', 'Git', 'Linux', 'MySQL', 'VS Code']]];
  for (var g = 0; g < groups.length; g++) {
    var G = groups[g], pts = [];
    for (var k = 0; k < 6; k++) { var a = k / 6 * Math.PI * 2 + g, rad = 95 + (k % 2) * 30; pts.push([G[1] + Math.cos(a) * rad * 1.3, G[2] + Math.sin(a) * rad * .8]); }
    var d = 'M' + pts.map(function (p) { return n(p[0]) + ' ' + n(p[1]); }).join('L') + 'Z';
    b += '<path d="' + d + '" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" fill="none" stroke-dasharray="3 6"/>';
    for (k = 0; k < 6; k++) b += '<circle cx="' + n(pts[k][0]) + '" cy="' + n(pts[k][1]) + '" r="20" fill="url(#lg)"/><circle cx="' + n(pts[k][0]) + '" cy="' + n(pts[k][1]) + '" r="4.5" fill="#FFF6CC"/>' + T(pts[k][0], pts[k][1] + 26, G[3][k], 14, C.ink, { a: 'middle', w: 700, op: .8 });
    b += T(G[1], G[2] + 8, G[0], 30, C.ink, { serif: 1, a: 'middle', w: 600 });
  }
  b += pollen(60, 104, '#FFF2B0', 0, 0, 1600, 700);
  b += '<path d="M900 820C1100 790 1300 800 1620 760L1620 790C1300 830 1100 820 900 846Z" fill="#7C6150"/>' + vardy(1180, 790, .8, 'look', { look: [-2, -5], p: { head: -14 } }) + bit(id, 1260, 650, .8);
  b += T(120, 140, '09 · THE FIREFLY CROWN', 15, C.g0, { w: 800, ls: 3 }) + branchBar(9);
  var df = lin('ffS', '#CEC6F0', '#FFDCC6');
  return frame(id, df, b, note('10', 'The Firefly Crown (skills)', 'Day-to-dusk shift: the whole palette slowly grades to lavender and peach as fireflies ignite.', 'Fireflies swarm from random drift into four constellations, one star per skill; lines draw between stars. Hover a group to brighten it.'));
};

FRAMES.top = function () {
  var id = 'tp', r = rng(111), b = '<rect width="1600" height="900" fill="url(#tpS)"/><circle cx="800" cy="640" r="420" fill="url(#tpSun)"/><circle cx="800" cy="640" r="130" fill="#FFE9A8"/>';
  b += '<g opacity=".9"><ellipse cx="300" cy="220" rx="120" ry="34" fill="#fff"/><ellipse cx="360" cy="200" rx="80" ry="34" fill="#fff"/><ellipse cx="1260" cy="180" rx="140" ry="36" fill="#fff"/><ellipse cx="1200" cy="160" rx="80" ry="34" fill="#fff"/></g>';
  b += canopy(640, 90, '#CFE6B8', 112, 170) + canopy(720, 80, '#A9D493', 113, 150) + canopy(820, 70, C.g2, 114, 130);
  b += leaf(800, 620, 260, -90, C.g1) + leaf(800, 620, 260, 90, C.g2);
  b += vardy(800, 510, 1.05, 'cheer', { eyes: 'happy', mouth: 'open' }) + bit(id, 920, 330, 1);
  b += '<g transform="translate(1080 360)"><path d="M150 230V420" stroke="' + C.bark2 + '" stroke-width="16"/><rect width="300" height="230" rx="16" fill="' + C.tan2 + '" stroke="' + C.bark2 + '" stroke-width="5"/>' + T(150, 76, 'Let’s build', 36, C.ink, { serif: 1, a: 'middle', w: 700 }) + T(150, 118, 'together.', 36, C.ink, { serif: 1, a: 'middle', w: 700 });
  var ic = ['@', 'GH', 'in', 'LC', 'CV'];
  for (var i = 0; i < ic.length; i++) b += '<circle cx="' + (50 + i * 50) + '" cy="176" r="20" fill="#fff"/>' + T(50 + i * 50, 182, ic[i], 14, C.g1, { a: 'middle', w: 800 });
  b += '</g>';
  b += T(120, 200, '10 · THE TREETOP', 15, C.bark2, { w: 800, ls: 3 }) + T(115, 290, 'Say hello', 84, C.ink, { serif: 1, w: 700 }) + T(120, 336, 'logicalmittal@gmail.com', 24, C.bark2, { w: 700 });
  b += branchBar(10);
  var d = lin('tpS', '#FFF3D6', '#FFD4A6') + glow('tpSun', '#FFE29A');
  return frame(id, d, b, note('11', 'The Treetop (contact)', 'Leaf lift: a breeze carries Vardy up on a leaf; the scene drops away below, clouds pass.', 'Golden hour. Vardy cheers on the top leaf; the sign swings in on a rope; contact icons pop like berries; Bit lands on the sign.'));
};

var FRAME_ORDER = ['sheet', 'loader', 'hero', 'seed', 'trunk', 'vines', 'sun', 'design', 'houses', 'river', 'logs', 'fireflies', 'top'];
