/**
 * js/sidebar.js
 * Quản lý Động Phủ (Sidebar trượt từ bên trái):
 * 1. Chuỗi Tu Luyện (Streak & Cảnh Giới Tu Tiên)
 * 2. Đạo Tâm / Mục Tiêu ngắn hạn (Đếm ngày còn lại, cảnh báo quá hạn)
 * 3. Ngộ Đạo Ký (Nhật ký tự lưu debounce, tìm kiếm từ khóa)
 * 4. Tàng Kinh Các (Sao lưu / Phục hồi JSON, Bật/Tắt Hạt Linh Khí & Scanlines)
 */

import { CONFIG, getLocalTodayStr, escapeHtml, createAssetElement } from './config.js';
import {
  loadData,
  saveData,
  getGoals,
  saveGoals,
  getJournalForDate,
  saveJournalForDate,
  getAllJournals,
  exportBackup,
  importBackup,
} from './storage.js';
import { renderStreakWidget } from './streak.js';
import { openDayModal } from './todo.js';
import { setBackground, toggleLingqiParticles, appState } from './app.js';

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnMenu = document.getElementById('btn-menu');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');

// Các nút chuyển Tab trong Sidebar
const tabButtons = document.querySelectorAll('.sidebar-nav-btn');
const tabPanes = document.querySelectorAll('.sidebar-tab-pane');

// Tham chiếu phần tử Tab Streak
const streakContainer = document.getElementById('sidebar-streak-container');

// Tham chiếu phần tử Tab Goals (Đạo Tâm)
const formAddGoal = document.getElementById('form-add-goal');
const inputGoalTitle = document.getElementById('goal-title-input');
const inputGoalDesc = document.getElementById('goal-desc-input');
const inputGoalDeadline = document.getElementById('goal-deadline-input');
const goalsListContainer = document.getElementById('goals-list-container');
let editingGoalId = null;

// Tham chiếu phần tử Tab Journal (Ngộ Đạo Ký)
const journalDateSelect = document.getElementById('journal-date-input');
const journalTextarea = document.getElementById('journal-textarea');
const journalSaveStatus = document.getElementById('journal-save-status');
const journalSearchInput = document.getElementById('journal-search-input');
const journalEntriesList = document.getElementById('journal-entries-list');
let journalDebounceTimer = null;
let activeJournalDate = getLocalTodayStr();

// Tham chiếu phần tử Tab Backup / Cài đặt
const btnExportJson = document.getElementById('btn-export-json');
const inputImportJson = document.getElementById('input-import-json');
const btnTriggerImport = document.getElementById('btn-trigger-import');
const toggleScanlinesBtn = document.getElementById('toggle-scanlines-btn');
const toggleParticlesBtn = document.getElementById('toggle-particles-btn');

/**
 * Mở Sidebar và đổi ảnh nền sang 'sidebar'
 */
export function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add('open');
  if (sidebarOverlay) sidebarOverlay.classList.add('active');
  sidebar.setAttribute('aria-hidden', 'false');
  document.body.classList.add('sidebar-open');

  // Đổi nền động sang trạng thái 'sidebar'
  setBackground('sidebar');

  renderCurrentTab();
}

/**
 * Đóng Sidebar và hoàn trả ảnh nền về 'calendar'
 */
export function closeSidebar() {
  if (!sidebar || !sidebar.classList.contains('open')) return;
  sidebar.classList.remove('open');
  if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  sidebar.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('sidebar-open');

  // Kiểm tra nếu modal ngày chưa mở thì hoàn trả về calendar
  const dayModal = document.getElementById('day-modal');
  if (!dayModal || !dayModal.classList.contains('active')) {
    setBackground('calendar');
  }
}

/**
 * Render nội dung tab đang active
 */
function renderCurrentTab() {
  const activeBtn = document.querySelector('.sidebar-nav-btn.active');
  const targetTab = activeBtn ? activeBtn.getAttribute('data-tab') : 'streak';

  if (targetTab === 'streak') {
    renderStreakTab();
  } else if (targetTab === 'goals') {
    renderGoalsTab();
  } else if (targetTab === 'journal') {
    renderJournalTab();
  }
}

// =============================================================
// 1. PHÂN HỆ CHUỖI TU LUYỆN (STREAK & REALM)
// =============================================================

function renderStreakTab() {
  if (!streakContainer) return;
  const data = loadData();
  renderStreakWidget(streakContainer, data.tasks, (dateStr) => {
    closeSidebar();
    openDayModal(dateStr);
  });
}

// =============================================================
// 2. PHÂN HỆ ĐẠO TÂM / MỤC TIÊU (GOALS)
// =============================================================

function calcDeadlineStatus(deadlineStr) {
  if (!deadlineStr) return { diffDays: 0, isOverdue: false, isToday: false, text: 'Vô hạn định' };

  const todayStr = getLocalTodayStr();
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const [dy, dm, dd] = deadlineStr.split('-').map(Number);

  const tDate = new Date(ty, tm - 1, td);
  const dDate = new Date(dy, dm - 1, dd);

  const diffMs = dDate.getTime() - tDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { diffDays, isOverdue: true, isToday: false, text: `QUÁ HẠN ${Math.abs(diffDays)} NGÀY` };
  } else if (diffDays === 0) {
    return { diffDays, isOverdue: false, isToday: true, text: 'HÔM NAY HẾT HẠN' };
  } else {
    return { diffDays, isOverdue: false, isToday: false, text: `CÒN ${diffDays} NGÀY` };
  }
}

function renderGoalsTab() {
  if (!goalsListContainer) return;

  const goals = getGoals();

  if (goals.length === 0) {
    goalsListContainer.innerHTML = `
      <div class="empty-list-notice">
        <span class="prompt-prefix">&gt;</span> Đạo tâm chưa lập mục tiêu nào.
        <br>Hãy khởi tâm lập nguyện ở biểu mẫu bên trên!
      </div>
    `;
    return;
  }

  const sorted = [...goals].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  });

  goalsListContainer.innerHTML = '';
  sorted.forEach(goal => {
    const isEditing = editingGoalId === goal.id;
    const deadlineInfo = calcDeadlineStatus(goal.deadline);
    const item = document.createElement('div');

    const itemClasses = ['goal-item', 'glass-item'];
    if (goal.done) itemClasses.push('is-done');
    if (!goal.done && deadlineInfo.isOverdue) itemClasses.push('is-overdue');
    if (!goal.done && deadlineInfo.isToday) itemClasses.push('is-due-today');
    item.className = itemClasses.join(' ');

    if (isEditing) {
      item.innerHTML = `
        <div class="goal-edit-box">
          <input type="text" class="edit-goal-title" value="${escapeHtml(goal.title)}" placeholder="Tên đạo tâm..." />
          <input type="date" class="edit-goal-deadline" value="${escapeHtml(goal.deadline || '')}" />
          <textarea class="edit-goal-desc" placeholder="Khẩu quyết chí hướng...">${escapeHtml(goal.desc || '')}</textarea>
          <div class="edit-actions">
            <button class="btn-terminal btn-save-goal-edit" type="button">[LƯU]</button>
            <button class="btn-terminal btn-cancel-goal-edit" type="button">[HỦY]</button>
          </div>
        </div>
      `;

      const btnSave = item.querySelector('.btn-save-goal-edit');
      const btnCancel = item.querySelector('.btn-cancel-goal-edit');
      const inTitle = item.querySelector('.edit-goal-title');
      const inDeadline = item.querySelector('.edit-goal-deadline');
      const inDesc = item.querySelector('.edit-goal-desc');

      btnSave.addEventListener('click', () => {
        const title = inTitle.value.trim();
        if (!title) {
          alert('Tên mục tiêu đạo tâm không được để trống!');
          return;
        }
        goal.title = title;
        goal.deadline = inDeadline.value;
        goal.desc = inDesc.value.trim();
        saveGoals(goals);
        editingGoalId = null;
        renderGoalsTab();
      });

      btnCancel.addEventListener('click', () => {
        editingGoalId = null;
        renderGoalsTab();
      });

      goalsListContainer.appendChild(item);
      return;
    }

    let deadlineBadgeHtml = '';
    if (goal.done) {
      deadlineBadgeHtml = `<span class="badge-deadline badge-done">[✓ ĐÃ VIÊN MÃN]</span>`;
    } else if (deadlineInfo.isOverdue) {
      deadlineBadgeHtml = `<span class="badge-deadline badge-danger" title="Đã quá thời hạn định ước!">[! ${deadlineInfo.text}]</span>`;
    } else if (deadlineInfo.isToday) {
      deadlineBadgeHtml = `<span class="badge-deadline badge-warning">[⚡ ${deadlineInfo.text}]</span>`;
    } else if (goal.deadline) {
      deadlineBadgeHtml = `<span class="badge-deadline badge-normal">[⏳ ${deadlineInfo.text} (${goal.deadline})]</span>`;
    }

    item.innerHTML = `
      <div class="goal-checkbox-wrap">
        <input type="checkbox" class="goal-checkbox" id="g-chk-${goal.id}" ${goal.done ? 'checked' : ''} aria-label="Hoàn tất ${escapeHtml(goal.title)}" />
        <label for="g-chk-${goal.id}" class="task-custom-check"></label>
      </div>

      <div class="goal-content">
        <div class="goal-title-row">
          <strong class="goal-title text-gold">${escapeHtml(goal.title)}</strong>
          ${deadlineBadgeHtml}
        </div>
        ${goal.desc ? `<div class="goal-desc text-muted">${escapeHtml(goal.desc)}</div>` : ''}
      </div>

      <div class="goal-actions">
        <button class="btn-icon btn-edit-goal" type="button" title="Sửa đạo tâm">[SỬA]</button>
        <button class="btn-icon btn-del-goal" type="button" title="Xóa đạo tâm">[XÓA]</button>
      </div>
    `;

    const chk = item.querySelector('.goal-checkbox');
    chk.addEventListener('change', (e) => {
      goal.done = e.target.checked;
      saveGoals(goals);
      renderGoalsTab();
    });

    const btnEdit = item.querySelector('.btn-edit-goal');
    btnEdit.addEventListener('click', () => {
      editingGoalId = goal.id;
      renderGoalsTab();
    });

    const btnDel = item.querySelector('.btn-del-goal');
    btnDel.addEventListener('click', () => {
      if (confirm(`Bạn có chắc muốn xóa đạo tâm: "${goal.title}"?`)) {
        const remaining = goals.filter(g => g.id !== goal.id);
        saveGoals(remaining);
        renderGoalsTab();
      }
    });

    goalsListContainer.appendChild(item);
  });
}

function handleAddGoal(e) {
  if (e) e.preventDefault();
  const title = inputGoalTitle ? inputGoalTitle.value.trim() : '';
  if (!title) {
    alert('Vui lòng nhập tên mục tiêu đạo tâm!');
    if (inputGoalTitle) inputGoalTitle.focus();
    return;
  }

  const desc = inputGoalDesc ? inputGoalDesc.value.trim() : '';
  const deadline = inputGoalDeadline ? inputGoalDeadline.value : '';

  const newGoal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title,
    desc,
    deadline,
    done: false,
    createdAt: new Date().toISOString(),
  };

  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);

  inputGoalTitle.value = '';
  if (inputGoalDesc) inputGoalDesc.value = '';
  if (inputGoalDeadline) inputGoalDeadline.value = '';
  inputGoalTitle.focus();

  renderGoalsTab();
}

// =============================================================
// 3. PHÂN HỆ NGỘ ĐẠO KÝ (JOURNAL)
// =============================================================

function renderJournalTab() {
  if (!journalDateSelect || !journalTextarea) return;

  journalDateSelect.value = activeJournalDate;

  const content = getJournalForDate(activeJournalDate);
  journalTextarea.value = content;
  if (journalSaveStatus) {
    journalSaveStatus.textContent = content ? '[✓ Đã ghi vào ngộ đạo thư]' : '[Chưa có bản thảo]';
    journalSaveStatus.className = 'status-tag text-muted';
  }

  renderJournalEntriesList();
}

function renderJournalEntriesList() {
  if (!journalEntriesList) return;

  const allJournals = getAllJournals();
  const filterText = (journalSearchInput ? journalSearchInput.value : '').trim().toLowerCase();

  const datesWithEntries = Object.keys(allJournals)
    .filter(date => {
      const text = allJournals[date] || '';
      if (!text.trim()) return false;
      if (!filterText) return true;
      return date.includes(filterText) || text.toLowerCase().includes(filterText);
    })
    .sort()
    .reverse();

  if (datesWithEntries.length === 0) {
    journalEntriesList.innerHTML = `
      <div class="empty-list-notice">
        <span class="prompt-prefix">&gt;</span> ${filterText ? 'Không tìm thấy ngộ đạo ký chứa từ khóa.' : 'Chưa có trang ngộ đạo ký nào.'}
      </div>
    `;
    return;
  }

  journalEntriesList.innerHTML = '';
  datesWithEntries.forEach(date => {
    const text = allJournals[date] || '';
    const snippet = text.length > 70 ? text.slice(0, 70) + '...' : text;
    const isCurrent = date === activeJournalDate;

    const div = document.createElement('div');
    div.className = `journal-entry-card glass-item ${isCurrent ? 'is-active' : ''}`;
    div.setAttribute('tabindex', '0');
    div.innerHTML = `
      <div class="entry-date-header">
        <strong class="entry-date text-gold"><span class="prompt-prefix">&gt;</span> ${date}</strong>
        <span class="entry-len text-muted">${text.length} chữ</span>
      </div>
      <div class="entry-snippet text-muted">${escapeHtml(snippet)}</div>
    `;

    const handleSelect = () => {
      activeJournalDate = date;
      renderJournalTab();
    };

    div.addEventListener('click', handleSelect);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });

    journalEntriesList.appendChild(div);
  });
}

function handleJournalInput() {
  if (journalSaveStatus) {
    journalSaveStatus.textContent = '[...Đang lưu ngộ đạo]';
    journalSaveStatus.className = 'status-tag text-accent';
  }

  clearTimeout(journalDebounceTimer);
  journalDebounceTimer = setTimeout(() => {
    const text = journalTextarea.value;
    saveJournalForDate(activeJournalDate, text);

    if (journalSaveStatus) {
      journalSaveStatus.textContent = text.trim() ? '[✓ Đã lưu tự động]' : '[Đã xóa bản thảo]';
      journalSaveStatus.className = 'status-tag text-success';
    }
    renderJournalEntriesList();
  }, CONFIG.JOURNAL_DEBOUNCE_MS);
}

// =============================================================
// 4. TÀNG KINH CÁC (SAO LƯU & CÀI ĐẶT)
// =============================================================

function handleFileImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const jsonStr = event.target.result;
    const mergeOption = confirm('Bạn muốn GỘP dữ liệu mới vào dữ liệu hiện tại?\n\n- Bấm OK để GỘP (giữ dữ liệu cũ)\n- Bấm Cancel để GHI ĐÈ HOÀN TOÀN');
    const result = importBackup(jsonStr, mergeOption);

    alert(result.message);
    if (result.success) {
      renderCurrentTab();
    }
    e.target.value = '';
  };

  reader.onerror = () => {
    alert('Không thể đọc file đã chọn.');
    e.target.value = '';
  };

  reader.readAsText(file);
}

function toggleScanlines() {
  const isEnabled = document.body.classList.toggle('has-scanlines');
  localStorage.setItem(CONFIG.SCANLINE_STORAGE_KEY, isEnabled ? 'true' : 'false');
  updateScanlineButtonText();
}

function updateScanlineButtonText() {
  if (!toggleScanlinesBtn) return;
  const isEnabled = document.body.classList.contains('has-scanlines');
  toggleScanlinesBtn.textContent = isEnabled ? '[SCANLINES: ĐANG BẬT]' : '[SCANLINES: ĐANG TẮT]';
}

function updateParticlesButtonText() {
  if (!toggleParticlesBtn) return;
  toggleParticlesBtn.textContent = appState.particlesActive ? '[LINH KHÍ: ĐANG BẬT]' : '[LINH KHÍ: ĐANG TẮT]';
}

// =============================================================
// KHỞI TẠO BỘ ĐIỀU KHIỂN SIDEBAR
// =============================================================

export function initSidebar() {
  if (btnMenu) {
    btnMenu.addEventListener('click', openSidebar);
  }

  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`tab-pane-${tabKey}`);
      if (targetPane) targetPane.classList.add('active');

      renderCurrentTab();
    });
  });

  if (formAddGoal) {
    formAddGoal.addEventListener('submit', handleAddGoal);
  }

  if (journalDateSelect) {
    journalDateSelect.value = activeJournalDate;
    journalDateSelect.addEventListener('change', (e) => {
      activeJournalDate = e.target.value || getLocalTodayStr();
      renderJournalTab();
    });
  }

  if (journalTextarea) {
    journalTextarea.addEventListener('input', handleJournalInput);
  }

  if (journalSearchInput) {
    journalSearchInput.addEventListener('input', renderJournalEntriesList);
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', exportBackup);
  }

  if (btnTriggerImport && inputImportJson) {
    btnTriggerImport.addEventListener('click', () => inputImportJson.click());
    inputImportJson.addEventListener('change', handleFileImport);
  }

  if (toggleScanlinesBtn) {
    toggleScanlinesBtn.addEventListener('click', toggleScanlines);
    const savedScanline = localStorage.getItem(CONFIG.SCANLINE_STORAGE_KEY);
    if (savedScanline === 'true') {
      document.body.classList.add('has-scanlines');
    }
    updateScanlineButtonText();
  }

  if (toggleParticlesBtn) {
    toggleParticlesBtn.addEventListener('click', () => {
      toggleLingqiParticles();
      updateParticlesButtonText();
    });
    updateParticlesButtonText();
  }

  const bannerPlaceholder = document.getElementById('sidebar-banner-slot');
  if (bannerPlaceholder) {
    const bannerElem = createAssetElement('sidebarBanner', 'Tiên Gia Động Phủ', 'sidebar-banner-img');
    bannerPlaceholder.appendChild(bannerElem);
  }

  window.addEventListener('todo:data-changed', () => {
    if (sidebar && sidebar.classList.contains('open')) {
      renderCurrentTab();
    }
  });
}
