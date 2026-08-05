/* ==========================================================================
   Ambient Canvas Background Animation
   ========================================================================== */

export function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initOrbs();
  });

  let orbs = [];
  const ORB_COUNT = 16;

  class Orb {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 140 + 80;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.2 + 0.05;
      this.alphaTarget = this.alpha;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -100) this.x = width + 100;
      if (this.x > width + 100) this.x = -100;
      if (this.y < -100) this.y = height + 100;
      if (this.y > height + 100) this.y = -100;
    }

    draw() {
      const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#76ba99';

      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, hexToRgba(accentColor, this.alpha));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(118, 186, 153, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function initOrbs() {
    orbs = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      orbs.push(new Orb());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });
    requestAnimationFrame(animate);
  }

  initOrbs();
  animate();
}
