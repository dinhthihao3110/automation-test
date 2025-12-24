# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN AUTOMATION TEST

## 📋 YÊU CẦU HỆ THỐNG

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- ✅ **Node.js** >= 16.x ([Download tại đây](https://nodejs.org/))
- ✅ **Python** >= 3.8 ([Download tại đây](https://www.python.org/downloads/))

### Kiểm tra version đã cài:

```powershell
# Kiểm tra Node.js
node --version

# Kiểm tra Python (Windows)
py --version

# Kiểm tra npm
npm --version
```

---

## 🔧 BƯỚC 0: Sửa PowerShell Execution Policy (Windows)

**⚠️ QUAN TRỌNG:** Nếu gặp lỗi khi chạy npm, cần sửa execution policy trước:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Lệnh này cho phép PowerShell chạy npm scripts.

---

## 📦 BƯỚC 1: Cài đặt Python Dependencies

Cài đặt các thư viện Python cần thiết để đọc và parse file Excel:

```powershell
# Cài đặt pandas và openpyxl
py -m pip install pandas openpyxl
```

**Kết quả mong đợi:**
```
Successfully installed pandas-2.x.x openpyxl-3.x.x numpy-2.x.x ...
```

---

## 📦 BƯỚC 2: Cài đặt Node.js Dependencies

### 2.1. Cài đặt npm packages

```powershell
npm install
```

**Kết quả mong đợi:**
```
added 3 packages, and audited 4 packages in 7s
found 0 vulnerabilities
```

### 2.2. Cài đặt Playwright browsers

```powershell
npx playwright install
```

**⏳ Quá trình này sẽ mất 2-5 phút** để download Chromium, Firefox, và WebKit.

**Kết quả mong đợi:**
```
Chromium 143.x downloaded to ...
Firefox 133.x downloaded to ...
WebKit 18.x downloaded to ...
```

---

## 🔄 BƯỚC 3: Parse Excel Test Cases

Chuyển đổi file Excel thành JSON để chạy automation tests:

```powershell
# Chạy với encoding UTF-8 (khuyến nghị)
$env:PYTHONIOENCODING='utf-8'; py setup.py
```

**Hoặc dùng npm script:**
```powershell
npm run setup
```

**Kết quả mong đợi:**
```
╔==============================================================================╗
║                    AUTOMATION TESTING SETUP TOOL                             ║
╚==============================================================================╝

✅ Tìm thấy file: TestCase_CAPSTONE 2_Testing 08.xlsx
✅ Parsed 73 test cases (Đăng ký)
✅ Parsed 57 test cases (Đăng nhập)
✅ Parsed 49 test cases (Đăng xuất & Profile)

📊 Coverage hiện tại: 65.9% (118/179 tests)
🎉 Đã vượt mục tiêu 60%!

✅ HOÀN TẤT TẤT CẢ BƯỚC!
```

---

## ▶️ BƯỚC 4: Chạy Tests

### 4.1. Chạy UI Mode (KHUYẾN NGHỊ ⭐)

```powershell
npm run test:ui
```

**Ưu điểm:**
- 👁️ Xem browser actions theo thời gian thực
- 🐛 Debug từng bước
- ⏸️ Pause/Resume tests
- 📸 Xem screenshots và DOM snapshots

### 4.2. Chạy tất cả tests (Headless)

```powershell
npm test
```

Chạy 118 tests trong chế độ headless (không hiển thị browser).

### 4.3. Chạy với browser hiển thị

```powershell
npm run test:headed
```

### 4.4. Chạy tests theo module

```powershell
# Chỉ test đăng ký (64 tests)
npm run test:register

# Chỉ test đăng nhập (50 tests)
npm run test:login

# Chỉ test đăng xuất (4 tests)
npm run test:logout
```

---

## 📊 BƯỚC 5: Xem Kết Quả

### Xem HTML Report

```powershell
npm run report
```

Report sẽ tự động mở trong browser với:
- ✅ Tổng quan pass/fail
- 📸 Screenshots khi test fail
- 🎥 Videos khi test fail
- 📝 Error stack traces
- ⏱️ Execution time

---

## 🛠️ TROUBLESHOOTING

### ❌ Lỗi: "running scripts is disabled"

**Giải pháp:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Lỗi: "pip is not recognized"

**Giải pháp:** Dùng `py -m pip` thay vì `pip`:
```powershell
py -m pip install pandas openpyxl
```

### ❌ Lỗi encoding khi chạy setup.py

**Giải pháp:** Thêm encoding UTF-8:
```powershell
$env:PYTHONIOENCODING='utf-8'; py setup.py
```

### ❌ Lỗi: "Executable doesn't exist"

**Giải pháp:** Cài lại Playwright browsers:
```powershell
npx playwright install
```

---

## 📝 TÓM TẮT CÁC LỆNH

```powershell
# 0. Sửa execution policy (chỉ 1 lần)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 1. Cài Python dependencies
py -m pip install pandas openpyxl

# 2. Cài Node.js dependencies
npm install
npx playwright install

# 3. Parse Excel test cases
$env:PYTHONIOENCODING='utf-8'; py setup.py

# 4. Chạy tests
npm run test:ui      # UI Mode (recommended)
npm test             # Headless mode
npm run test:headed  # Hiển thị browser

# 5. Xem kết quả
npm run report
```

---

## 🎯 NEXT STEPS

Sau khi setup xong:

1. ✅ Chạy tests đầu tiên: `npm run test:ui`
2. 📊 Review kết quả: `npm run report`
3. 🔍 Đọc code trong `pages/` và `tests/`
4. 📝 Mở rộng coverage (hiện tại 65.9%)

---

**Happy Testing! 🚀**