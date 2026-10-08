/**
 * js/streak.js
 * Tính toán Chuỗi Tu Luyện (Streak) & Hệ thống Cảnh Giới Tu Tiên & Heatmap 30 ngày.
 * 
 * QUY TẮC:
 * - Một ngày được tính là "Đột phá thành công" khi:
 *   số công khóa hoàn thành / tổng số công khóa > 50% (và ngày có ít nhất 1 công khóa).
 * - Chuỗi hiện tại:
 *   Số ngày đạt liên tiếp tính đến hôm nay. Nếu hôm nay chưa đạt thì vẫn tính chuỗi
 *   đến hết hôm qua (không bị reset về 0 giữa ngày khi đang tu luyện).
 */

import { getLocalTodayStr, escapeHtml, getCultivationRealm } from './config.js';

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
  const allRecordedDates = Object.keys(allTasks).filter(d => Array.isArray(allTasks[d]) && allTasks[d].length > 0);
  if (allRecordedDates.length === 0) {
    return { currentStreak, longestStreak: currentStreak, todayAchieved };
  }

  allRecordedDates.sort();
  const earliestDate = allRecordedDates[0];
  let longestStreak = currentStreak;
  let tempStreak = 0;
  let iterDate = earliestDate;

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
 * Render giao diện thẻ Streak, Cảnh Giới Tu Tiên và Heatmap vào container
 * @param {HTMLElement} container
 * @param {object} allTasks
 * @param {function} [onSelectDate=null]
 */
export function renderStreakWidget(container, allTasks, onSelectDate = null) {
  const todayStr = getLocalTodayStr();
  const { currentStreak, longestStreak, todayAchieved } = calcStreaks(allTasks, todayStr);
  const heatmapData = getHeatmap30Days(allTasks, todayStr, 30);
  const realmInfo = getCultivationRealm(currentStreak);

  container.innerHTML = `
    <div class="streak-widget glass-card">
      <div class="streak-header">
        <span class="prompt-prefix">&gt;</span> <span class="font-calligraphy title-glow">CHUỖI TU LUYỆN</span>
      </div>

      <!-- Thẻ Cảnh Giới Tu Tiên -->
      <div class="realm-badge-card">
        <div class="realm-stamp" title="Con dấu cảnh giới: ${escapeHtml(realmInfo.current.name)}">
          ${escapeHtml(realmInfo.current.stamp)}
        </div>
        <div class="realm-details">
          <div class="realm-title-line">
            <span class="realm-prefix">CẢNH GIỚI:</span>
            <strong class="realm-name font-calligraphy text-gold">${escapeHtml(realmInfo.current.name)}</strong>
          </div>
          <div class="realm-desc text-muted">${escapeHtml(realmInfo.current.desc)}</div>
          
          ${realmInfo.next ? `
            <div class="realm-progress-wrap">
              <div class="realm-progress-info">
                <span>Tiến tới <strong>${escapeHtml(realmInfo.next.name)}</strong>:</span>
                <span>${realmInfo.progress}% (còn ${realmInfo.daysToNext} ngày)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill achieved" style="width: ${realmInfo.progress}%;"></div>
              </div>
            </div>
          ` : `
            <div class="realm-max-tag text-gold">⚡ ĐẠT ĐỈNH PHONG TIÊN ĐẠO ⚡</div>
          `}
        </div>
      </div>

      <div class="streak-stats-row">
        <div class="streak-card card-current">
          <div class="streak-label">CHUỖI HIỆN TẠI</div>
          <div class="streak-value text-jade">${currentStreak} <span class="unit">ngày</span></div>
          <div class="streak-sub">
            ${todayAchieved 
              ? '<span class="tag-success">[✓ Hôm nay: ĐỘT PHÁ &gt;50%]</span>' 
              : '<span class="tag-pending">[• Hôm nay: Chưa đạt hỏa hầu]</span>'}
          </div>
        </div>

        <div class="streak-card card-longest">
          <div class="streak-label">CHUỖI CAO NHẤT</div>
          <div class="streak-value text-gold">${longestStreak} <span class="unit">ngày</span></div>
          <div class="streak-sub text-muted">Kỷ lục đạo hạnh</div>
        </div>
      </div>

      <div class="heatmap-section">
        <div class="heatmap-title">
          <span class="prompt-prefix">&gt;</span> LINH KHÍ 30 NGÀY QUA:
        </div>

        <div class="heatmap-grid" role="grid" aria-label="Lưới linh khí 30 ngày qua">
          ${heatmapData.map(item => {
            const isToday = item.dateStr === todayStr;
            const tooltip = `${item.dateStr}: ${item.done}/${item.total} công khóa (${item.percent}%) — ${
              item.status === 'achieved' ? 'Đột phá thành công' : item.status === 'failed' ? 'Chưa đạt hỏa hầu' : 'Chưa lập công khóa'
            }`;
            return `
              <div class="heatmap-cell status-${item.status} ${isToday ? 'cell-today' : ''}" 
                   data-date="${escapeHtml(item.dateStr)}" 
                   title="${escapeHtml(tooltip)}" 
                   role="gridcell" 
                   tabindex="0"
                   aria-label="${escapeHtml(tooltip)}">
                <span class="cell-date-num">${item.dateStr.slice(8)}</span>
                ${item.status === 'achieved' ? '<span class="cell-seal-dot">☯</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="heatmap-legend">
          <span class="legend-item"><span class="legend-box status-achieved"></span> Đột phá (&gt;50%)</span>
          <span class="legend-item"><span class="legend-box status-failed"></span> Chưa đạt (&le;50%)</span>
          <span class="legend-item"><span class="legend-box status-none"></span> Chưa có việc</span>
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện mở modal khi click vào ô heatmap
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
