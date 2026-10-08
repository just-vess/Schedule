/**
 * js/storage.js
 * Quản lý lưu trữ localStorage, kiểm tra phiên bản dữ liệu (data migration),
 * cùng cơ chế Xuất / Nhập tệp tin JSON dự phòng (backup/restore).
 */

import { CONFIG, getLocalTodayStr } from './config.js';

const CURRENT_VERSION = 1;

/**
 * Cấu trúc dữ liệu mặc định khi khởi tạo lần đầu
 */
function getDefaultData() {
  return {
    version: CURRENT_VERSION,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    tasks: {},   // { "YYYY-MM-DD": [ { id, title, start, end, desc, done } ] }
    goals: [],   // [ { id, title, desc, deadline, done } ]
    journal: {}, // { "YYYY-MM-DD": "nội dung nhật ký" }
  };
}

/**
 * Đọc toàn bộ dữ liệu từ localStorage, tự động sửa lỗi và migrate phiên bản nếu cần.
 * @returns {object}
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) {
      const initialData = getDefaultData();
      saveData(initialData);
      return initialData;
    }

    const parsed = JSON.parse(raw);

    // Kiểm tra và migrate nếu phiên bản cũ hơn
    if (!parsed.version || parsed.version < CURRENT_VERSION) {
      // Logic migrate sau này nếu nâng cấp lên version 2+
      parsed.version = CURRENT_VERSION;
    }

    // Đảm bảo các thuộc tính mảng/object luôn tồn tại
    if (typeof parsed.tasks !== 'object' || parsed.tasks === null) parsed.tasks = {};
    if (!Array.isArray(parsed.goals)) parsed.goals = [];
    if (typeof parsed.journal !== 'object' || parsed.journal === null) parsed.journal = {};

    return parsed;
  } catch (err) {
    console.error('[STORAGE] Lỗi phân tích JSON từ localStorage:', err);
    // Nếu dữ liệu bị hỏng, tạo bản dự phòng trong bộ nhớ tạm để không bị sập app
    return getDefaultData();
  }
}

/**
 * Lưu toàn bộ dữ liệu vào localStorage, bắn sự kiện cập nhật để các view lắng nghe.
 * @param {object} data
 * @returns {boolean} Thành công hay thất bại
 */
export function saveData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    const serialized = JSON.stringify(data);
    localStorage.setItem(CONFIG.STORAGE_KEY, serialized);

    // Phát sự kiện toàn cục để UI tự động cập nhật
    window.dispatchEvent(new CustomEvent('todo:data-changed', { detail: { data } }));
    return true;
  } catch (err) {
    console.error('[STORAGE] Không thể lưu vào localStorage (có thể vượt dung lượng):', err);
    if (err.name === 'QuotaExceededError') {
      alert('CẢNH BÁO TERMINAL: Bộ nhớ localStorage đã đầy! Vui lòng Xuất file JSON và dọn dẹp bớt dữ liệu cũ.');
    }
    return false;
  }
}

// -------------------------------------------------------------
// CÁC HÀM TIỆN ÍCH DÀNH CHO TASKS (NHIỆM VỤ)
// -------------------------------------------------------------

export function getTasksForDate(dateStr) {
  const data = loadData();
  return Array.isArray(data.tasks[dateStr]) ? data.tasks[dateStr] : [];
}

export function saveTasksForDate(dateStr, tasksList) {
  const data = loadData();
  data.tasks[dateStr] = tasksList;
  saveData(data);
}

// -------------------------------------------------------------
// CÁC HÀM TIỆN ÍCH DÀNH CHO GOALS (MỤC TIÊU)
// -------------------------------------------------------------

export function getGoals() {
  const data = loadData();
  return Array.isArray(data.goals) ? data.goals : [];
}

export function saveGoals(goalsList) {
  const data = loadData();
  data.goals = goalsList;
  saveData(data);
}

// -------------------------------------------------------------
// CÁC HÀM TIỆN ÍCH DÀNH CHO JOURNAL (NHẬT KÝ)
// -------------------------------------------------------------

export function getJournalForDate(dateStr) {
  const data = loadData();
  return data.journal[dateStr] || '';
}

export function saveJournalForDate(dateStr, content) {
  const data = loadData();
  if (!content || !content.trim()) {
    delete data.journal[dateStr];
  } else {
    data.journal[dateStr] = content;
  }
  saveData(data);
}

export function getAllJournals() {
  const data = loadData();
  return data.journal || {};
}

// -------------------------------------------------------------
// XUẤT VÀ NHẬP DỮ LIỆU JSON (BACKUP / RESTORE)
// -------------------------------------------------------------

/**
 * Xuất dữ liệu ra file JSON tải về máy người dùng
 */
export function exportBackup() {
  const data = loadData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const today = getLocalTodayStr();

  const a = document.createElement('a');
  a.href = url;
  a.download = `todo-terminal-backup-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Nhập dữ liệu từ chuỗi JSON hoặc file người dùng tải lên
 * @param {string} jsonString
 * @param {boolean} [merge=false] Gộp hay ghi đè hoàn toàn
 * @returns {{ success: boolean, message: string }}
 */
export function importBackup(jsonString, merge = false) {
  try {
    const imported = JSON.parse(jsonString);

    // Kiểm tra cấu trúc tối thiểu hợp lệ
    if (typeof imported !== 'object' || imported === null) {
      throw new Error('Dữ liệu không phải là đối tượng JSON hợp lệ.');
    }

    const current = loadData();

    if (merge) {
      // Gộp tasks
      const mergedTasks = { ...current.tasks };
      if (imported.tasks && typeof imported.tasks === 'object') {
        for (const [date, list] of Object.entries(imported.tasks)) {
          if (Array.isArray(list)) {
            const existing = mergedTasks[date] || [];
            // Tránh trùng ID
            const existingIds = new Set(existing.map(t => t.id));
            const newItems = list.filter(t => !existingIds.has(t.id));
            mergedTasks[date] = [...existing, ...newItems];
          }
        }
      }

      // Gộp goals
      const existingGoalIds = new Set(current.goals.map(g => g.id));
      const newGoals = (imported.goals || []).filter(g => !existingGoalIds.has(g.id));
      const mergedGoals = [...current.goals, ...newGoals];

      // Gộp nhật ký
      const mergedJournal = { ...current.journal, ...(imported.journal || {}) };

      current.tasks = mergedTasks;
      current.goals = mergedGoals;
      current.journal = mergedJournal;
      saveData(current);
      return { success: true, message: 'Đã gộp dữ liệu thành công!' };
    } else {
      // Ghi đè toàn bộ
      const finalData = {
        version: CURRENT_VERSION,
        createdAt: imported.createdAt || current.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        tasks: (imported.tasks && typeof imported.tasks === 'object') ? imported.tasks : {},
        goals: Array.isArray(imported.goals) ? imported.goals : [],
        journal: (imported.journal && typeof imported.journal === 'object') ? imported.journal : {},
      };
      saveData(finalData);
      return { success: true, message: 'Đã khôi phục dữ liệu từ file backup thành công!' };
    }
  } catch (err) {
    console.error('[STORAGE] Lỗi nhập file JSON:', err);
    return { success: false, message: `Lỗi nhập dữ liệu: ${err.message}` };
  }
}
