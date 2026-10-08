# TU HÀNH LỊCH BIỂU • 修行曆表 (v2.0)

> **Hệ thống Quản lý Công khóa & Tu Thân Cá Nhân Hóa**
> Giao diện kết hợp giữa **Kính Mờ Tiên Hiệp (Glassmorphism Tu Tiên)** và **Dòng Lệnh Cổ Điển (Terminal Aesthetic)**.
> Thuần HTML5, CSS3, JavaScript ES Modules, không framework, không bước build, tối ưu tuyệt đối cho GitHub Pages.

---

## 1. TRIẾT LÝ THIẾT KẾ & BẢNG MÀU TIÊN GIA

- **Mực đen huyền mặc (`#0b0d10`, `#12161d`):** Làm nền sâu thẳm tựa như giấy xuyến chỉ nhuộm mực tàu, giúp mắt thư thái tuyệt đối khi tập trung làm việc.
- **Xanh ngọc bích linh khí (`#5fd1a8`):** Thay thế màu xanh neon chói lóa, tượng trưng cho sinh khí tươi nhuận, sự đột phá công đức và minh mẫn.
- **Vàng kim cổ điển (`#d9b86c`):** Điểm xuyết cho tiêu đề, viền mây vân vân văn và các mốc thời gian, tạo vẻ tôn quý, trang nghiêm của tiên môn.
- **Chu sa / Đỏ son (`#c0392b`):** Sử dụng cho con dấu triện ấn cổ kính (Đạo ấn `道`, Cảnh giới `凡/气/基/丹/婴/神/仙`) và cảnh báo quá hạn.
- **Trắng ngà (`#ece6d6`):** Độ tương phản hoàn hảo cho văn bản, đọc lâu không mỏi mắt.

---

## 2. NGUYÊN NHÂN LỖI KHÔNG LOAD ẢNH TRƯỚC ĐÂY & ĐÃ KHẮC PHỤC

1. **Sai lệch đường dẫn tương đối khi chạy trên GitHub Pages (`/Schedule/`):**
   - *Nguyên nhân:* Trước đây dùng đường dẫn tuyệt đối hoặc không đồng bộ gốc URL làm trình duyệt tìm ảnh ở `https://just-vess.github.io/assets/...` thay vì `https://just-vess.github.io/Schedule/assets/...`.
   - *Đã sửa:* Toàn bộ đường dẫn trong `js/config.js` và `index.html` đã được chuẩn hóa về đường dẫn tương đối chuẩn `./assets/images/...`, trong `css/style.css` là `../assets/...`.
2. **Khớp chính xác tên file và phần mở rộng:**
   - *Nguyên nhân:* GitHub Pages chạy trên máy chủ Linux phân biệt chữ hoa/thường cực kỳ nghiêm ngặt (`aa.jpg` khác `AA.jpg`, đuôi `.avif` khác `.jpg`).
   - *Đã sửa:* Đã nạp đúng 100% tên file hiện có trong repository:
     - Nền mặc định (trắng đen): `assets/images/white-black-and-chinese-painting-ink-powerpoint-background_5501ec0fba__960_540.avif`
     - Nền Động Phủ (Sidebar): `assets/images/pngtree-chinese-wind-material-h5-background-image_123519.jpg`
     - Nền Popup công khóa ngày: `assets/images/aa.jpg`
3. **Cơ chế Preload & Debug thông minh qua F12:**
   - Đã thêm hàm `preloadBackgrounds()` chạy ngầm ngay khi tải trang bằng `new Image()`.
   - Khi có bất kỳ ảnh nào bị lỗi đường dẫn, console trình duyệt sẽ in rõ cảnh báo vàng `console.warn` kèm **toàn bộ đường dẫn URL đầy đủ** để bạn kiểm tra ngay trong F12.
4. **Lớp phủ màn che tương phản (Gradient Overlay):**
   - Đã phủ lớp gradient tối (`--bg-overlay-gradient`) giữa nền và nội dung để dù bạn đổi sang ảnh nền sáng hay tối, toàn bộ chữ và lịch đều nổi bật, dễ đọc.

---

## 3. CHECKLIST 3 BƯỚC TỰ KIỂM TRA TRÊN GITHUB PAGES

Sau khi bạn `git push` lên GitHub, hãy làm theo 3 bước này để đảm bảo ảnh và web hiển thị hoàn hảo:

- [ ] **Bước 1: Kiểm tra đúng thư mục trên GitHub repo:**
  Đảm bảo các file ảnh nền nằm đúng trong thư mục `assets/images/` (có chữ `s` ở `assets`, không phải thư mục `asset/`).
- [ ] **Bước 2: Kiểm tra chính xác tên file (Case-sensitive):**
  Kiểm tra tên file trên GitHub khớp từng ký tự với khai báo trong `js/config.js`:
  - `aa.jpg`
  - `pngtree-chinese-wind-material-h5-background-image_123519.jpg`
  - `white-black-and-chinese-painting-ink-powerpoint-background_5501ec0fba__960_540.avif`
- [ ] **Bước 3: Xóa cache trình duyệt bằng `Ctrl + F5` (hoặc `Cmd + Shift + R` trên Mac):**
  GitHub Pages và trình duyệt thường lưu cache file CSS/JS cũ. Nhấn tổ hợp phím **Ctrl + F5** trên trang `https://just-vess.github.io/Schedule/` để ép trình duyệt tải lại toàn bộ tài nguyên mới nhất.

---

## 4. HƯỚNG DẪN TÙY BIẾN NHANH

### A. Đổi ảnh nền ở đâu?
Mở file `js/config.js`, tìm object `BACKGROUNDS` ở đầu file và đổi đường dẫn:
```javascript
export const BACKGROUNDS = {
  calendar: './assets/images/anh-lich-mac-dinh.jpg', // Nền khi xem lịch
  sidebar:  './assets/images/anh-khi-mo-sidebar.jpg', // Nền khi mở Động Phủ
  day:      './assets/images/anh-khi-mo-popup.jpg',   // Nền khi mở popup ngày
};
```

### B. Đổi bảng màu ở đâu?
Mở file `css/style.css`, tìm khối `:root` ở dòng 26:
```css
:root {
  --color-jade: #5fd1a8;      /* Đổi màu xanh ngọc chủ đạo */
  --color-gold: #d9b86c;      /* Đổi màu vàng kim tiêu đề và viền */
  --color-cinnabar: #c0392b;  /* Đổi màu đỏ chu sa triện ấn */
  --color-ivory: #ece6d6;     /* Đổi màu chữ trắng ngà */
}
```

### C. Bật / Tắt Hạt Linh Khí và Scanline ở đâu?
- **Ngay trên giao diện web:** Bấm vào nút **[ĐỘNG PHỦ]** góc trái trên > Chọn tab **4. TÀNG KINH** > Bấm nút **[LINH KHÍ: ĐANG BẬT/TẮT]** hoặc **[SCANLINES: ĐANG BẬT/TẮT]**. Lựa chọn này được lưu vĩnh viễn trên trình duyệt của bạn!
- **Hệ thống Cảnh Giới:** Có thể tùy chỉnh số ngày và danh xưng tu vi (`Phàm Nhân` -> `Độ Kiếp`) tại mảng `REALMS` trong file `js/config.js`.
