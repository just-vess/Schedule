/**
 * js/app.js
 * Điểm khởi chạy chính (Entry Point) của ứng dụng Terminal Todo List.
 * Tích hợp toàn bộ các phân hệ: Storage, Calendar, Sidebar, Streak, Todo Modal.
 * Thiết lập phím tắt toàn cục (Esc để đóng popup/sidebar).
 */

import { createAssetElement, CONFIG, ASSETS } from './config.js';
import { loadData } from './storage.js';
import { initCalendar } from './calendar.js';
import { initSidebar, closeSidebar } from './sidebar.js';
import { initTodoModal, closeDayModal } from './todo.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Kiểm tra và nạp dữ liệu ban đầu
  loadData();

  // 2. Khởi tạo các phân hệ
  initCalendar();
  initSidebar();
  initTodoModal();

  // 3. Gắn các slot hình ảnh trang trí với fallback an toàn
  mountDecorSlots();

  // 4. Thiết lập phím tắt toàn cục (Bàn phím)
  setupKeyboardShortcuts();

  console.log(`%c[TERMINAL TODO]%c Khởi động thành công! Phiên bản: ${CONFIG.APP_TITLE}`, 
    'color: #00ff66; font-weight: bold; background: #000; padding: 2px 4px;',
    'color: #fff;');
});

/**
 * Gắn các slot hình ảnh trang trí
 */
function mountDecorSlots() {
  // Menu icon
  const menuIconSlot = document.getElementById('menu-icon-slot');
  if (menuIconSlot) {
    const icon = createAssetElement('menuIcon', 'Menu', 'nav-icon');
    menuIconSlot.appendChild(icon);
  }

  // Trang trí lịch
  const calendarDecorSlot = document.getElementById('calendar-decor-slot');
  if (calendarDecorSlot) {
    const decor = createAssetElement('calendarDecor', 'Lịch', 'cal-decor');
    calendarDecorSlot.appendChild(decor);
  }

  // Nền trang trí
  const bgLayer = document.getElementById('app-bg-layer');
  if (bgLayer && ASSETS.background) {
    bgLayer.style.backgroundImage = `url("${ASSETS.background}")`;
  }

  // Mascot ở chân trang
  const mascotSlot = document.getElementById('mascot-slot');
  if (mascotSlot) {
    const mascot = createAssetElement('mascot', 'Terminal Mascot', 'app-mascot');
    mascotSlot.appendChild(mascot);
  }
}

/**
 * Quản lý phím tắt:
 * - Phím 'Escape': Đóng Modal chi tiết ngày hoặc Sidebar đang mở.
 */
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const modal = document.getElementById('day-modal');
      const sidebar = document.getElementById('sidebar');

      if (modal && modal.classList.contains('active')) {
        closeDayModal();
        e.preventDefault();
        return;
      }

      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
        e.preventDefault();
        return;
      }
    }
  });
}
