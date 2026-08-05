/* ==========================================================================
   Focus Insights & Analytics Widget (SVG Chart)
   ========================================================================== */

let sessionLogs = [];

export function initAnalytics() {
  loadLogs();
  renderStats();
  renderChart();
}

export function recordCompletedSession(minutes) {
  const log = {
    timestamp: new Date().toISOString(),
    minutes: minutes
  };
  sessionLogs.push(log);
  saveLogs();
  renderStats();
  renderChart();
}

function renderStats() {
  const hoursEl = document.getElementById('stat-hours');
  const countEl = document.getElementById('stat-count');

  const totalMinutes = sessionLogs.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalPomodoros = sessionLogs.length;

  if (hoursEl) hoursEl.innerText = `${totalHours}h`;
  if (countEl) countEl.innerText = `${totalPomodoros}`;
}

function renderChart() {
  const chartSvg = document.getElementById('stats-chart');
  if (!chartSvg) return;

  // Calculate past 7 days focus minutes
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const dailyTotals = Array(7).fill(0);
  const dayLabels = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dayLabels.push(days[d.getDay()]);
  }

  // Populate actual data if available, or generate subtle demo curve if zero
  const dayMinutes = [25, 50, 75, 40, 90, 60, 0];
  
  // Aggregate real logs
  sessionLogs.forEach(log => {
    const logDate = new Date(log.timestamp);
    const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      dailyTotals[6 - diffDays] += log.minutes;
    }
  });

  const displayData = sessionLogs.length > 0 ? dailyTotals : dayMinutes;
  const maxVal = Math.max(...displayData, 100);

  // SVG Chart construction
  const width = 300;
  const height = 120;
  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = displayData.map((val, idx) => {
    const x = padding + (idx / (displayData.length - 1)) * usableWidth;
    const y = height - padding - (val / maxVal) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#76ba99';

  chartSvg.innerHTML = `
    <defs>
      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaD}" fill="url(#chartGrad)"/>
    <path d="${pathD}" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
    ${points.map((p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${accentColor}"/>
      <text x="${p.x}" y="${height - 2}" font-size="9" fill="var(--text-subtle)" text-anchor="middle">${dayLabels[i]}</text>
    `).join('')}
  `;
}

function saveLogs() {
  localStorage.setItem('aurafocus_logs', JSON.stringify(sessionLogs));
}

function loadLogs() {
  const saved = localStorage.getItem('aurafocus_logs');
  if (saved) {
    try {
      sessionLogs = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
}
