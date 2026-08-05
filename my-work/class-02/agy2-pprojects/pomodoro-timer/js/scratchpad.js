/* ==========================================================================
   Distraction Scratchpad ("Park It")
   ========================================================================== */

export function initScratchpad() {
  const pad = document.getElementById('scratchpad');
  if (!pad) return;

  // Load saved content
  const savedNote = localStorage.getItem('aurafocus_scratchpad');
  if (savedNote) {
    pad.value = savedNote;
  }

  // Auto-save on input
  pad.addEventListener('input', () => {
    localStorage.setItem('aurafocus_scratchpad', pad.value);
  });
}
