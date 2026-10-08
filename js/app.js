/**
 * js/app.js
 * Điểm khởi chạy chính (Entry Point) của ứng dụng Tu Hành Lịch Biểu.
 * - Quản lý trạng thái giao diện & chuyển ảnh nền động 2 lớp (Crossfade 600ms).
 * - Tích hợp hiệu ứng Hạt Sáng Linh Khí (Lingqi Particles) nhẹ nhàng.
 * - Khởi tạo toàn bộ phân hệ: Storage, Calendar, Sidebar, Todo Modal.
 */

import { createAssetElement, CONFIG, BACKGROUNDS, preloadBackgrounds } from './config.js';
import { loadData } from './storage.js';
import { initCalendar } from './calendar.js';
import { initSidebar, closeSidebar } from './sidebar.js';
import { initTodoModal, closeDayModal } from './todo.js';

// Quản lý trạng thái nền toàn cục: 'calendar' | 'sidebar' | 'day'
export const appState = {
  view: 'calendar',
  activeBgLayer: 1, // 1 hoặc 2
  particlesActive: true,
};

let bgLayer1 = null;
let bgLayer2 = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Nạp và kiểm tra dữ liệu ban đầu
  loadData();

  // 2. Preload toàn bộ ảnh nền để chuyển trạng thái mượt, không giật chớp
  preloadBackgrounds();

  // 3. Khởi tạo 2 lớp nền động Crossfade
  initBackgroundLayers();

  // 4. Khởi tạo hiệu ứng Hạt Linh Khí trôi chậm
  initLingqiParticles();

  // 5. Khởi tạo các phân hệ chính
  initCalendar();
  initSidebar();
  initTodoModal();

  // 6. Gắn các slot hình ảnh / hoa văn trang trí
  mountDecorSlots();

  // 7. Thiết lập phím tắt toàn cục (Esc để đóng modal/sidebar)
  setupKeyboardShortcuts();

  console.log(`%c[TU HÀNH LỊCH BIỂU]%c Khởi tạo thành công! Trạng thái: Linh khí dồi dào.`, 
    'color: #5fd1a8; font-weight: bold; background: #0b0d10; padding: 2px 6px; border: 1px solid #5fd1a8; border-radius: 4px;',
    'color: #ece6d6;');
});

/**
 * Khởi tạo 2 lớp nền crossfade và đặt ảnh mặc định
 */
function initBackgroundLayers() {
  bgLayer1 = document.getElementById('bg-layer-1');
  bgLayer2 = document.getElementById('bg-layer-2');

  // Đặt ảnh ban đầu (mặc định: calendar - tranh thủy mặc đen trắng)
  setBackground('calendar');
}

/**
 * Chuyển đổi ảnh nền động theo trạng thái với hiệu ứng crossfade 600ms không chớp
 * @param {'calendar'|'sidebar'|'day'} stateName
 */
export function setBackground(stateName) {
  appState.view = stateName;
  const targetUrl = BACKGROUNDS[stateName] || BACKGROUNDS.calendar;

  if (!bgLayer1 || !bgLayer2) return;

  const currentLayer = appState.activeBgLayer === 1 ? bgLayer1 : bgLayer2;
  const nextLayer = appState.activeBgLayer === 1 ? bgLayer2 : bgLayer1;

  // Cập nhật ảnh cho lớp tiếp theo
  nextLayer.style.backgroundImage = `url("${targetUrl}")`;
  nextLayer.classList.add('active');
  currentLayer.classList.remove('active');

  // Đổi cờ lớp đang kích hoạt
  appState.activeBgLayer = appState.activeBgLayer === 1 ? 2 : 1;
}

/**
 * Gắn các slot hình ảnh trang trí
 */
function mountDecorSlots() {
  // Menu icon: làm sạch trước khi chèn (idempotent)
  const menuIconSlot = document.getElementById('menu-icon-slot');
  if (menuIconSlot && menuIconSlot.children.length === 0) {
    const icon = createAssetElement('menuIcon', 'Động Phủ', 'nav-icon');
    menuIconSlot.appendChild(icon);
  }

  // Mascot ở chân trang: làm sạch trước khi chèn (idempotent)
  const mascotSlot = document.getElementById('mascot-slot');
  if (mascotSlot && mascotSlot.children.length === 0) {
    const mascot = createAssetElement('mascot', 'Tiên Gia Linh Thú', 'app-mascot');
    mascotSlot.appendChild(mascot);
  }
}

/**
 * Khởi tạo hiệu ứng Hạt Sáng Linh Khí (Lingqi Particles) nhẹ, trôi chậm
 */
function initLingqiParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Tôn trọng thiết lập giảm chuyển động của hệ điều hành
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const savedSetting = localStorage.getItem(CONFIG.PARTICLES_STORAGE_KEY);
  if (savedSetting === 'false') {
    appState.particlesActive = false;
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particlesCount = Math.min(35, Math.floor(width / 45));
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.15, // Trôi nhẹ hướng lên trời
      alpha: Math.random() * 0.6 + 0.2,
      dAlpha: (Math.random() - 0.5) * 0.008,
      color: Math.random() > 0.4 ? '95, 209, 168' : '217, 184, 108', // Xanh ngọc hoặc Vàng kim
    });
  }

  function renderParticles() {
    if (!appState.particlesActive) return;
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.dAlpha;

      if (p.alpha <= 0.1 || p.alpha >= 0.8) p.dAlpha = -p.dAlpha;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, p.alpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.color}, 0.6)`;
      ctx.fill();
    }

    requestAnimationFrame(renderParticles);
  }

  requestAnimationFrame(renderParticles);
}

/**
 * Bật / tắt Hạt Linh Khí từ cài đặt
 */
export function toggleLingqiParticles() {
  const canvas = document.getElementById('particles-canvas');
  appState.particlesActive = !appState.particlesActive;
  localStorage.setItem(CONFIG.PARTICLES_STORAGE_KEY, appState.particlesActive ? 'true' : 'false');
  if (canvas) {
    canvas.style.display = appState.particlesActive ? 'block' : 'none';
  }
  if (appState.particlesActive) {
    initLingqiParticles();
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
