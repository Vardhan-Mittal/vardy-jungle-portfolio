// Procedural sound: everything is synthesized with Web Audio, so there are no
// audio files. Off by default; the speaker toggle starts the AudioContext.
// Ambience is a soft kalimba that wanders a major pentatonic scale (it can't
// hit a sad note), over gentle chords, with the odd bird call.
let ctx = null, master = null, music = null, echo = null, on = false;
let schedTimer = 0, birdTimer = 0, nextNote = 0, step = 0, melody = 7;

const MUSIC_VOL = 0.07;
const BPM = 76, EIGHTH = 60 / BPM / 2;
const C4 = 261.63;
const PENTA = [0, 2, 4, 7, 9];
const CHORDS = [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]]; // C · Am · F · G
const hz = (semi, base = C4) => base * Math.pow(2, semi / 12);
const scaleNote = (i) => PENTA[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5);

function setup() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  // Music bus with a soft feedback echo for a little air.
  music = ctx.createGain();
  music.gain.value = 0.0001;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 3200;
  echo = ctx.createDelay(1);
  echo.delayTime.value = EIGHTH * 3;
  const fb = ctx.createGain(), wet = ctx.createGain();
  fb.gain.value = 0.28; wet.gain.value = 0.22;
  music.connect(lp).connect(master);
  lp.connect(echo).connect(fb).connect(echo);
  echo.connect(wet).connect(master);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
  });
}

// Kalimba-ish pluck: a sine body plus a quick inharmonic "tine" overtone.
function pluck(freq, t, vol = 0.5, decay = 1.4) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  g.connect(music);
  const body = ctx.createOscillator();
  body.type = 'sine'; body.frequency.value = freq;
  body.connect(g);
  const tine = ctx.createOscillator(), tg = ctx.createGain();
  tine.type = 'sine'; tine.frequency.value = freq * 5.4;
  tg.gain.setValueAtTime(vol * 0.35, t);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  tine.connect(tg).connect(music);
  body.start(t); tine.start(t);
  body.stop(t + decay + 0.05); tine.stop(t + 0.2);
}

function schedule() {
  while (nextNote < ctx.currentTime + 0.25) {
    const bar = Math.floor(step / 8) % CHORDS.length, beat = step % 8, chord = CHORDS[bar];
    if (beat === 0) chord.forEach((s, i) => pluck(hz(s - 12), nextNote + i * 0.03, 0.22, 2.6));
    if (beat === 4) pluck(hz(chord[0] - 12), nextNote, 0.16, 1.8);
    // Melody: a slow random walk, resting now and then so it breathes.
    if (Math.random() < (beat % 2 ? 0.35 : 0.7)) {
      melody = Math.max(3, Math.min(13, melody + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      pluck(hz(scaleNote(melody)), nextNote, 0.32, 1.3);
    }
    nextNote += EIGHTH;
    step++;
  }
}

function chirp(vol = 0.035) {
  const t = ctx.currentTime, notes = 2 + Math.floor(Math.random() * 3), base = 2300 + Math.random() * 1300;
  for (let i = 0; i < notes; i++) {
    const o = ctx.createOscillator(), g = ctx.createGain(), s = t + i * 0.11;
    o.type = 'sine';
    o.frequency.setValueAtTime(base, s);
    o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.45), s + 0.06);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol, s + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, s + 0.09);
    o.connect(g).connect(master);
    o.start(s); o.stop(s + 0.1);
  }
}

function scheduleBird() {
  clearTimeout(birdTimer);
  birdTimer = setTimeout(() => { if (on) { chirp(0.022); scheduleBird(); } }, 6000 + Math.random() * 9000);
}

function tone(freq, dur = 0.25, type = 'sine', vol = 0.08, glide = 1) {
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (glide !== 1) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + dur + 0.02);
}

function burst(dur, freq, q, vol) {
  const t = ctx.currentTime, len = Math.ceil(ctx.sampleRate * (dur + 0.05));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = buf;
  bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t); src.stop(t + dur + 0.05);
}

const SFX = {
  chirp: () => chirp(0.05),
  leaf: () => { burst(0.16, 3800, 1.2, 0.12); tone(1400, 0.08, 'triangle', 0.025, 1.4); },
  rustle: () => burst(0.4, 2600, 0.9, 0.09),
  pop: () => tone(700, 0.13, 'triangle', 0.06, 1.6),
  splash: () => { burst(0.6, 1000, 0.7, 0.14); tone(330, 0.3, 'sine', 0.035, 0.5); },
  chime: () => [880, 1320, 1760].forEach((f, i) => setTimeout(() => tone(f, 0.9, 'sine', 0.035), i * 90)),
  drop: () => tone(1200, 0.35, 'sine', 0.08, 0.35),
  whoosh: () => burst(0.55, 700, 0.6, 0.1),
  send: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.5, 'sine', 0.05), i * 80)); setTimeout(() => chirp(0.05), 380); },
};

export function sfx(name) {
  if (!on || !ctx) return;
  SFX[name]?.();
}

export function soundOn() { return on; }

// Sound is on by default, but browsers only allow audio after the visitor
// interacts, so it starts on their first click, tap or key press.
let wanted = false;
export function initSound(defaultOn) {
  wanted = defaultOn;
  const kick = (e) => {
    if (e.target.closest?.('.sound')) return; // the toggle handles itself
    ['pointerdown', 'keydown', 'touchend'].forEach((t) => window.removeEventListener(t, kick, true));
    if (wanted && !on) setOn(true);
  };
  if (wanted) ['pointerdown', 'keydown', 'touchend'].forEach((t) => window.addEventListener(t, kick, true));
  return wanted;
}

export function toggleSound() {
  wanted = !wanted;
  setOn(wanted);
  return wanted;
}

function setOn(v) {
  on = v;
  if (on) {
    if (!ctx) setup();
    ctx.resume();
    nextNote = ctx.currentTime + 0.1;
    clearInterval(schedTimer);
    schedTimer = setInterval(schedule, 90);
    music.gain.cancelScheduledValues(ctx.currentTime);
    music.gain.setTargetAtTime(MUSIC_VOL, ctx.currentTime, 0.8);
    scheduleBird();
    setTimeout(() => chirp(0.04), 250);
  } else if (ctx) {
    music.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25);
    clearInterval(schedTimer);
    clearTimeout(birdTimer);
  }
}
