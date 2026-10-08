/**
 * js/streak.js
 * Tính toán chuỗi liên tiếp (Streak) và lưới nhiệt (Heatmap) 30 ngày gần nhất.
 * 
 * QUY TẮC:
 * - Một ngày được tính là "đạt" khi:
 *   số task hoàn thành / tổng số task > 50% (lớn hơn hẳn 50%, và ngày có ít nhất 1 task).
 * - Chuỗi hiện tại:
 *   Số ngày đạt liên tiếp tính đến hôm nay. Nếu hôm nay chưa đạt thì vẫn tính chuỗi
 *   đến hết hôm qua (không bị reset về 0 giữa ngày khi chưa hoàn thành task).
 */

import { getLocalTodayStr, escapeHtml } from './config.js';

/**
 * Trừ 1 ngày từ chuỗi YYYY-MM-DD
 * @param {string} dateStr 
 * @returns {string} YYYY-MM-DD
 */
export function getPreviousDayStr(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Cộng 1 ngày từ chuỗi YYYY-MM-DD
 * @param {string} dateStr 
 * @returns {string} YYYY-MM-DD
 */
export function getNextDayStr(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Kiểm tra xem một danh sách task trong ngày có đạt tiêu chí chuỗi (> 50%) hay không
 * @param {Array} tasksList
 * @returns {boolean}
 */
export function isDayAchieved(tasksList) {
  if (!Array.isArray(tasksList) || tasksList.length === 0) return false;
  const done = tasksList.filter(t => t.done).length;
  const total = tasksList.length;
  return total > 0 && (done / total) > 0.5;
}

/**
 * Thống kê chi tiết một ngày
 * @param {Array} tasksList
 * @returns {{ total: number, done: number, percent: number, achieved: boolean, status: 'achieved'|'failed'|'none' }}
 */
export function getDayStats(tasksList) {
  if (!Array.isArray(tasksList) || tasksList.length === 0) {
    return { total: 0, done: 0, percent: 0, achieved: false, status: 'none' };
  }
  const done = tasksList.filter(t => t.done).length;
  const total = tasksList.length;
  const achieved = (done / total) > 0.5;
  const percent = Math.round((done / total) * 100);
  return {
    total,
    done,
    percent,
    achieved,
    status: achieved ? 'achieved' : 'failed',
  };
}

/**
 * Tính toán chuỗi hiện tại và chuỗi dài nhất trong lịch sử
 * @param {object} allTasks { "YYYY-MM-DD": [ ... ] }
 * @param {string} [todayStr=getLocalTodayStr()]
 * @returns {{ currentStreak: number, longestStreak: number, todayAchieved: boolean }}
 */
export function calcStreaks(allTasks, todayStr = getLocalTodayStr()) {
  const todayTasks = allTasks[todayStr] || [];
  const todayAchieved = isDayAchieved(todayTasks);

  // 1. Tính chuỗi hiện tại:
  let currentStreak = 0;
  let checkDate = todayStr;

  if (todayAchieved) {
    currentStreak = 1;
    checkDate = getPreviousDayStr(todayStr);
    while (true) {
      const list = allTasks[checkDate] || [];
      if (isDayAchieved(list)) {
        currentStreak++;
        checkDate = getPreviousDayStr(checkDate);
      } else {
        break;
      }
    }
  } else {
    // Nếu hôm nay chưa đạt: tính chuỗi liên tiếp đến hết ngày hôm qua
    checkDate = getPreviousDayStr(todayStr);
    while (true) {
      const list = allTasks[checkDate] || [];
      if (isDayAchieved(list)) {
        currentStreak++;
        checkDate = getPreviousDayStr(checkDate);
      } else {
        break;
      }
    }
  }

  // 2. Tính chuỗi dài nhất trong lịch sử:
  // Thu thập mọi ngày có ghi nhận task và đạt chuỗi
  const allRecordedDates = Object.keys(allTasks).filter(d => Array.isArray(allTasks[d]) && allTasks[d].length > 0);
  if (allRecordedDates.length === 0) {
    return { currentStreak, longestStreak: currentStreak, todayAchieved };
  }

  allRecordedDates.sort(); // Sắp xếp tăng dần theo thời gian
  const earliestDate = allRecordedDates[0];
  let longestStreak = currentStreak;
  let tempStreak = 0;
  let iterDate = earliestDate;

  // Quét từ ngày sớm nhất đến hôm nay
  while (iterDate <= todayStr) {
    const list = allTasks[iterDate] || [];
    if (isDayAchieved(list)) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    iterDate = getNextDayStr(iterDate);
  }

  return { currentStreak, longestStreak, todayAchieved };
}

/**
 * Lấy dữ liệu Heatmap 30 ngày gần nhất (tính đến hôm nay)
 * @param {object} allTasks
 * @param {string} [todayStr=getLocalTodayStr()]
 * @param {number} [days=30]
 * @returns {Array<object>}
 */
export function getHeatmap30Days(allTasks, todayStr = getLocalTodayStr(), days = 30) {
  const result = [];
  let curr = todayStr;

  for (let i = 0; i < days; i++) {
    const tasks = allTasks[curr] || [];
    const stats = getDayStats(tasks);
    result.unshift({
      dateStr: curr,
      ...stats,
    });
    curr = getPreviousDayStr(curr);
  }

  return result;
}

/**
 * Render giao diện thẻ Streak và Heatmap vào một container HTML
 * @param {HTMLElement} container
 * @param {object} allTasks
 * @param {function} [onSelectDate=null]
 */
export function renderStreakWidget(container, allTasks, onSelectDate = null) {
  const todayStr = getLocalTodayStr();
  const { currentStreak, longestStreak, todayAchieved } = calcStreaks(allTasks, todayStr);
  const heatmapData = getHeatmap30Days(allTasks, todayStr, 30);

  container.innerHTML = `
    <div class="streak-widget terminal-box">
      <div class="streak-header">
        <span class="prompt-prefix">&gt;</span> BẢNG ĐO THÀNH TÍCH (CHUỖI LIÊN TỤC)
      </div>

      <div class="streak-stats-row">
        <div class="streak-card card-current">
          <div class="streak-label">CHUỖI HIỆN TẠI</div>
          <div class="streak-value ${currentStreak > 0 ? 'text-highlight' : ''}">${currentStreak} <span class="unit">ngày</span></div>
          <div class="streak-sub">
            ${todayAchieved 
              ? '<span class="tag-success">[✓ Hôm nay: ĐÃ ĐẠT &gt;50%]</span>' 
              : '<span class="tag-pending">[• Hôm nay: Chưa đạt &gt;50%]</span>'}
          </div>
        </div>

        <div class="streak-card card-longest">
          <div class="streak-label">CHUỖI DÀI NHẤT</div>
          <div class="streak-value text-accent">${longestStreak} <span class="unit">ngày</span></div>
          <div class="streak-sub text-muted">Kỷ lục lịch sử</div>
        </div>
      </div>

      <div class="heatmap-section">
        <div class="heatmap-title">
          <span class="prompt-prefix">&gt;</span> NHẬT TRÌNH 30 NGÀY QUA:
        </div>

        <div class="heatmap-grid" role="grid" aria-label="Lưới hoạt động 30 ngày qua">
          ${heatmapData.map(item => {
            const isToday = item.dateStr === todayStr;
            const tooltip = `${item.dateStr}: ${item.done}/${item.total} task (${item.percent}%) - ${
              item.status === 'achieved' ? 'Đạt' : item.status === 'failed' ? 'Chưa đạt' : 'Không có task'
            }`;
            return `
              <div class="heatmap-cell status-${item.status} ${isToday ? 'cell-today' : ''}" 
                   data-date="${escapeHtml(item.dateStr)}" 
                   title="${escapeHtml(tooltip)}" 
                   role="gridcell" 
                   tabindex="0"
                   aria-label="${escapeHtml(tooltip)}">
                <span class="cell-date-num">${item.dateStr.slice(8)}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="heatmap-legend">
          <span class="legend-item"><span class="legend-box status-achieved"></span> &gt;50% Đạt</span>
          <span class="legend-item"><span class="legend-box status-failed"></span> &le;50% Chưa đạt</span>
          <span class="legend-item"><span class="legend-box status-none"></span> Không có task</span>
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện click vào từng ô heatmap để mở modal ngày tương ứng
  if (typeof onSelectDate === 'function') {
    container.querySelectorAll('.heatmap-cell').forEach(cell => {
      const clickHandler = () => {
        const d = cell.getAttribute('data-date');
        if (d) onSelectDate(d);
      };
      cell.addEventListener('click', clickHandler);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickHandler();
        }
      });
    });
  }
}
