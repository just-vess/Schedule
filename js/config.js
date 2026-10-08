/**
 * js/config.js
 * Cấu hình hệ thống, ánh xạ tài nguyên hình ảnh (Assets) và các hàm tiện ích fallback.
 */

// Ánh xạ các "slot" ảnh sang đường dẫn trong thư mục /assets/images/
// Người dùng có thể thay đổi đường dẫn hoặc tên file tại đây.
export const ASSETS = {
  // Ảnh nền toàn trang (tùy chọn)
  background: 'assets/images/background-pattern.svg',
  // Icon nút menu (sidebar toggle)
  menuIcon: 'assets/images/menu-icon.svg',
  // Banner đầu trang của Sidebar
  sidebarBanner: 'assets/images/sidebar-banner.svg',
  // Hình trang trí góc lịch tháng
  calendarDecor: 'assets/images/calendar-decor.svg',
  // Hình trang trí trong modal chi tiết ngày
  modalDecor: 'assets/images/modal-decor.svg',
  // Linh vật / Mascot terminal
  mascot: 'assets/images/mascot.svg',
  // Trạng thái trống khi chưa có task nào trong ngày
  emptyState: 'assets/images/empty-state.svg',
  // Icon checkmark hoàn thành nhiệm vụ
  checkIcon: 'assets/images/check-icon.svg',
};

// Fallback dạng ASCII art hoặc ký tự dòng lệnh khi ảnh chưa tồn tại
export const ASCII_FALLBACKS = {
  background: '',
  menuIcon: '[≡]',
  sidebarBanner: `+-----------------------------+
|    TU HÀNH LỊCH BIỂU v1.0   |
|   TERMINAL PERSONAL SYSTEM  |
+-----------------------------+`,
  calendarDecor: `[* * *]`,
  modalDecor: `[⚡ TASK MATRIX ⚡]`,
  mascot: `  /\\_/\\  
 ( o.o ) 
  > ^ < `,
  emptyState: `  (\\__/) 
  (•ㅅ•)  [TRỐNG]
  / 　 づ
> Hôm nay chưa có nhiệm vụ nào được ghi nhận.
> Hãy gõ lệnh bên trên để bắt đầu!`,
  checkIcon: '[V]',
};

// Cấu hình múi giờ và định dạng
export const CONFIG = {
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  APP_TITLE: 'LỊCH BIỂU TERMINAL',
  STORAGE_KEY: 'TERMINAL_TODO_DATA_V1',
  SCANLINE_STORAGE_KEY: 'TERMINAL_SCANLINES_ENABLED',
  JOURNAL_DEBOUNCE_MS: 400,
};

/**
 * Tạo phần tử hình ảnh an toàn có fallback ASCII hoặc CSS placeholder.
 * Tuyệt đối không hiển thị icon ảnh vỡ của trình duyệt.
 *
 * @param {string} slotKey - Khóa trong ASSETS
 * @param {string} altText - Văn bản thay thế
 * @param {string} className - Class CSS
 * @returns {HTMLElement} - Thẻ HTML bọc ngoài chứa img hoặc fallback
 */
export function createAssetElement(slotKey, altText = '', className = '') {
  const container = document.createElement('div');
  container.className = `asset-slot slot-${slotKey} ${className}`.trim();

  const src = ASSETS[slotKey];
  const fallbackText = ASCII_FALLBACKS[slotKey] || '';

  if (!src) {
    if (fallbackText) {
      container.innerHTML = `<pre class="ascii-fallback">${escapeHtml(fallbackText)}</pre>`;
    }
    return container;
  }

  const img = document.createElement('img');
  img.src = src;
  img.alt = altText || slotKey;
  img.loading = 'lazy';
  img.className = 'asset-img';

  // Khi tải lỗi, ẩn thẻ img và hiển thị fallback dạng ASCII/màu nền
  img.onerror = () => {
    img.style.display = 'none';
    if (fallbackText) {
      const pre = document.createElement('pre');
      pre.className = 'ascii-fallback';
      pre.textContent = fallbackText;
      container.appendChild(pre);
    } else {
      container.classList.add('asset-fallback-empty');
    }
  };

  container.appendChild(img);
  return container;
}

/**
 * Tiện ích escape chuỗi HTML để tránh lỗi bảo mật XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Lấy chuỗi ngày YYYY-MM-DD theo giờ địa phương Việt Nam (Asia/Ho_Chi_Minh).
 * @param {Date} [d=new Date()]
 * @returns {string} YYYY-MM-DD
 */
export function getLocalTodayStr(d = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFIG.TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d); // Chuỗi dạng YYYY-MM-DD
}
