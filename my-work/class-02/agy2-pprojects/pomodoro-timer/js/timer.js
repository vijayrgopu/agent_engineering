/* ==========================================================================
   Pomodoro Timer Engine & Ring Controller
   ========================================================================== */

import { playChimeSound } from './audio.js';
import { recordCompletedSession } from './analytics.js';
import { incrementActiveTaskPomodoro } from './tasks.js';

export let timerConfig = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4
};

let currentMode = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
let timeRemaining = timerConfig.focus * 60;
let timerDuration = timerConfig.focus * 60;
let isRunning = false;
let timerInterval = null;
let completedFocusCount = 0;

// SVG Ring Circumference: 2 * Math.PI * 140 = 879.64
const RING_CIRCUMFERENCE = 879.64;

export function initTimer(onStateChangeCallback) {
  loadSavedConfig();
  updateTimerDisplay();

  const btnToggle = document.getElementById('btn-toggle');
  const btnReset = document.getElementById('btn-reset');
  const btnSkip = document.getElementById('btn-skip');
  const modeBtns = document.querySelectorAll('.mode-btn');

  btnToggle.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  btnReset.addEventListener('click', () => {
    resetTimer();
  });

  btnSkip.addEventListener('click', () => {
    skipSession();
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedMode = e.target.getAttribute('data-mode');
      setMode(selectedMode);
    });
  });
}

export function startTimer() {
  if (isRunning) return;
  isRunning = true;

  playChimeSound('start');
  updateControlButtons();

  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateTimerDisplay();
    } else {
      onTimerComplete();
    }
  }, 1000);
}

export function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
  updateControlButtons();
}

export function resetTimer() {
  pauseTimer();
  timeRemaining = timerDuration;
  updateTimerDisplay();
}

export function skipSession() {
  pauseTimer();
  advanceNextMode();
}

function setMode(mode) {
  pauseTimer();
  currentMode = mode;
  timerDuration = timerConfig[mode] * 60;
  timeRemaining = timerDuration;

  // Update mode tabs
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });

  // Update label
  const labelMap = {
    focus: 'Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };
  document.getElementById('timer-label').innerText = labelMap[mode];

  updateTimerDisplay();
}

function onTimerComplete() {
  pauseTimer();
  playChimeSound('complete');

  if (currentMode === 'focus') {
    completedFocusCount++;
    recordCompletedSession(timerConfig.focus);
    incrementActiveTaskPomodoro();
    updateSessionDots();
  }

  advanceNextMode();
}

function advanceNextMode() {
  if (currentMode === 'focus') {
    if (completedFocusCount % timerConfig.longBreakInterval === 0 && completedFocusCount > 0) {
      setMode('longBreak');
    } else {
      setMode('shortBreak');
    }
  } else {
    setMode('focus');
  }
}

export function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const clockEl = document.getElementById('timer-display');
  if (clockEl) clockEl.innerText = timeString;

  // Browser tab title update
  const modeAbbr = currentMode === 'focus' ? '🎯' : '☕';
  document.title = `${modeAbbr} ${timeString} — AuraFocus`;

  // Update Ring SVG Stroke Dashoffset
  const progressCircle = document.getElementById('timer-progress');
  if (progressCircle) {
    const fraction = timeRemaining / timerDuration;
    const offset = RING_CIRCUMFERENCE * (1 - fraction);
    progressCircle.style.strokeDashoffset = offset;
  }
}

function updateControlButtons() {
  const playIcon = document.getElementById('play-icon');
  const playText = document.getElementById('play-text');
  
  if (isRunning) {
    if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
    if (playText) playText.innerText = 'Pause';
  } else {
    if (playIcon) playIcon.setAttribute('data-lucide', 'play');
    if (playText) playText.innerText = currentMode === 'focus' ? 'Start Focus' : 'Start Break';
  }

  if (window.lucide) window.lucide.createIcons();
}

function updateSessionDots() {
  const dots = document.querySelectorAll('.session-dots .dot');
  const step = ((completedFocusCount - 1) % timerConfig.longBreakInterval);
  
  dots.forEach((dot, index) => {
    if (index <= step && completedFocusCount > 0) {
      dot.classList.add('completed');
    } else {
      dot.classList.remove('completed');
    }
  });
}

export function updateConfig(newFocus, newShort, newLong) {
  timerConfig.focus = parseInt(newFocus) || 25;
  timerConfig.shortBreak = parseInt(newShort) || 5;
  timerConfig.longBreak = parseInt(newLong) || 15;

  saveConfig();
  setMode(currentMode);
}

function saveConfig() {
  localStorage.setItem('aurafocus_timer_config', JSON.stringify(timerConfig));
}

function loadSavedConfig() {
  const saved = localStorage.getItem('aurafocus_timer_config');
  if (saved) {
    try {
      timerConfig = { ...timerConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
  }
}
