/* ==========================================================================
   Task Management Engine with Pomodoro Binding
   ========================================================================== */

let tasks = [];
let activeTaskId = null;
let currentFilter = 'all';

export function initTasks() {
  loadTasks();

  const form = document.getElementById('task-form');
  const filterSelect = document.getElementById('task-filter');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task-input');
      const tagSelect = document.getElementById('task-tag');
      const estSelect = document.getElementById('task-est');

      if (!input || !input.value.trim()) return;

      addTask(input.value.trim(), tagSelect.value, parseInt(estSelect.value));
      input.value = '';
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderTasks();
    });
  }

  // Pre-populate demo tasks if empty on first load
  if (tasks.length === 0) {
    addTask('Deep work on project proposal', 'work', 3);
    addTask('Review research papers & outline notes', 'study', 2);
    addTask('Mindful afternoon walk', 'personal', 1);
  } else {
    renderTasks();
  }
}

export function addTask(title, tag = 'work', estPomodoros = 3) {
  const newTask = {
    id: Date.now().toString(),
    title,
    tag,
    estPomodoros,
    completedPomodoros: 0,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  if (!activeTaskId) {
    setActiveTask(newTask.id);
  }
  saveTasks();
  renderTasks();
}

export function toggleTaskCompleted(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  if (activeTaskId === id) {
    const remaining = tasks.filter(t => !t.completed);
    activeTaskId = remaining.length > 0 ? remaining[0].id : null;
  }
  saveTasks();
  renderTasks();
}

export function setActiveTask(id) {
  activeTaskId = id;
  saveTasks();
  renderTasks();
  updateActiveTaskPill();
}

export function incrementActiveTaskPomodoro() {
  if (!activeTaskId) return;
  const task = tasks.find(t => t.id === activeTaskId);
  if (task) {
    task.completedPomodoros++;
    if (task.completedPomodoros >= task.estPomodoros) {
      task.completed = true;
    }
    saveTasks();
    renderTasks();
    updateActiveTaskPill();
  }
}

function updateActiveTaskPill() {
  const pill = document.getElementById('active-task-display');
  if (!pill) return;

  const activeTask = tasks.find(t => t.id === activeTaskId);
  if (activeTask) {
    pill.innerText = `🎯 ${activeTask.title} (${activeTask.completedPomodoros}/${activeTask.estPomodoros} 🍅)`;
  } else {
    pill.innerText = '🎯 Select a task below';
  }
}

export function renderTasks() {
  const listEl = document.getElementById('task-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  const filteredTasks = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    if (['work', 'study', 'personal', 'creative'].includes(currentFilter)) {
      return t.tag === currentFilter;
    }
    return true; // 'all'
  });

  if (filteredTasks.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.9rem;">
        No tasks found. Add a task above to begin your focus session!
      </div>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === activeTaskId ? 'active-task' : ''}`;
    
    item.innerHTML = `
      <div class="task-left">
        <div class="task-checkbox" data-action="toggle" data-id="${task.id}">
          ${task.completed ? '✓' : ''}
        </div>
        <div>
          <div class="task-text">${escapeHtml(task.title)}</div>
          <span class="task-tag">${task.tag}</span>
        </div>
      </div>

      <div class="task-right">
        <div class="pomo-badge">
          🍅 ${task.completedPomodoros}/${task.estPomodoros}
        </div>
        <div class="task-actions">
          <button class="btn-icon" data-action="activate" data-id="${task.id}" title="Set as Active Focus Task" style="width: 32px; height: 32px;">
            <i data-lucide="target" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="btn-icon" data-action="delete" data-id="${task.id}" title="Delete Task" style="width: 32px; height: 32px;">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </div>
    `;

    item.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'toggle') toggleTaskCompleted(id);
      if (action === 'activate') setActiveTask(id);
      if (action === 'delete') deleteTask(id);
    });

    listEl.appendChild(item);
  });

  if (window.lucide) window.lucide.createIcons();
  updateActiveTaskPill();
}

function saveTasks() {
  localStorage.setItem('aurafocus_tasks', JSON.stringify(tasks));
  localStorage.setItem('aurafocus_active_task_id', activeTaskId);
}

function loadTasks() {
  const saved = localStorage.getItem('aurafocus_tasks');
  const savedActiveId = localStorage.getItem('aurafocus_active_task_id');

  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  if (savedActiveId) {
    activeTaskId = savedActiveId;
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}
