/* ==========================================================================
   AuraFocus Core App Entry Point & Event Controller
   ========================================================================== */

import { initAmbientCanvas } from './canvas.js';
import { initTimer, updateConfig, timerConfig } from './timer.js';
import { initTasks } from './tasks.js';
import { setSoundVolume, toggleMasterMute } from './audio.js';
import { initScratchpad } from './scratchpad.js';
import { initBreathing } from './breathing.js';
import { initAnalytics } from './analytics.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide vector icons
  if (window.lucide) window.lucide.createIcons();

  // 1. Initialize Subsystems
  initAmbientCanvas();
  initTimer();
  initTasks();
  initScratchpad();
  initBreathing();
  initAnalytics();

  // 2. Live Header Clock & Greeting
  startLiveClock();

  // 3. Theme Switcher Event Listeners
  initThemePicker();

  // 4. Zen Mode Fullscreen Toggle
  initZenMode();

  // 5. Soundscape Volume Controls
  initSoundMixer();

  // 6. Settings Modal Logic
  initSettingsModal();

  // 7. Keyboard Shortcuts (Space = Play/Pause, Esc = Zen Mode)
  initKeyboardShortcuts();
});

// Live Clock in Header
function startLiveClock() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

// 5 Theme Switching Logic
function initThemePicker() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('aurafocus_theme') || 'sage';
  
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const themeId = e.target.getAttribute('data-theme-id');
      setTheme(themeId);
    });
  });
}

function setTheme(themeId) {
  document.body.setAttribute('data-theme', themeId);
  localStorage.setItem('aurafocus_theme', themeId);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-id') === themeId);
  });
}

// Zen Mode Toggle
function initZenMode() {
  const btnZen = document.getElementById('btn-zen');
  if (!btnZen) return;

  btnZen.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
    const isZen = document.body.classList.contains('zen-mode');
    
    // Toggle icon
    const icon = btnZen.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isZen ? 'minimize-2' : 'maximize-2');
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

// Soundscape Mixer Event Handlers
function initSoundMixer() {
  const sliders = document.querySelectorAll('.sound-slider');
  const btnMute = document.getElementById('btn-master-mute');

  sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const soundType = e.target.getAttribute('data-sound');
      const volume = parseFloat(e.target.value);
      setSoundVolume(soundType, volume);
    });
  });

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      const isMuted = toggleMasterMute();
      const muteIcon = document.getElementById('mute-icon');
      if (muteIcon) {
        muteIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
}

// Settings Modal Handler
function initSettingsModal() {
  const btnSettings = document.getElementById('btn-settings');
  const modalSettings = document.getElementById('modal-settings');
  const btnSave = document.getElementById('btn-save-settings');
  const btnCancel = document.getElementById('btn-cancel-settings');

  const inputFocus = document.getElementById('setting-focus');
  const inputShort = document.getElementById('setting-short');
  const inputLong = document.getElementById('setting-long');

  if (btnSettings && modalSettings) {
    btnSettings.addEventListener('click', () => {
      inputFocus.value = timerConfig.focus;
      inputShort.value = timerConfig.shortBreak;
      inputLong.value = timerConfig.longBreak;
      modalSettings.classList.add('open');
    });
  }

  if (btnCancel && modalSettings) {
    btnCancel.addEventListener('click', () => {
      modalSettings.classList.remove('open');
    });
  }

  if (btnSave && modalSettings) {
    btnSave.addEventListener('click', () => {
      updateConfig(inputFocus.value, inputShort.value, inputLong.value);
      modalSettings.classList.remove('open');
    });
  }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Ignore when typing in text inputs or textareas
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      const toggleBtn = document.getElementById('btn-toggle');
      if (toggleBtn) toggleBtn.click();
    }

    if (e.code === 'Escape') {
      const isZen = document.body.classList.contains('zen-mode');
      if (isZen) {
        document.body.classList.remove('zen-mode');
      }
    }
  });
}
