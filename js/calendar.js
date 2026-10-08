/**
 * js/calendar.js
 * Quản lý giao diện Lịch Tháng phong cách Kính Mờ Bo Tròn (Glassmorphism):
 * - Bắt đầu tuần từ Thứ Hai (T2 ... CN).
 * - Tiêu đề định dạng "Tháng MM / YYYY".
 * - Nút Tháng trước, Tháng sau, nút "Hôm nay" bo tròn trong suốt.
 * - Đánh dấu nổi bật ngày hôm nay với hiệu ứng ánh linh khí thở chậm, nhãn "Hôm nay".
 * - Hiển thị con dấu tu tiên cho ngày đạt >50% và chấm chu sa cho ngày chưa đạt.
 * - Mở hộp thoại công khóa khi bấm vào ngày (tự động chuyển nền sang ảnh ngày).
 */

import { getLocalTodayStr, escapeHtml } from './config.js';
import { loadData } from './storage.js';
import { getDayStats } from './streak.js';
import { openDayModal } from './todo.js';

let currentYear;
let currentMonth; // 0 = Tháng 1, 11 = Tháng 12

const calendarTitle = document.getElementById('calendar-title');
const calendarGrid = document.getElementById('calendar-grid');
const btnPrevMonth = document.getElementById('btn-prev-month');
const btnNextMonth = document.getElementById('btn-next-month');
const btnToday = document.getElementById('btn-today');

/**
 * Khởi tạo tháng và năm dựa trên giờ Việt Nam
 */
function initCurrentDate() {
  const todayStr = getLocalTodayStr();
  const [y, m] = todayStr.split('-').map(Number);
  currentYear = y;
  currentMonth = m - 1;
}

/**
 * Chuyển đổi định dạng ngày YYYY-MM-DD
 * @param {number} y 
 * @param {number} m 1-12
 * @param {number} d 1-31
 * @returns {string} YYYY-MM-DD
 */
function formatDateKey(y, m, d) {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

/**
 * Render toàn bộ khung lưới lịch tháng
 */
export function renderCalendar() {
  if (!calendarGrid || !calendarTitle) return;

  const todayStr = getLocalTodayStr();
  const allData = loadData();
  const tasksMap = allData.tasks || {};

  // Cập nhật tiêu đề tháng
  calendarTitle.textContent = `Tháng ${(currentMonth + 1).toString().padStart(2, '0')} / ${currentYear}`;

  // Tính ngày đầu tiên của tháng (tuần bắt đầu từ Thứ Hai: 0 = T2, 6 = CN)
  const firstDayObj = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = (firstDayObj.getDay() + 6) % 7;

  // Tổng số ngày trong tháng hiện tại
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Số ngày của tháng trước
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  calendarGrid.innerHTML = '';

  // 1. Các ngày của tháng trước
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateKey = formatDateKey(prevYear, prevMonthIdx + 1, dayNum);

    const cell = createCalendarCell({
      dayNum,
      dateKey,
      isCurrentMonth: false,
      isToday: dateKey === todayStr,
      tasks: tasksMap[dateKey] || [],
    });
    calendarGrid.appendChild(cell);
  }

  // 2. Các ngày trong tháng hiện tại
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(currentYear, currentMonth + 1, day);
    const isToday = dateKey === todayStr;
    const tasks = tasksMap[dateKey] || [];

    const cell = createCalendarCell({
      dayNum: day,
      dateKey,
      isCurrentMonth: true,
      isToday,
      tasks,
    });
    calendarGrid.appendChild(cell);
  }

  // 3. Các ngày của tháng sau
  const totalCellsSoFar = firstDayOfWeek + daysInMonth;
  const remainingCells = (totalCellsSoFar % 7 === 0) ? 0 : 7 - (totalCellsSoFar % 7);

  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateKey = formatDateKey(nextYear, nextMonthIdx + 1, day);

    const cell = createCalendarCell({
      dayNum: day,
      dateKey,
      isCurrentMonth: false,
      isToday: dateKey === todayStr,
      tasks: tasksMap[dateKey] || [],
    });
    calendarGrid.appendChild(cell);
  }
}

/**
 * Tạo một phần tử ô ngày trong lịch kính mờ
 */
function createCalendarCell({ dayNum, dateKey, isCurrentMonth, isToday, tasks }) {
  const stats = getDayStats(tasks);
  const cell = document.createElement('div');

  const classes = ['calendar-day', 'glass-cell'];
  if (!isCurrentMonth) classes.push('other-month');
  if (isToday) classes.push('is-today');

  if (stats.total > 0) {
    if (stats.achieved) {
      classes.push('day-achieved'); // Đạt >50% (xanh ngọc + con dấu)
    } else {
      classes.push('day-failed');   // Chưa đạt (chấm chu sa)
    }
  } else {
    classes.push('day-empty');
  }

  cell.className = classes.join(' ');
  cell.setAttribute('data-date', dateKey);
  cell.setAttribute('tabindex', '0');
  cell.setAttribute('role', 'button');
  cell.setAttribute(
    'aria-label',
    `Ngày ${dateKey}${isToday ? ' (Hôm nay)' : ''}: ${stats.done}/${stats.total} công khóa hoàn thành`
  );

  let taskBadgeHtml = '';
  if (stats.total > 0) {
    if (stats.achieved) {
      taskBadgeHtml = `
        <div class="day-stats-pill pill-achieved">
          <span class="pill-seal">☯</span>
          <span class="pill-num">${stats.done}/${stats.total}</span>
        </div>
      `;
    } else {
      taskBadgeHtml = `
        <div class="day-stats-pill pill-failed">
          <span class="pill-cinnabar">●</span>
          <span class="pill-num">${stats.done}/${stats.total}</span>
        </div>
      `;
    }
  }

  cell.innerHTML = `
    <div class="day-header">
      <span class="day-number">${dayNum}</span>
      ${isToday ? '<span class="today-marker font-calligraphy">Hôm nay</span>' : ''}
    </div>
    <div class="day-body">
      ${taskBadgeHtml}
    </div>
  `;

  const handleOpen = () => openDayModal(dateKey);
  cell.addEventListener('click', handleOpen);
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  });

  return cell;
}

/**
 * Khởi tạo bộ điều khiển Lịch Tháng
 */
export function initCalendar() {
  initCurrentDate();

  if (btnPrevMonth) {
    btnPrevMonth.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }

  if (btnNextMonth) {
    btnNextMonth.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }

  if (btnToday) {
    btnToday.addEventListener('click', () => {
      initCurrentDate();
      renderCalendar();
    });
  }

  window.addEventListener('todo:data-changed', () => {
    renderCalendar();
  });

  renderCalendar();
}
