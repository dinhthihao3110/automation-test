Bước 1: Cài đặt Dependencies

- ✅ **Node.js** >= 16.x ([Download tại đây](https://nodejs.org/))
- ✅ **Python** >= 3.8 ([Download tại đây](https://www.python.org/downloads/))
# Python
pip install pandas openpyxl

# Node.js
npm install
npx playwright install
Bước 2: Cài đặt Dependencies
npm run setup
Hoặc: py setup.py
Bước 3: Chạy Tests
npm run test:ui      # UI Mode (recommended)
npm test             # Headless mode
npm run test:headed  # Hiển thị browser
Bước 4: Xem Kết Quả
npm run report