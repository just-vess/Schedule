# TU HÀNH LỊCH BIỂU • TERMINAL PERSONAL SYSTEM

> **Hệ thống Todo List cá nhân hóa thuần HTML/CSS/JavaScript (ES Modules), phong cách Terminal hoài cổ, hỗ trợ tiếng Việt toàn diện, không dùng framework hay thư viện bên ngoài.**

---

## 1. TRIẾT LÝ THIẾT KẾ & BẢNG MÀU

- **Bảng màu chủ đạo:** Nền tối sâu (`#0a0e14`, `#0f141c`), chữ xanh phosphor kinh điển (`#00ff66`), điểm xuyết màu hổ phách/cam vàng cổ điển (`#ffb454`) và đỏ cảnh báo (`#ff5370`).
- **Lý do lựa chọn:**
  1. Tái hiện trọn vẹn phong cách giao diện dòng lệnh (Command Line Interface / CRT Terminal) của các hệ thống máy tính thập niên 80-90.
  2. Tương phản cao, giảm mỏi mắt khi nhìn màn hình trong thời gian dài (Dark Mode sinh học).
  3. Màu sắc đơn sắc (monochrome) kết hợp tiền tố dòng lệnh `> ` và con trỏ nhấp nháy `█` tạo cảm giác kỷ luật, tập trung tuyệt đối vào mục tiêu tu hành và nhiệm vụ hàng ngày.
  4. Hỗ trợ hiển thị chữ Hán Đường thi / Tống từ cổ điển bằng font CJK chất lượng cao của hệ thống.

---

## 2. CẤU TRÚC THƯ MỤC REPOSITORY

```text
/
├── index.html                 # Giao diện HTML5 ngữ nghĩa chính
├── css/
│   └── style.css              # Toàn bộ mã định kiểu CSS, biến :root, hiệu ứng CRT
├── js/
│   ├── app.js                 # Điểm khởi chạy (Entry Point) & bắt phím tắt toàn cục
│   ├── config.js              # Cấu hình hệ thống, slot ánh xạ hình ảnh & ASCII fallback
│   ├── storage.js             # Quản lý localStorage, version migration & Xuất/Nhập JSON
│   ├── streak.js              # Thuật toán tính chuỗi liên tiếp (>50%) & Heatmap 30 ngày
│   ├── calendar.js            # Điều khiển Lịch tháng (T2...CN, giờ Việt Nam)
│   ├── todo.js                # Quản lý Modal ngày: Todo list, Cổ thi & Chi tiết task
│   ├── sidebar.js             # Bảng điều khiển trượt: Chuỗi, Mục tiêu, Nhật ký, Sao lưu
│   └── poems.js               # Tuyển tập 42 câu thơ cổ điển Đường - Tống chuẩn xác
├── assets/
│   ├── fonts/
│   │   └── terminal-font.ttf  # Phông chữ Monospace terminal đóng gói sẵn trong repo
│   └── images/
│       ├── background-pattern.svg # Pattern lưới ma trận nền
│       ├── menuIcon.svg       # Biểu tượng 3 gạch terminal
│       ├── sidebarBanner.svg  # Banner đầu trang sidebar
│       ├── calendarDecor.svg  # Hình trang trí góc lịch tháng
│       ├── modalDecor.svg     # Trang trí hộp thoại nhiệm vụ
│       ├── mascot.svg         # Linh vật robot terminal pixel
│       ├── emptyState.svg     # Trạng thái trống thân thiện
│       └── checkIcon.svg      # Icon tích hoàn thành
└── README.md                  # Hướng dẫn chi tiết sử dụng & triển khai
```

---

## 3. CÁCH CHẠY LOCAL (MÁY CÁ NHÂN)

Do ứng dụng sử dụng chuẩn **JavaScript ES Modules (`import`/`export`)**, trình duyệt yêu cầu nạp file thông qua giao thức HTTP/HTTPS cục bộ (tránh lỗi bảo mật CORS khi mở trực tiếp dạng `file:///index.html`).

Bạn có thể chạy bằng một trong các cách cực kỳ đơn giản sau:

### Cách 1: Dùng Python (Khuyên dùng, có sẵn trên hầu hết các máy)
Mở Terminal hoặc PowerShell tại thư mục dự án và gõ:
```bash
# Python 3:
python -m http.server 8000

# Hoặc trên Windows:
py -m http.server 8000
```
Sau đó mở trình duyệt truy cập: `http://localhost:8000`

### Cách 2: Dùng Node.js / npx
```bash
npx serve .
# Hoặc:
npx http-server .
```

### Cách 3: Dùng extension "Live Server" trên VS Code
1. Cài đặt tiện ích mở rộng **Live Server** trên VS Code.
2. Chuột phải vào file `index.html` và chọn **Open with Live Server**.

---

## 4. CÁCH TRIỂN KHAI LÊN GITHUB PAGES

Ứng dụng hoàn toàn **không cần bước build, không cần npm**, bạn chỉ cần đẩy mã nguồn lên GitHub:

1. Khởi tạo Git và đẩy mã nguồn lên GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: khoi tao ung dung todo list terminal"
   git branch -M main
   git remote add origin https://github.com/just-vess/Schedule
   git push -u origin main
   ```
2. Trên giao diện trình duyệt GitHub:
   - Vào mục **Settings** của repository.
   - Chọn mục **Pages** ở danh mục bên trái.
   - Dưới phần **Build and deployment > Branch**:
     - Chọn nhánh: `main` (hoặc `master`).
     - Chọn thư mục: `/(root)`.
     - Nhấn nút **Save**.
3. Chờ 1–2 phút, trang web sẽ được phát hành tại đường dẫn:
   `https://<tai-khoan-cua-ban>.github.io/<ten-repo>/`

---

## 5. HƯỚNG DẪN THAY ẢNH VÀ QUẢN LÝ ASSET

Dự án đã được thiết kế sẵn bộ tài nguyên vector SVG tối giản chuẩn phong cách terminal. Nếu muốn thay bằng ảnh cá nhân (PNG, JPG, WebP hoặc ảnh phong cảnh), bạn chỉ cần:

1. Chép ảnh của bạn vào thư mục `/assets/images/`.
2. Mở file `js/config.js` và cập nhật đường dẫn tương ứng trong object `ASSETS`:

| Tên Slot | Đường dẫn mặc định | Công dụng | Kích thước đề xuất |
| :--- | :--- | :--- | :--- |
| `background` | `assets/images/background-pattern.svg` | Ảnh hoặc pattern nền toàn trang | 1920x1080px (ảnh phong cảnh) hoặc SVG pattern |
| `menuIcon` | `assets/images/menu-icon.svg` | Icon 3 gạch của nút mở menu | 24x24px hoặc 32x32px |
| `sidebarBanner` | `assets/images/sidebar-banner.svg` | Banner đầu trang của thanh Sidebar | 380x70px hoặc 400x100px |
| `calendarDecor` | `assets/images/calendar-decor.svg` | Khối trang trí góc dưới bảng lịch | 120x24px hoặc 150x30px |
| `modalDecor` | `assets/images/modal-decor.svg` | Nhãn trang trí góc trên hộp thoại ngày | 160x30px |
| `mascot` | `assets/images/mascot.svg` | Linh vật ở góc chân trang | 48x48px hoặc 64x64px |
| `emptyState` | `assets/images/empty-state.svg` | Minh họa khi ngày chưa có task | 200x130px đến 300x200px |
| `checkIcon` | `assets/images/check-icon.svg` | Biểu tượng đánh dấu hoàn thành task | 18x18px hoặc 24x24px |

> **Cơ chế An toàn (No Broken Images):** Hàm `createAssetElement()` trong `js/config.js` tự động bắt sự kiện `onerror`. Nếu bạn nhập sai đường dẫn hoặc ảnh chưa tải được, hệ thống sẽ tự động chuyển sang hiển thị văn bản ASCII art tương ứng, tuyệt đối **không hiển thị icon ảnh vỡ** của trình duyệt.

---

## 6. HƯỚNG DẪN ĐỔI PHÔNG CHỮ (FONT TERMINAL)

1. Tải file font monospace hỗ trợ tiếng Việt có dấu (ví dụ: *JetBrains Mono*, *IBM Plex Mono*, *Fira Code*, *VT323*).
2. Đổi tên file font thành `terminal-font.ttf` và chép đè vào thư mục `/assets/fonts/terminal-font.ttf` (hoặc đặt tên khác và chỉnh lại đường dẫn trong `css/style.css`):
   ```css
   @font-face {
     font-family: 'TerminalFont';
     src: url('../assets/fonts/ten-font-moi.ttf') format('truetype');
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```
3. Lưu ý: Font chữ Hán cho thơ cổ điển được cấu hình tự động sử dụng font CJK tối ưu của hệ điều hành (như *KaiTi*, *Microsoft YaHei*, *PingFang SC*).

---

## 7. TÙY BIẾN THEME BẰNG CSS VARIABLES

Toàn bộ màu sắc và kích thước được quản lý tập trung ở đầu file `css/style.css` trong `:root`:

- **Chuyển sang phong cách Hổ phách (Amber CRT):**
  ```css
  :root {
    --color-text-main: #ffb454;
    --color-text-bright: #ffd580;
    --color-text-dim: #b87528;
    --color-border-glow: #ffb454;
  }
  ```
- **Chuyển sang phong cách Hacker Xanh lá cổ điển (Matrix Green):**
  ```css
  :root {
    --color-bg-root: #050d05;
    --color-text-main: #00ff41;
    --color-border-glow: #00ff41;
  }
  ```

---

## 8. PHÍM TẮT & TÍNH NĂNG ĐẶC BIỆT

- **Bàn phím:**
  - Nhấn `Esc`: Đóng ngay lập tức Modal chi tiết ngày hoặc Sidebar đang mở.
  - Nhấn `Enter` khi đang ở ô nhập tiêu đề task: Thêm nhiệm vụ tức thì.
- **Tính toán Chuỗi (Streak):**
  - Đạt khi: `(Số việc hoàn thành / Tổng số việc) > 50%` (và ngày phải có ít nhất 1 việc).
  - Không bị reset chuỗi giữa ngày: Nếu hôm nay chưa hoàn thành đủ 50%, chuỗi vẫn giữ nguyên tính đến hết hôm qua.
- **Sao lưu / Phục hồi:**
  - Mở Sidebar > Chọn Tab **4. CÀI ĐẶT**.
  - Bấm **[XUẤT DỮ LIỆU .JSON]** để tải bản backup về máy tính.
  - Bấm **[NHẬP DỮ LIỆU .JSON]** để khôi phục hoặc gộp dữ liệu từ máy khác.
- **Hiệu ứng CRT Scanlines:**
  - Có thể Bật/Tắt trong Tab **4. CÀI ĐẶT**; tùy chọn này được lưu vào `localStorage`.
