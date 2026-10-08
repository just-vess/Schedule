/**
 * js/todo.js
 * Quản lý Todo List cho từng ngày trong Modal chi tiết ngày:
 * - 3 vùng: Danh sách Task (Trái), Thơ cổ điển (Phải trên), Chi tiết Task (Phải dưới).
 * - Thêm, sửa, xóa, tích chọn hoàn thành, sắp xếp theo thời gian.
 * - Thanh tiến độ và trạng thái đạt chuỗi (>50%).
 * - Trạng thái trống với slot ảnh emptyState và ASCII fallback.
 * - Tương tác hover (desktop) và click (mobile) để xem chi tiết task.
 */

import { escapeHtml, createAssetElement } from './config.js';
import { getTasksForDate, saveTasksForDate } from './storage.js';
import { isDayAchieved, getDayStats } from './streak.js';
import { getPoemForDate, getRandomPoem } from './poems.js';

let activeDateStr = null;
let currentPoemState = null;
let editingTaskId = null;

// Tham chiếu phần tử DOM trong Modal
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

  // Hiển thị tiêu đề ngày
  if (modalDateTitle) {
    modalDateTitle.textContent = `${dateStr} [${formatVietnameseDate(dateStr)}]`;
  }

  // Tải câu thơ theo ngày
  currentPoemState = getPoemForDate(dateStr);
  renderPoem(currentPoemState.poem);

  // Hiển thị danh sách task
  renderTaskList();

  // Reset panel chi tiết về trạng thái chờ
  resetTaskDetailPanel();

  // Mở modal
  modalBackdrop.classList.add('active');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Focus vào ô nhập tiêu đề task để tiện thao tác bàn phím
  setTimeout(() => {
    if (inputTaskTitle) inputTaskTitle.focus();
  }, 100);
}

/**
 * Đóng Modal
 */
export function closeDayModal() {
  if (!modalBackdrop.classList.contains('active')) return;
  modalBackdrop.classList.remove('active');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeDateStr = null;
  editingTaskId = null;
}

/**
 * Hiển thị câu thơ lên vùng góc phải trên
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
 * Hiển thị chi tiết của một task lên góc phải dưới
 * @param {object} task 
 */
function showTaskDetail(task) {
  if (!taskDetailPanel) return;

  const timeRange = (task.start || task.end)
    ? `${task.start || '--:--'} → ${task.end || '--:--'}`
    : 'Không ấn định giờ';

  const statusText = task.done
    ? '<span class="status-badge badge-done">[✓ ĐÃ HOÀN THÀNH]</span>'
    : '<span class="status-badge badge-pending">[• ĐANG CHỜ LÀM]</span>';

  taskDetailPanel.innerHTML = `
    <div class="task-detail-content">
      <div class="detail-header">
        <span class="prompt-prefix">&gt;</span> <strong>CHI TIẾT NHIỆM VỤ</strong>
        <div class="detail-status">${statusText}</div>
      </div>
      <div class="detail-row">
        <span class="detail-label">TIÊU ĐỀ:</span>
        <span class="detail-val detail-title">${escapeHtml(task.title)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">KHUNG GIỜ:</span>
        <span class="detail-val text-accent">${escapeHtml(timeRange)}</span>
      </div>
      <div class="detail-row detail-desc-block">
        <span class="detail-label">MÔ TẢ CHI TIẾT:</span>
        <div class="detail-val desc-box">${task.desc ? escapeHtml(task.desc) : '<em class="text-muted">(Không có mô tả bổ sung)</em>'}</div>
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
      <span class="prompt-prefix">&gt;</span> Di chuột (hoặc chạm trên mobile) vào một nhiệm vụ ở bên trái để xem chi tiết tại đây.
    </div>
  `;
}

/**
 * Render danh sách Task và tiến độ hoàn thành
 */
function renderTaskList() {
  if (!activeDateStr || !taskListContainer) return;

  const tasks = getTasksForDate(activeDateStr);
  const stats = getDayStats(tasks);

  // Cập nhật thông số tiến độ
  if (modalTaskCount) {
    modalTaskCount.textContent = `${stats.done}/${stats.total} task (${stats.percent}%)`;
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
      modalStreakBadge.textContent = '[• Chưa có nhiệm vụ]';
    } else if (stats.achieved) {
      modalStreakBadge.className = 'streak-badge badge-achieved';
      modalStreakBadge.textContent = '[✓ ĐÃ ĐẠT CHUỖI >50%]';
    } else {
      modalStreakBadge.className = 'streak-badge badge-failed';
      modalStreakBadge.textContent = '[! CHƯA ĐẠT CHUỖI (≤50%)]';
    }
  }

  // Nếu danh sách trống, hiển thị emptyState an toàn
  if (tasks.length === 0) {
    taskListContainer.innerHTML = '';
    const emptySlot = createAssetElement('emptyState', 'Chưa có task', 'todo-empty-state');
    taskListContainer.appendChild(emptySlot);
    return;
  }

  // Render danh sách task
  taskListContainer.innerHTML = '';
  tasks.forEach((task, idx) => {
    const isEditing = editingTaskId === task.id;
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.done ? 'is-done' : ''} ${isEditing ? 'is-editing' : ''}`;
    taskItem.setAttribute('data-id', task.id);
    taskItem.setAttribute('tabindex', '0');

    if (isEditing) {
      // Chế độ chỉnh sửa inline
      taskItem.innerHTML = `
        <div class="task-edit-box">
          <div class="edit-row">
            <span class="prompt-prefix">&gt;</span>
            <input type="text" class="edit-input-title" value="${escapeHtml(task.title)}" placeholder="Tiêu đề task" />
          </div>
          <div class="edit-row edit-times">
            <span>Giờ:</span>
            <input type="time" class="edit-input-start" value="${escapeHtml(task.start || '')}" />
            <span>→</span>
            <input type="time" class="edit-input-end" value="${escapeHtml(task.end || '')}" />
          </div>
          <div class="edit-row">
            <input type="text" class="edit-input-desc" value="${escapeHtml(task.desc || '')}" placeholder="Mô tả..." />
          </div>
          <div class="edit-actions">
            <button class="btn-terminal btn-save-edit" type="button">[LƯU]</button>
            <button class="btn-terminal btn-cancel-edit" type="button">[HỦY]</button>
          </div>
        </div>
      `;

      // Bắt sự kiện Lưu / Hủy
      const btnSave = taskItem.querySelector('.btn-save-edit');
      const btnCancel = taskItem.querySelector('.btn-cancel-edit');
      const inTitle = taskItem.querySelector('.edit-input-title');
      const inStart = taskItem.querySelector('.edit-input-start');
      const inEnd = taskItem.querySelector('.edit-input-end');
      const inDesc = taskItem.querySelector('.edit-input-desc');

      btnSave.addEventListener('click', () => {
        const newTitle = inTitle.value.trim();
        if (!newTitle) {
          alert('Tiêu đề nhiệm vụ không được để trống!');
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

    // Chế độ hiển thị bình thường
    const timeLabel = (task.start || task.end)
      ? `<span class="task-time-pill">[${escapeHtml(task.start || '--:--')}${task.end ? ' - ' + escapeHtml(task.end) : ''}]</span>`
      : '';

    taskItem.innerHTML = `
      <div class="task-checkbox-wrap">
        <input type="checkbox" class="task-checkbox" id="chk-${task.id}" ${task.done ? 'checked' : ''} aria-label="Đánh dấu hoàn thành ${escapeHtml(task.title)}" />
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
        <button class="btn-icon btn-edit-task" type="button" title="Sửa nhiệm vụ" aria-label="Sửa nhiệm vụ">[SỬA]</button>
        <button class="btn-icon btn-del-task" type="button" title="Xóa nhiệm vụ" aria-label="Xóa nhiệm vụ">[XÓA]</button>
      </div>
    `;

    // Sự kiện checkbox toggle
    const chk = taskItem.querySelector('.task-checkbox');
    chk.addEventListener('change', (e) => {
      task.done = e.target.checked;
      saveTasksForDate(activeDateStr, tasks);
      renderTaskList();
      showTaskDetail(task);
    });

    // Sự kiện Sửa
    const btnEdit = taskItem.querySelector('.btn-edit-task');
    btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      editingTaskId = task.id;
      renderTaskList();
    });

    // Sự kiện Xóa
    const btnDel = taskItem.querySelector('.btn-del-task');
    btnDel.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Bạn có chắc muốn xóa nhiệm vụ: "${task.title}"?`)) {
        const remaining = tasks.filter(t => t.id !== task.id);
        saveTasksForDate(activeDateStr, remaining);
        renderTaskList();
        resetTaskDetailPanel();
      }
    });

    // Sự kiện di chuột (hover) trên desktop & bấm (click) trên mobile để xem chi tiết
    taskItem.addEventListener('mouseenter', () => showTaskDetail(task));
    taskItem.addEventListener('click', () => showTaskDetail(task));
    taskItem.addEventListener('focus', () => showTaskDetail(task));

    taskListContainer.appendChild(taskItem);
  });

  // Khi rời chuột khỏi danh sách thì khôi phục lại panel chi tiết
  taskListContainer.addEventListener('mouseleave', () => {
    // Chỉ reset nếu không có task nào đang được focus
    if (!document.activeElement || !document.activeElement.closest('.task-item')) {
      resetTaskDetailPanel();
    }
  }, { once: true });
}

/**
 * Thêm một task mới vào ngày hiện tại
 */
function handleAddTask(e) {
  if (e) e.preventDefault();
  if (!activeDateStr) return;

  const title = inputTaskTitle ? inputTaskTitle.value.trim() : '';
  if (!title) {
    alert('Vui lòng nhập tiêu đề nhiệm vụ!');
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

  // Xóa trắng form nhập
  inputTaskTitle.value = '';
  if (inputTaskStart) inputTaskStart.value = '';
  if (inputTaskEnd) inputTaskEnd.value = '';
  if (inputTaskDesc) inputTaskDesc.value = '';
  inputTaskTitle.focus();

  renderTaskList();
  showTaskDetail(newTask);
}

/**
 * Sắp xếp danh sách task theo giờ bắt đầu
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
  // Submit form thêm task
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', handleAddTask);
  }

  // Hỗ trợ nhấn Enter trong ô input tiêu đề để thêm ngay
  if (inputTaskTitle) {
    inputTaskTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTask();
      }
    });
  }

  // Nút sắp xếp theo giờ
  if (btnSortTime) {
    btnSortTime.addEventListener('click', handleSortTasks);
  }

  // Nút đổi thơ ngẫu nhiên
  if (btnChangePoem) {
    btnChangePoem.addEventListener('click', handleChangePoem);
  }

  // Nút đóng modal (X)
  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeDayModal);
  }

  // Bấm ra ngoài vùng nền modal để đóng
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeDayModal();
      }
    });
  }

  // Lắng nghe sự kiện lưu dữ liệu từ các nơi khác để cập nhật lại nếu đang mở modal
  window.addEventListener('todo:data-changed', () => {
    if (activeDateStr && modalBackdrop.classList.contains('active')) {
      renderTaskList();
    }
  });
}
