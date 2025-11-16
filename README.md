# TinyR URL Shortener – Frontend

TinyR Frontend là giao diện người dùng cho hệ thống rút gọn URL TinyR, xây dựng dưới dạng SPA (Single Page Application) với React. Mục tiêu tập trung vào tốc độ, UX hiện đại và thiết kế Responsive.

## Công nghệ

| Lĩnh vực          | Công nghệ           |
|------------------|---------------------|
| Framework         | React.js (Hooks)    |
| Build Tool        | Vite                |
| Styling           | Tailwind CSS        |
| Routing           | React Router DOM    |
| State Management  | Context API         |

## Kiến trúc thư mục

```
├── src/
│ ├── assets/ # Hình ảnh, icon
│ ├── components/ # UI components tái sử dụng
│ ├── context/ # AuthContext, URLContext
│ ├── pages/ # Các trang giao diện
│ ├── hooks/ # Custom Hooks (useAuth, useFetch,...)
│ └── App.jsx # Router và root component
```

## Điểm nhấn kỹ thuật

- AuthContext quản lý trạng thái người dùng (token, user, isVerified) trên toàn ứng dụng.
- Hỗ trợ Persistent Login bằng localStorage để duy trì phiên làm việc sau khi reload.
- Xử lý luồng Email Verification: redirect tự động và xác thực token từ URL.
- Route Guarding: chặn truy cập các tính năng chính nếu tài khoản chưa được xác thực.
- Responsive Design với Tailwind CSS theo hướng Mobile First.

## Hướng dẫn chạy

### 1. Clone và cài đặt
```bash
git clone https://github.com/sung2708/shorten_url_ui
cd shorten_url_ui/src
yarn install
```
### 2. Tạo file `.env.local`
```.env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Chạy ứng dụng
```bash
yarn run dev
```
Project by **sung2708**
