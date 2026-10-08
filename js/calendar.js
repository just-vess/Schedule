/**
 * js/calendar.js
 * Quản lý giao diện Lịch Tháng:
 * - Bắt đầu tuần từ Thứ Hai (T2 ... CN).
 * - Tiêu đề định dạng "Tháng MM / YYYY".
 * - Nút Tháng trước, Tháng sau, nút "Hôm nay".
 * - Đánh dấu nổi bật ngày hôm nay theo giờ địa phương (Asia/Ho_Chi_Minh).
 * - Hiển thị chấm / con số hoàn thành "đã xong / tổng" và đổi màu theo trạng thái đạt >50%.
 * - Bấm vào ô ngày mở Modal chi tiết.
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
 * Chuyển đổi định dạng ngày YYYY-MM-DD an toàn
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

  // Cập nhật tiêu đề: "Tháng MM / YYYY"
  calendarTitle.textContent = `Tháng ${(currentMonth + 1).toString().padStart(2, '0')} / ${currentYear}`;

  // Tính ngày đầu tiên của tháng (tuần bắt đầu từ Thứ Hai: 0 = T2, 6 = CN)
  const firstDayObj = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = (firstDayObj.getDay() + 6) % 7;

  // Tổng số ngày trong tháng hiện tại (xử lý chính xác năm nhuận và các tháng 28, 29, 30, 31 ngày)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Số ngày của tháng trước (để điền các ô mờ)
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  calendarGrid.innerHTML = '';

  // 1. Các ngày của tháng trước (Padding đầu tháng)
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

  // 3. Các ngày của tháng sau (Padding cuối tháng để lưới luôn cân đối 35 hoặc 42 ô)
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
 * Tạo một phần tử ô ngày trong lịch
 */
function createCalendarCell({ dayNum, dateKey, isCurrentMonth, isToday, tasks }) {
  const stats = getDayStats(tasks);
  const cell = document.createElement('div');

  const classes = ['calendar-day'];
  if (!isCurrentMonth) classes.push('other-month');
  if (isToday) classes.push('is-today');

  if (stats.total > 0) {
    if (stats.achieved) {
      classes.push('day-achieved'); // Đạt >50% (xanh lá)
    } else {
      classes.push('day-failed');   // Chưa đạt <=50% (hổ phách/cam)
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
    `Ngày ${dateKey}${isToday ? ' (Hôm nay)' : ''}: ${stats.done}/${stats.total} việc đã xong`
  );

  let taskBadgeHtml = '';
  if (stats.total > 0) {
    taskBadgeHtml = `
      <div class="day-stats-pill ${stats.achieved ? 'pill-achieved' : 'pill-failed'}">
        <span class="pill-dot">●</span> ${stats.done}/${stats.total}
      </div>
    `;
  }

  cell.innerHTML = `
    <div class="day-header">
      <span class="day-number">${dayNum}</span>
      ${isToday ? '<span class="today-marker" title="Hôm nay">[H.NAY]</span>' : ''}
    </div>
    <div class="day-body">
      ${taskBadgeHtml}
    </div>
  `;

  // Bấm vào ô mở Modal nhiệm vụ của ngày đó
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

  // Khi dữ liệu thay đổi từ bất kỳ đâu (thêm task, xóa task, nhập backup), render lại lịch
  window.addEventListener('todo:data-changed', () => {
    renderCalendar();
  });

  renderCalendar();
}
