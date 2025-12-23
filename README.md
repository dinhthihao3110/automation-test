# 🚀 AUTOMATION TEST - PLAYWRIGHT + PYTHON

> **Dự án:** Automation Testing cho hệ thống Cybersoft  
> **Công nghệ:** Playwright + JavaScript (ES6 Modules) + Python  
> **Coverage hiện tại:** 118 automated tests (65.9% coverage)  

---

## 📋 MỤC LỤC

1. [Giới thiệu](#-giới-thiệu)
2. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
3. [Cài đặt từ đầu](#-cài-đặt-từ-đầu)
4. [Cấu trúc dự án](#-cấu-trúc-dự-án)
5. [Chạy tests](#-chạy-tests)
6. [Xem kết quả](#-xem-kết-quả)
7. [Các lệnh hữu ích](#-các-lệnh-hữu-ích)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 GIỚI THIỆU

Dự án automation testing này được thiết kế để:
- ✅ Tự động hóa test cases từ file Excel
- ✅ Sử dụng Page Object Model (POM) pattern
- ✅ Test trên 3 modules chính: **Đăng ký**, **Đăng nhập**, **Đăng xuất**
- ✅ Generate HTML reports với screenshot và video khi test fail
- ✅ Dễ dàng maintain và mở rộng

### 📊 Thống kê hiện tại:

| Module | Total Tests | Automated | Coverage |
|--------|------------|-----------|----------|
| Đăng ký | 73 | 64 | 87.7% |
| Đăng nhập | 57 | 50 | 87.7% |
| Đăng xuất & Profile | 49 | 4 | 8.2% |
| **TỔNG** | **179** | **118** | **65.9%** |

---

## ⚙️ YÊU CẦU HỆ THỐNG

### Bắt buộc:
- ✅ **Node.js** >= 16.x ([Download tại đây](https://nodejs.org/))
- ✅ **Python** >= 3.8 ([Download tại đây](https://www.python.org/downloads/))
- ✅ **npm** (đi kèm với Node.js)
- ✅ Internet connection (để download browsers)

### Kiểm tra version:

```bash
# Kiểm tra Node.js
node --version
# Kết quả: v16.x.x hoặc cao hơn

# Kiểm tra Python
python --version
# Kết quả: Python 3.8.x hoặc cao hơn

# Kiểm tra npm
npm --version
# Kết quả: 7.x.x hoặc cao hơn
```

---

## 🔧 CÀI ĐẶT TỪ ĐẦU

### Bước 1: Clone/Download dự án

Nếu bạn đã có source code, skip bước này.

```bash
# Nếu từ Git
git clone [repository-url]
cd automation-test

# Hoặc giải nén file zip
cd automation-test
```

### Bước 2: Cài đặt Python dependencies

```bash
# Cài đặt pip (nếu chưa có)
python -m ensurepip --upgrade

# Cài đặt pandas và openpyxl để đọc Excel
pip install pandas openpyxl
```

**Lưu ý cho Windows:**
```bash
# Nếu pip không chạy được, dùng:
python -m pip install pandas openpyxl
```

### Bước 3: Cài đặt Node.js dependencies

```bash
# Cài đặt tất cả packages (bao gồm Playwright)
npm install

# Cài đặt browsers cho Playwright (Chrome, Firefox, WebKit)
npx playwright install
```

**⏳ Quá trình này sẽ mất 2-5 phút để download browsers.**

### Bước 4: Parse Excel test cases

Dự án sử dụng file Excel `TestCase_CAPSTONE 2_Testing 08.xlsx` chứa tất cả test cases. Bạn cần parse nó thành JSON trước khi chạy tests:

```bash
# Chạy setup script
npm run setup
```

**Hoặc dùng Python trực tiếp:**
```bash
python setup.py
```

**Kết quả mong đợi:**
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    AUTOMATION TESTING SETUP TOOL                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

BƯỚC 1: ĐỌC VÀ PARSE EXCEL FILE
================================================================================
✅ Tìm thấy file: TestCase_CAPSTONE 2_Testing 08.xlsx
✅ Đọc thành công Excel file
   Tổng số sheets: 3
   Sheets: ['TC-REG', 'TC-LOG', 'TC-LOGOUT-PROFILE']

   📄 Đang xử lý sheet: TC-REG
   ✅ Parsed 73 test cases

   📄 Đang xử lý sheet: TC-LOG
   ✅ Parsed 57 test cases

   📄 Đang xử lý sheet: TC-LOGOUT-PROFILE
   ✅ Parsed 49 test cases

================================================================================
✅ Đã lưu data vào: test_cases_clean.json
================================================================================

BƯỚC 2: PHÂN TÍCH TEST COVERAGE
================================================================================
✅ Đã load test_cases_clean.json

📊 TỔNG QUAN TEST CASES TỪ EXCEL
...

✅ HOÀN TẤT TẤT CẢ BƯỚC!
```

### ✅ Xác nhận cài đặt thành công

Sau khi hoàn thành, bạn sẽ có:
- ✅ File `test_cases_clean.json` (được tạo từ Excel)
- ✅ Thư mục `node_modules/` (dependencies)
- ✅ Browsers đã được cài đặt (Chromium, Firefox, WebKit)

---

## 📁 CẤU TRÚC DỰ ÁN

```
automation-test/
│
├── 📄 package.json              # Node.js configuration & scripts
├── 📄 playwright.config.js      # Playwright configuration
├── 📄 setup.py                  # Python script để parse Excel và analyze coverage
│
├── 📂 pages/                    # Page Object Model (POM)
│   ├── BasePage.js              # Base class cho tất cả pages
│   ├── HomePage.js              # Homepage actions
│   ├── LoginPage.js             # Login page actions
│   └── RegisterPage.js          # Register page actions
│
├── 📂 tests/                    # Test specs
│   ├── register.spec.js         # 64 tests cho đăng ký
│   ├── login.spec.js            # 50 tests cho đăng nhập
│   └── logout.spec.js           # 4 tests cho đăng xuất
│
├── 📂 utils/                    # Utilities
│   └── [helper functions]
│
├── 📊 TestCase_CAPSTONE 2_Testing 08.xlsx   # Excel chứa test cases gốc
├── 📊 test_cases_clean.json                 # JSON được parse từ Excel
│
├── 📂 playwright-report/        # HTML reports (sau khi chạy tests)
├── 📂 test-results/             # Test results, screenshots, videos
└── 📂 screenshots/              # Screenshots khi test fail
```

---

## ▶️ CHẠY TESTS

### Chạy tất cả tests (118 tests)

```bash
npm test
```

### Chạy với UI Mode (RECOMMENDED ⭐)

UI Mode cho phép bạn xem tests chạy theo thời gian thực, debug dễ dàng:

```bash
npm run test:ui
```

**Ưu điểm UI Mode:**
- 👁️ Xem browser actions theo thời gian thực
- 🐛 Debug từng bước một
- ⏸️ Pause/Resume tests
- 📸 Xem screenshots và DOM snapshots
- 🔍 Pick locators trực tiếp từ browser

### Chạy tests cụ thể

#### Chạy theo module:
```bash
# Chỉ test đăng ký (64 tests)
npm run test:register

# Chỉ test đăng nhập (50 tests)
npm run test:login

# Chỉ test đăng xuất (4 tests)
npm run test:logout
```

#### Chạy với browser hiển thị (headed mode):
```bash
npm run test:headed
```

#### Chạy trong debug mode:
```bash
npm run test:debug
```

### Chạy tests cụ thể theo pattern:

```bash
# Chạy test có tên chứa "empty"
npx playwright test -g "empty"

# Chạy test cụ thể theo ID
npx playwright test -g "TC-REG-001"

# Chạy 1 file cụ thể
npx playwright test tests/login.spec.js
```

---

## 📊 XEM KẾT QUẢ

### Xem HTML Report

Sau khi chạy tests, mở HTML report:

```bash
npm run report
```

**Hoặc:**
```bash
npx playwright show-report
```

Report sẽ mở tự động trong browser với:
- ✅ Tổng quan pass/fail
- 📸 Screenshots khi test fail
- 🎥 Videos khi test fail
- 📝 Error stack traces
- ⏱️ Execution time cho mỗi test

### Xem trong terminal

Khi chạy tests, kết quả sẽ hiển thị ngay trong terminal:

```
Running 118 tests using 4 workers

  ✓  [chromium] › register.spec.js:12:5 › TC-REG-001: Should register successfully (2.3s)
  ✓  [chromium] › register.spec.js:34:5 › TC-REG-002: Should show error for duplicate email (1.8s)
  ✗  [chromium] › login.spec.js:15:5 › TC-LOG-001: Should login successfully (1.1s)
  
  ...
  
  118 passed (3.5m)
  2 flaky
  0 skipped
```

---

## 🛠️ CÁC LỆNH HỮU ÍCH

### Setup & Analysis

```bash
# Parse Excel và analyze coverage
npm run setup

# Tương đương với:
python setup.py
```

### Testing

```bash
# Chạy tất cả tests
npm test

# UI Mode (recommended)
npm run test:ui

# Headed mode (hiện browser)
npm run test:headed

# Debug mode
npm run test:debug

# Chạy test cụ thể
npm run test:register
npm run test:login
npm run test:logout
```

### Reports

```bash
# Xem HTML report
npm run report

# Xem results trong terminal
npx playwright show-report --reporter=list
```

### Code Generation

```bash
# Generate test code tự động (Playwright Codegen)
npm run codegen

# Codegen với URL khác
npx playwright codegen https://your-website.com
```

### Utilities

```bash
# Clear test results và reports
rm -rf test-results playwright-report

# Re-install browsers
npx playwright install --force

# Update Playwright
npm install @playwright/test@latest
npx playwright install
```

---

## 🔍 TROUBLESHOOTING

### ❌ Lỗi: "Cannot find module 'pandas'"

**Nguyên nhân:** Python dependencies chưa được cài đặt.

**Giải pháp:**
```bash
pip install pandas openpyxl
```

### ❌ Lỗi: "Executable doesn't exist at ..."

**Nguyên nhân:** Playwright browsers chưa được cài đặt.

**Giải pháp:**
```bash
npx playwright install
```

### ❌ Lỗi: "Test timeout of 30000ms exceeded"

**Nguyên nhân:** Website response chậm hoặc internet kém.

**Giải pháp:**
Tăng timeout trong `playwright.config.js`:
```javascript
use: {
  actionTimeout: 20000,  // Tăng từ 10000 lên 20000
  navigationTimeout: 60000,  // Tăng từ 30000 lên 60000
}
```

### ❌ Tests fail ngẫu nhiên (flaky tests)

**Nguyên nhân:** Timing issues, network issues.

**Giải pháp:**
1. Chạy lại tests với retry:
```bash
npx playwright test --retries=2
```

2. Sử dụng `waitFor` thay vì `timeout`:
```javascript
// ❌ Bad
await page.click('button');

// ✅ Good
await page.waitForSelector('button', { state: 'visible' });
await page.click('button');
```

### ❌ Lỗi: "File test_cases_clean.json not found"

**Nguyên nhân:** Chưa chạy setup script.

**Giải pháp:**
```bash
npm run setup
```

### ❌ Lỗi khi parse Excel trên Windows

**Nguyên nhân:** Encoding issues.

**Giải pháp:**
Đảm bảo file Excel ở đúng thư mục và không bị mở bởi Excel:
```bash
# Đóng Excel nếu đang mở file
# Chạy lại setup
python setup.py
```

---

## 📝 GHI CHÚ

### Best Practices

1. **Luôn chạy `npm run setup` sau khi update Excel test cases**
2. **Sử dụng UI Mode khi develop/debug tests**
3. **Commit `test_cases_clean.json` vào Git** (nếu không muốn parse mỗi lần)
4. **Không commit `node_modules/`** (đã có trong .gitignore)
5. **Review HTML reports sau mỗi lần chạy tests**

### Mở rộng tests

Để thêm test mới:

1. Update Excel file `TestCase_CAPSTONE 2_Testing 08.xlsx`
2. Chạy `npm run setup` để parse lại
3. Viết test code trong `tests/` folder
4. Update Page Objects trong `pages/` nếu cần
5. Chạy tests để verify

### Performance

- Tests chạy parallel (nhiều tests cùng lúc)
- Workers: Tự động dựa trên CPU cores
- Mỗi test độc lập, không ảnh hưởng lẫn nhau

---

## 🎯 NEXT STEPS

Sau khi setup xong, bạn có thể:

1. ✅ **Chạy tests đầu tiên**: `npm run test:ui`
2. 📊 **Review coverage**: Xem file `setup.py` output
3. 🔍 **Explore code**: Đọc code trong `pages/` và `tests/`
4. 📝 **Add more tests**: Mở rộng coverage lên 100%
5. 🚀 **Integrate CI/CD**: Setup GitHub Actions/Jenkins

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Đọc phần [Troubleshooting](#-troubleshooting)
2. Check Playwright docs: https://playwright.dev
3. Check project issues/documentation

---

## 📜 LICENSE

ISC

---

**Happy Testing! 🚀**

Made with ❤️ by Automation Team
