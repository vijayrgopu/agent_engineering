/* ==========================================================================
   Mindful Box Breathing Visualizer Guide
   ========================================================================== */

let breathingInterval = null;
let currentPhaseIndex = 0;
let phaseCountdown = 4;

const PHASES = [
  { name: 'Inhale', scale: 1.4, color: 'var(--accent-color)' },
  { name: 'Hold', scale: 1.4, color: 'var(--accent-secondary)' },
  { name: 'Exhale', scale: 0.85, color: 'var(--timer-long-break)' },
  { name: 'Hold', scale: 0.85, color: 'var(--text-muted)' }
];

export function initBreathing() {
  const modal = document.getElementById('modal-breathing');
  const btnOpen = document.getElementById('btn-breathing');
  const btnClose = document.getElementById('btn-close-breathing');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      openBreathingModal();
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      closeBreathingModal();
    });
  }
}

export function openBreathingModal() {
  const modal = document.getElementById('modal-breathing');
  if (!modal) return;

  modal.classList.add('open');
  startBreathingCycle();
}

export function closeBreathingModal() {
  const modal = document.getElementById('modal-breathing');
  if (!modal) return;

  modal.classList.remove('open');
  stopBreathingCycle();
}

function startBreathingCycle() {
  currentPhaseIndex = 0;
  phaseCountdown = 4;
  updateBreathingUI();

  clearInterval(breathingInterval);
  breathingInterval = setInterval(() => {
    phaseCountdown--;
    if (phaseCountdown <= 0) {
      phaseCountdown = 4;
      currentPhaseIndex = (currentPhaseIndex + 1) % PHASES.length;
    }
    updateBreathingUI();
  }, 1000);
}

function stopBreathingCycle() {
  clearInterval(breathingInterval);
}

function updateBreathingUI() {
  const phase = PHASES[currentPhaseIndex];
  const circle = document.getElementById('breathing-circle');
  const phaseText = document.getElementById('breathing-phase');
  const counterText = document.getElementById('breathing-counter');

  if (phaseText) phaseText.innerText = phase.name;
  if (counterText) counterText.innerText = phaseCountdown;

  if (circle) {
    circle.style.transform = `scale(${phase.scale})`;
    circle.style.borderColor = phase.color;
  }
}
