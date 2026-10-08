/**
 * js/todo.js
 * Quản lý Hộp Thoại Công Khóa Ngày (Day Modal):
 * - Tự động đổi ảnh nền sang 'day' khi mở và hoàn trả nền cũ khi đóng.
 * - 3 vùng: Danh sách Công khóa (Trái), Thơ cổ điển kèm ấn triện (Phải trên), Chi tiết công khóa (Phải dưới).
 * - Hoàn thành >50% đánh dấu "Đột phá thành công", ngược lại "Chưa đạt hỏa hầu".
 */

import { escapeHtml, createAssetElement } from './config.js';
import { getTasksForDate, saveTasksForDate } from './storage.js';
import { isDayAchieved, getDayStats } from './streak.js';
import { getPoemForDate, getRandomPoem } from './poems.js';
import { setBackground } from './app.js';

let activeDateStr = null;
let currentPoemState = null;
let editingTaskId = null;

const modalBackdrop = document.getElementById('day-modal');
const modalDateTitle = document.getElementById('modal-date-title');
const modalTaskCount = document.getElementById('modal-task-count');
const modalProgressBar = document.getElementById('modal-progress-bar');
const modalStreakBadge = document.getElementById('modal-streak-badge');
const taskListContainer = document.getElementById('task-list-container');
const addTaskForm = document.getElementById('add-task-form');
const inputTaskTitle = document.getElementById('task-title-input');
const inputTaskStart = document.getElementById('task-start-input');
const inputTaskEnd = document.getElementById('task-end-input');
const inputTaskDesc = document.getElementById('task-desc-input');
const btnSortTime = document.getElementById('btn-sort-time');

const poemChinese = document.getElementById('poem-chinese');
const poemPinyin = document.getElementById('poem-pinyin');
const poemVietnamese = document.getElementById('poem-vietnamese');
const poemMeta = document.getElementById('poem-meta');
const btnChangePoem = document.getElementById('btn-change-poem');

const taskDetailPanel = document.getElementById('task-detail-panel');

/**
 * Định dạng ngày YYYY-MM-DD sang định dạng Thứ, ngày/tháng/năm tiếng Việt
 * @param {string} dateStr 
 * @returns {string}
 */
function formatVietnameseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[dt.getDay()];
  return `${dayName}, ngày ${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
}

/**
 * Mở Modal chi tiết cho ngày được chọn
 * @param {string} dateStr YYYY-MM-DD
 */
export function openDayModal(dateStr) {
  activeDateStr = dateStr;
  editingTaskId = null;

  // Đổi nền động sang trạng thái 'day'
  setBackground('day');

  // Hiển thị tiêu đề ngày
  if (modalDateTitle) {
    modalDateTitle.textContent = `${dateStr} • ${formatVietnameseDate(dateStr)}`;
  }

  // Tải câu thơ theo ngày
  currentPoemState = getPoemForDate(dateStr);
  renderPoem(currentPoemState.poem);

  // Hiển thị danh sách công khóa
  renderTaskList();

  // Reset panel chi tiết về trạng thái chờ
  resetTaskDetailPanel();

  // Mở modal
  modalBackdrop.classList.add('active');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  setTimeout(() => {
    if (inputTaskTitle) inputTaskTitle.focus();
  }, 100);
}

/**
 * Đóng Modal và trả lại nền trước đó (nếu sidebar đang mở thì về sidebar, ngược lại về calendar)
 */
export function closeDayModal() {
  if (!modalBackdrop.classList.contains('active')) return;
  modalBackdrop.classList.remove('active');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeDateStr = null;
  editingTaskId = null;

  // Khôi phục nền
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    setBackground('sidebar');
  } else {
    setBackground('calendar');
  }
}

/**
 * Hiển thị câu thơ lên vùng góc phải trên kèm con dấu triện đỏ
 * @param {object} poem 
 */
function renderPoem(poem) {
  if (!poem) return;
  if (poemChinese) poemChinese.textContent = poem.chinese;
  if (poemPinyin) poemPinyin.textContent = poem.pinyin;
  if (poemVietnamese) poemVietnamese.textContent = poem.vietnamese;
  if (poemMeta) poemMeta.textContent = `— ${poem.author} • 《${poem.title}》`;
}

/**
 * Hiển thị chi tiết của một công khóa lên góc phải dưới
 * @param {object} task 
 */
function showTaskDetail(task) {
  if (!taskDetailPanel) return;

  const timeRange = (task.start || task.end)
    ? `${task.start || '--:--'} → ${task.end || '--:--'}`
    : 'Chưa định canh giờ';

  const statusText = task.done
    ? '<span class="status-badge badge-done">[✓ ĐÃ HOÀN TẤT CÔNG KHÓA]</span>'
    : '<span class="status-badge badge-pending">[• ĐANG CẦN THỰC THI]</span>';

  taskDetailPanel.innerHTML = `
    <div class="task-detail-content">
      <div class="detail-header">
        <span class="prompt-prefix">&gt;</span> <strong>CHI TIẾT CÔNG KHÓA</strong>
        <div class="detail-status">${statusText}</div>
      </div>
      <div class="detail-row">
        <span class="detail-label">DANH XƯNG:</span>
        <span class="detail-val detail-title text-gold">${escapeHtml(task.title)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">CANH GIỜ:</span>
        <span class="detail-val text-jade">${escapeHtml(timeRange)}</span>
      </div>
      <div class="detail-row detail-desc-block">
        <span class="detail-label">GHI CHÚ TU VI:</span>
        <div class="detail-val desc-box">${task.desc ? escapeHtml(task.desc) : '<em class="text-muted">(Không có khẩu quyết bổ sung)</em>'}</div>
      </div>
      <div class="detail-footer text-muted">
        Mã ID: <code>${escapeHtml(task.id)}</code>
      </div>
    </div>
  `;
}

/**
 * Reset panel chi tiết về trạng thái hướng dẫn mặc định
 */
function resetTaskDetailPanel() {
  if (!taskDetailPanel) return;
  taskDetailPanel.innerHTML = `
    <div class="task-detail-placeholder">
      <span class="prompt-prefix">&gt;</span> Di chuột (hoặc chạm trên mobile) vào một công khóa ở bên trái để soi xét chi tiết tại đây.
    </div>
  `;
}

/**
 * Render danh sách Công Khóa và tiến độ hoàn thành
 */
function renderTaskList() {
  if (!activeDateStr || !taskListContainer) return;

  const tasks = getTasksForDate(activeDateStr);
  const stats = getDayStats(tasks);

  // Cập nhật thông số tiến độ
  if (modalTaskCount) {
    modalTaskCount.textContent = `${stats.done}/${stats.total} việc (${stats.percent}%)`;
  }
  if (modalProgressBar) {
    modalProgressBar.style.width = `${stats.percent}%`;
    if (stats.achieved) {
      modalProgressBar.classList.add('achieved');
    } else {
      modalProgressBar.classList.remove('achieved');
    }
  }
  if (modalStreakBadge) {
    if (stats.total === 0) {
      modalStreakBadge.className = 'streak-badge badge-none';
      modalStreakBadge.textContent = '[• Chưa lập công khóa]';
    } else if (stats.achieved) {
      modalStreakBadge.className = 'streak-badge badge-achieved';
      modalStreakBadge.textContent = '[✓ ĐỘT PHÁ THÀNH CÔNG >50%]';
    } else {
      modalStreakBadge.className = 'streak-badge badge-failed';
      modalStreakBadge.textContent = '[! CHƯA ĐẠT HỎA HẦU (≤50%)]';
    }
  }

  // Nếu danh sách trống, hiển thị emptyState an toàn
  if (tasks.length === 0) {
    taskListContainer.innerHTML = '';
    const emptySlot = createAssetElement('emptyState', 'Chưa có công khóa', 'todo-empty-state');
    taskListContainer.appendChild(emptySlot);
    return;
  }

  // Render danh sách task
  taskListContainer.innerHTML = '';
  tasks.forEach((task) => {
    const isEditing = editingTaskId === task.id;
    const taskItem = document.createElement('div');
    taskItem.className = `task-item glass-item ${task.done ? 'is-done' : ''} ${isEditing ? 'is-editing' : ''}`;
    taskItem.setAttribute('data-id', task.id);
    taskItem.setAttribute('tabindex', '0');

    if (isEditing) {
      taskItem.innerHTML = `
        <div class="task-edit-box">
          <div class="edit-row">
            <span class="prompt-prefix">&gt;</span>
            <input type="text" class="edit-input-title" value="${escapeHtml(task.title)}" placeholder="Tên công khóa..." />
          </div>
          <div class="edit-row edit-times">
            <span>Giờ:</span>
            <input type="time" class="edit-input-start" value="${escapeHtml(task.start || '')}" />
            <span>→</span>
            <input type="time" class="edit-input-end" value="${escapeHtml(task.end || '')}" />
          </div>
          <div class="edit-row">
            <input type="text" class="edit-input-desc" value="${escapeHtml(task.desc || '')}" placeholder="Ghi chú khẩu quyết..." />
          </div>
          <div class="edit-actions">
            <button class="btn-terminal btn-save-edit" type="button">[LƯU]</button>
            <button class="btn-terminal btn-cancel-edit" type="button">[HỦY]</button>
          </div>
        </div>
      `;

      const btnSave = taskItem.querySelector('.btn-save-edit');
      const btnCancel = taskItem.querySelector('.btn-cancel-edit');
      const inTitle = taskItem.querySelector('.edit-input-title');
      const inStart = taskItem.querySelector('.edit-input-start');
      const inEnd = taskItem.querySelector('.edit-input-end');
      const inDesc = taskItem.querySelector('.edit-input-desc');

      btnSave.addEventListener('click', () => {
        const newTitle = inTitle.value.trim();
        if (!newTitle) {
          alert('Tên công khóa không được để trống!');
          return;
        }
        task.title = newTitle;
        task.start = inStart.value;
        task.end = inEnd.value;
        task.desc = inDesc.value.trim();
        saveTasksForDate(activeDateStr, tasks);
        editingTaskId = null;
        renderTaskList();
        showTaskDetail(task);
      });

      btnCancel.addEventListener('click', () => {
        editingTaskId = null;
        renderTaskList();
      });

      taskListContainer.appendChild(taskItem);
      return;
    }

    const timeLabel = (task.start || task.end)
      ? `<span class="task-time-pill">[${escapeHtml(task.start || '--:--')}${task.end ? ' - ' + escapeHtml(task.end) : ''}]</span>`
      : '';

    taskItem.innerHTML = `
      <div class="task-checkbox-wrap">
        <input type="checkbox" class="task-checkbox" id="chk-${task.id}" ${task.done ? 'checked' : ''} aria-label="Hoàn tất ${escapeHtml(task.title)}" />
        <label for="chk-${task.id}" class="task-custom-check"></label>
      </div>

      <div class="task-main-content">
        <div class="task-title-line">
          ${timeLabel}
          <span class="task-title-text">${escapeHtml(task.title)}</span>
        </div>
        ${task.desc ? `<div class="task-desc-preview">${escapeHtml(task.desc)}</div>` : ''}
      </div>

      <div class="task-actions">
        <button class="btn-icon btn-edit-task" type="button" title="Sửa công khóa" aria-label="Sửa">[SỬA]</button>
        <button class="btn-icon btn-del-task" type="button" title="Hủy công khóa" aria-label="Xóa">[XÓA]</button>
      </div>
    `;

    const chk = taskItem.querySelector('.task-checkbox');
    chk.addEventListener('change', (e) => {
      task.done = e.target.checked;
      saveTasksForDate(activeDateStr, tasks);
      renderTaskList();
      showTaskDetail(task);
    });

    const btnEdit = taskItem.querySelector('.btn-edit-task');
    btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      editingTaskId = task.id;
      renderTaskList();
    });

    const btnDel = taskItem.querySelector('.btn-del-task');
    btnDel.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Bạn có chắc muốn xóa công khóa: "${task.title}"?`)) {
        const remaining = tasks.filter(t => t.id !== task.id);
        saveTasksForDate(activeDateStr, remaining);
        renderTaskList();
        resetTaskDetailPanel();
      }
    });

    taskItem.addEventListener('mouseenter', () => showTaskDetail(task));
    taskItem.addEventListener('click', () => showTaskDetail(task));
    taskItem.addEventListener('focus', () => showTaskDetail(task));

    taskListContainer.appendChild(taskItem);
  });

  taskListContainer.addEventListener('mouseleave', () => {
    if (!document.activeElement || !document.activeElement.closest('.task-item')) {
      resetTaskDetailPanel();
    }
  }, { once: true });
}

/**
 * Thêm một công khóa mới vào ngày hiện tại
 */
function handleAddTask(e) {
  if (e) e.preventDefault();
  if (!activeDateStr) return;

  const title = inputTaskTitle ? inputTaskTitle.value.trim() : '';
  if (!title) {
    alert('Vui lòng nhập tên công khóa tu hành!');
    if (inputTaskTitle) inputTaskTitle.focus();
    return;
  }

  const start = inputTaskStart ? inputTaskStart.value : '';
  const end = inputTaskEnd ? inputTaskEnd.value : '';
  const desc = inputTaskDesc ? inputTaskDesc.value.trim() : '';

  const newTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title,
    start,
    end,
    desc,
    done: false,
    createdAt: new Date().toISOString(),
  };

  const tasks = getTasksForDate(activeDateStr);
  tasks.push(newTask);
  saveTasksForDate(activeDateStr, tasks);

  inputTaskTitle.value = '';
  if (inputTaskStart) inputTaskStart.value = '';
  if (inputTaskEnd) inputTaskEnd.value = '';
  if (inputTaskDesc) inputTaskDesc.value = '';
  inputTaskTitle.focus();

  renderTaskList();
  showTaskDetail(newTask);
}

/**
 * Sắp xếp danh sách công khóa theo giờ
 */
function handleSortTasks() {
  if (!activeDateStr) return;
  const tasks = getTasksForDate(activeDateStr);
  if (tasks.length <= 1) return;

  tasks.sort((a, b) => {
    if (!a.start && !b.start) return 0;
    if (!a.start) return 1;
    if (!b.start) return -1;
    return a.start.localeCompare(b.start);
  });

  saveTasksForDate(activeDateStr, tasks);
  renderTaskList();
}

/**
 * Đổi ngẫu nhiên câu thơ khác
 */
function handleChangePoem() {
  const currentIndex = currentPoemState ? currentPoemState.index : -1;
  currentPoemState = getRandomPoem(currentIndex);
  renderPoem(currentPoemState.poem);
}

/**
 * Khởi tạo các sự kiện lắng nghe của Modal
 */
export function initTodoModal() {
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', handleAddTask);
  }

  if (inputTaskTitle) {
    inputTaskTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTask();
      }
    });
  }

  if (btnSortTime) {
    btnSortTime.addEventListener('click', handleSortTasks);
  }

  if (btnChangePoem) {
    btnChangePoem.addEventListener('click', handleChangePoem);
  }

  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeDayModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeDayModal();
      }
    });
  }

  window.addEventListener('todo:data-changed', () => {
    if (activeDateStr && modalBackdrop.classList.contains('active')) {
      renderTaskList();
    }
  });
}
