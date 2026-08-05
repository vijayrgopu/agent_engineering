/* ==========================================================================
   Procedural Web Audio API Soundscape & Chime Synthesizer
   ========================================================================== */

let audioCtx = null;
let masterGain = null;
let isMuted = false;

const soundNodes = {
  rain: null,
  ocean: null,
  forest: null,
  cafe: null,
  alpha: null
};

// Initialize Audio Context on user interaction
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate Noise Buffer (Pink / Brown / White)
function createNoiseBuffer(type = 'pink') {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    } else if (type === 'brown') {
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    } else { // White
      output[i] = white * 0.1;
    }
  }

  return buffer;
}

// Soundscape 1: Gentle Rain
function setupRainNode() {
  const ctx = getAudioContext();
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = createNoiseBuffer('pink');
  bufferSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  bufferSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  bufferSource.start();

  return { gain, source: bufferSource };
}

// Soundscape 2: Ocean Waves
function setupOceanNode() {
  const ctx = getAudioContext();
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = createNoiseBuffer('pink');
  bufferSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  // Slow LFO for wave swelling
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12; // 12-second wave period
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 250;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.value = 0;

  bufferSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  bufferSource.start();
  lfo.start();

  return { gain, source: bufferSource };
}

// Soundscape 3: Forest Wind
function setupForestNode() {
  const ctx = getAudioContext();
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = createNoiseBuffer('brown');
  bufferSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 500;
  filter.Q.value = 3.0;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  bufferSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  bufferSource.start();

  return { gain, source: bufferSource };
}

// Soundscape 4: Cozy Cafe
function setupCafeNode() {
  const ctx = getAudioContext();
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = createNoiseBuffer('brown');
  bufferSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  bufferSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  bufferSource.start();

  return { gain, source: bufferSource };
}

// Soundscape 5: Alpha Binaural Beats (200Hz + 210Hz)
function setupAlphaNode() {
  const ctx = getAudioContext();

  const oscLeft = ctx.createOscillator();
  const oscRight = ctx.createOscillator();
  oscLeft.frequency.value = 200;
  oscRight.frequency.value = 210; // 10Hz Alpha difference

  const merger = ctx.createChannelMerger(2);
  const gain = ctx.createGain();
  gain.gain.value = 0;

  oscLeft.connect(merger, 0, 0);
  oscRight.connect(merger, 0, 1);
  merger.connect(gain);
  gain.connect(masterGain);

  oscLeft.start();
  oscRight.start();

  return { gain, source: oscLeft };
}

// Sound Controller API
export function setSoundVolume(type, volumePercent) {
  const ctx = getAudioContext();
  const targetGain = (volumePercent / 100) * 0.4;

  if (!soundNodes[type]) {
    if (type === 'rain') soundNodes.rain = setupRainNode();
    if (type === 'ocean') soundNodes.ocean = setupOceanNode();
    if (type === 'forest') soundNodes.forest = setupForestNode();
    if (type === 'cafe') soundNodes.cafe = setupCafeNode();
    if (type === 'alpha') soundNodes.alpha = setupAlphaNode();
  }

  if (soundNodes[type] && soundNodes[type].gain) {
    soundNodes[type].gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.1);
  }
}

export function toggleMasterMute() {
  const ctx = getAudioContext();
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.setTargetAtTime(isMuted ? 0 : 1.0, ctx.currentTime, 0.1);
  }
  return isMuted;
}

// Synthesize Tibetan Singing Bowl / Soft Chime Sound
export function playChimeSound(type = 'complete') {
  const ctx = getAudioContext();

  const freqs = type === 'complete' ? [440, 554.37, 659.25] : [329.63, 440];
  const now = ctx.currentTime;

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.15);

    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 2.5);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 2.6);
  });
}
