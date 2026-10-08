/**
 * js/config.js
 * Cấu hình hệ thống Tu Hành Lịch Biểu:
 * - Ánh xạ tài nguyên hình ảnh (Assets) & Nền động theo trạng thái.
 * - Hệ thống cảnh giới tu tiên theo chuỗi ngày (Streak).
 * - Preload ảnh với cảnh báo debug console.warn chi tiết.
 */

// Bảng ánh xạ ảnh nền tương đối (phù hợp tuyệt đối với cả domain gốc và GitHub Pages /Schedule/)
export const BACKGROUNDS = {
  // Ảnh nền mặc định (trắng đen thư pháp) khi xem lịch
  calendar: './asset/white-black-and-chinese-painting-ink-powerpoint-background_5501ec0fba__960_540.avif',
  // Ảnh nền khi mở Động Phủ (Sidebar)
  sidebar: './asset/pngtree-chinese-wind-material-h5-background-image_123519.jpg',
  // Ảnh nền khi mở Hộp thoại Công khóa ngày (Popup)
  day: './asset/aa.jpg',
};

// Ánh xạ các "slot" ảnh sang đường dẫn tương đối trong thư mục ./assets/images/
export const ASSETS = {
  background: BACKGROUNDS.calendar,
  menuIcon: './assets/images/menu-icon.svg',
  sidebarBanner: './assets/images/sidebar-banner.svg',
  calendarDecor: './assets/images/calendar-decor.svg',
  modalDecor: './assets/images/modal-decor.svg',
  mascot: './assets/images/mascot.svg',
  emptyState: './assets/images/empty-state.svg',
  checkIcon: './assets/images/check-icon.svg',
};

// Fallback dạng ASCII art hoặc ký tự dòng lệnh khi ảnh chưa tồn tại
export const ASCII_FALLBACKS = {
  background: '',
  menuIcon: '[≡]',
  sidebarBanner: `+-----------------------------+
|    TU HÀNH LỊCH BIỂU v2.0   |
|   TIÊN GIA ĐỘNG PHỦ KERNEL  |
+-----------------------------+`,
  calendarDecor: `[* ☯ *]`,
  modalDecor: `[⚡ TIÊN GIA CÔNG KHÓA ⚡]`,
  mascot: `  /\\_/\\  
 ( o.o ) 
  > ^ < `,
  emptyState: `  (\\__/) 
  (•ㅅ•)  [TRỐNG]
  / 　 づ
> Hôm nay chưa lập công khóa tu hành.
> Hãy gõ lệnh bên trên để bắt đầu tích lũy linh căn!`,
  checkIcon: '[✓]',
};

// Cấu hình múi giờ và hằng số hệ thống
export const CONFIG = {
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  APP_TITLE: 'TU HÀNH LỊCH BIỂU • 修行曆表',
  STORAGE_KEY: 'TERMINAL_TODO_DATA_V1',
  SCANLINE_STORAGE_KEY: 'TERMINAL_SCANLINES_ENABLED',
  PARTICLES_STORAGE_KEY: 'TERMINAL_PARTICLES_ENABLED',
  JOURNAL_DEBOUNCE_MS: 400,
};

// Hệ thống 7 Đại Cảnh Giới Tu Tiên theo chuỗi ngày (Streak)
export const REALMS = [
  { name: 'Phàm Nhân', minDays: 0, maxDays: 2, stamp: '凡', desc: 'Tâm trần chưa dứt, bước đầu lập chí tu thân.' },
  { name: 'Luyện Khí', minDays: 3, maxDays: 6, stamp: '气', desc: 'Hấp thu thiên địa linh khí, rèn luyện thân thể.' },
  { name: 'Trúc Cơ', minDays: 7, maxDays: 13, stamp: '基', desc: 'Đúc nền móng đạo hạnh vững như bàn thạch.' },
  { name: 'Kim Đan', minDays: 14, maxDays: 29, stamp: '丹', desc: 'Ngưng kết kim đan, đạo tâm kiên định bất chuyển.' },
  { name: 'Nguyên Anh', minDays: 30, maxDays: 59, stamp: '婴', desc: 'Phá đan thành anh, thần thông tự sinh biến ảo.' },
  { name: 'Hóa Thần', minDays: 60, maxDays: 99, stamp: '神', desc: 'Linh hồn hóa thần, cảm ngộ quy luật thiên địa.' },
  { name: 'Độ Kiếp', minDays: 100, maxDays: Infinity, stamp: '仙', desc: 'Vượt lôi kiếp cửu trùng, phi thăng tiên giới viên mãn.' },
];

/**
 * Tính toán cảnh giới tu vi hiện tại dựa vào chuỗi ngày đạt
 * @param {number} streakDays 
 * @returns {{ current: object, next: object|null, progress: number, daysToNext: number }}
 */
export function getCultivationRealm(streakDays = 0) {
  let currentIdx = 0;
  for (let i = 0; i < REALMS.length; i++) {
    if (streakDays >= REALMS[i].minDays && (streakDays <= REALMS[i].maxDays || REALMS[i].maxDays === Infinity)) {
      currentIdx = i;
      break;
    }
  }

  const current = REALMS[currentIdx];
  const next = currentIdx < REALMS.length - 1 ? REALMS[currentIdx + 1] : null;

  let progress = 100;
  let daysToNext = 0;

  if (next) {
    const span = next.minDays - current.minDays;
    const gained = streakDays - current.minDays;
    progress = Math.min(100, Math.max(0, Math.round((gained / span) * 100)));
    daysToNext = Math.max(0, next.minDays - streakDays);
  }

  return { current, next, progress, daysToNext };
}

/**
 * Preload các hình ảnh nền để chuyển cảnh mượt mà, không giật chớp.
 * Tự động ghi log console.warn kèm đường dẫn tuyệt đối khi gặp lỗi để người dùng F12 debug.
 */
export function preloadBackgrounds() {
  Object.entries(BACKGROUNDS).forEach(([key, relPath]) => {
    if (!relPath) return;
    const img = new Image();
    img.src = relPath;
    img.onload = () => {
      // Đã nạp thành công ảnh
    };
    img.onerror = () => {
      const fullUrl = new URL(relPath, window.location.href).href;
      console.warn(`[TU HÀNH LỊCH BIỂU] ⚠️ Không thể tải ảnh nền [${key}]. Đường dẫn kiểm tra: ${fullUrl}`);
    };
  });
}

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
    const fullUrl = new URL(src, window.location.href).href;
    console.warn(`[TU HÀNH LỊCH BIỂU] ⚠️ Ảnh slot [${slotKey}] không tồn tại tại: ${fullUrl}`);
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
  return formatter.format(d);
}
