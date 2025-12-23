#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automation Testing Tool - Setup & Analysis
==========================================
Script này giúp:
1. Parse Excel test cases thành JSON
2. Analyze test coverage
3. Generate reports

Author: Automation Team
Date: 2025-12-23
"""

import pandas as pd
import json
import os
from pathlib import Path

# ============================================
# CONFIGURATION
# ============================================

EXCEL_FILE = 'TestCase_CAPSTONE 2_Testing 08.xlsx'
OUTPUT_JSON = 'test_cases_clean.json'
CURRENT_AUTOMATED_TESTS = 118  # ⭐ Updated to 118 tests!

# ============================================
# PART 1: PARSE EXCEL TO JSON
# ============================================

def parse_excel_to_json():
    """
    Đọc file Excel và chuyển thành JSON format
    """
    print("=" * 80)
    print("BƯỚC 1: ĐỌC VÀ PARSE EXCEL FILE")
    print("=" * 80)
    
    if not os.path.exists(EXCEL_FILE):
        print(f"❌ Lỗi: Không tìm thấy file {EXCEL_FILE}")
        print(f"   Vui lòng đảm bảo file Excel ở cùng thư mục với script này")
        return False
    
    print(f"✅ Tìm thấy file: {EXCEL_FILE}")
    
    try:
        # Read Excel file
        xls = pd.ExcelFile(EXCEL_FILE)
        print(f"✅ Đọc thành công Excel file")
        print(f"   Tổng số sheets: {len(xls.sheet_names)}")
        print(f"   Sheets: {xls.sheet_names}")
        
        all_sheets_data = {}
        
        for sheet_name in xls.sheet_names:
            print(f"\n   📄 Đang xử lý sheet: {sheet_name}")
            
            # Read sheet
            df_raw = pd.read_excel(xls, sheet_name, header=None)
            
            if len(df_raw) < 3:
                print(f"   ⚠️  Sheet {sheet_name} không có đủ data")
                continue
            
            # Get epic and headers
            epic_title = str(df_raw.iloc[0, 0]) if pd.notna(df_raw.iloc[0, 0]) else "Unknown Epic"
            headers = df_raw.iloc[2].tolist()
            
            # Get data
            df_data = df_raw.iloc[3:].copy()
            df_data.columns = headers
            df_data.reset_index(drop=True, inplace=True)
            
            # Convert to list of dictionaries
            test_cases = []
            
            for idx, row in df_data.iterrows():
                if pd.isna(row.get('ID')):
                    continue
                    
                test_case = {
                    'id': str(row.get('ID', '')).strip() if pd.notna(row.get('ID')) else '',
                    'test_scenario': str(row.get('Test Scenerio', '')).strip() if pd.notna(row.get('Test Scenerio')) else '',
                    'description': str(row.get('Description', '')).strip() if pd.notna(row.get('Description')) else '',
                    'pre_condition': str(row.get('Pre-condition', '')).strip() if pd.notna(row.get('Pre-condition')) else '',
                    'steps': str(row.get('Step', '')).strip() if pd.notna(row.get('Step')) else '',
                    'actual_result': str(row.get('Actual result( kết quả thực tế)', '')).strip() if pd.notna(row.get('Actual result( kết quả thực tế)')) else '',
                    'expected_result': str(row.get('Expected result (kết quả mong đợi)', '')).strip() if pd.notna(row.get('Expected result (kết quả mong đợi)')) else '',
                    'test_data': str(row.get('Test data', '')).strip() if pd.notna(row.get('Test data')) else '',
                    'test_status': str(row.get('Test Status', '')).strip() if pd.notna(row.get('Test Status')) else '',
                    'bug_id': str(row.get('Bug ID', '')).strip() if pd.notna(row.get('Bug ID')) else ''
                }
                
                test_cases.append(test_case)
            
            all_sheets_data[sheet_name] = {
                'epic': epic_title,
                'total_test_cases': len(test_cases),
                'test_cases': test_cases
            }
            
            print(f"   ✅ Parsed {len(test_cases)} test cases")
        
        # Save to JSON
        with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(all_sheets_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'=' * 80}")
        print(f"✅ Đã lưu data vào: {OUTPUT_JSON}")
        print(f"{'=' * 80}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi parse Excel: {str(e)}")
        return False

# ============================================
# PART 2: ANALYZE COVERAGE
# ============================================

def analyze_coverage():
    """
    Phân tích test coverage và generate report
    """
    print("\n" + "=" * 80)
    print("BƯỚC 2: PHÂN TÍCH TEST COVERAGE")
    print("=" * 80)
    
    if not os.path.exists(OUTPUT_JSON):
        print(f"❌ Lỗi: Không tìm thấy file {OUTPUT_JSON}")
        print(f"   Vui lòng chạy parse Excel trước")
        return False
    
    try:
        # Load data
        with open(OUTPUT_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ Đã load {OUTPUT_JSON}")
        
        # Calculate statistics
        total_tests = 0
        stats_by_sheet = {}
        
        for sheet_name, sheet_data in data.items():
            total = len(sheet_data['test_cases'])
            total_tests += total
            
            # Count by status
            passed = len([t for t in sheet_data['test_cases'] if t['test_status'] == 'Passed'])
            failed = len([t for t in sheet_data['test_cases'] if t['test_status'] == 'Failed'])
            blocked = len([t for t in sheet_data['test_cases'] if t['test_status'] == 'Blocked'])
            
            stats_by_sheet[sheet_name] = {
                'total': total,
                'passed': passed,
                'failed': failed,
                'blocked': blocked
            }
        
        # Display summary
        print(f"\n📊 TỔNG QUAN TEST CASES TỪ EXCEL")
        print("=" * 80)
        
        for sheet_name, stats in stats_by_sheet.items():
            print(f"\n📋 {sheet_name}")
            print(f"   Total: {stats['total']}")
            print(f"   - Passed: {stats['passed']}")
            print(f"   - Failed: {stats['failed']}")
            print(f"   - Blocked: {stats['blocked']}")
        
        # Calculate coverage
        automated = CURRENT_AUTOMATED_TESTS
        coverage_percent = (automated / total_tests * 100) if total_tests > 0 else 0
        target_60_percent = int(total_tests * 0.6)
        remaining = target_60_percent - automated
        
        print("\n" + "=" * 80)
        print("🎯 PHÂN TÍCH COVERAGE")
        print("=" * 80)
        print(f"📝 Tổng test cases (Excel):     {total_tests}")
        print(f"✅ Đã automated:                {automated} tests")
        print(f"📈 Coverage hiện tại:           {coverage_percent:.1f}%")
        print(f"🎯 Mục tiêu 60%:                {target_60_percent} tests")
        
        if coverage_percent >= 60:
            print(f"\n{'=' * 80}")
            print(f"🎉🎉🎉 CHÚC MỪNG! ĐÃ VƯỢT MỤC TIÊU 60%! 🎉🎉🎉")
            print(f"{'=' * 80}")
            print(f"✅ Bạn đã đạt {coverage_percent:.1f}% coverage!")
            print(f"✅ Vượt mục tiêu {automated - target_60_percent} tests!")
        else:
            print(f"⚠️  Còn thiếu:                  {remaining} tests để đạt 60%")
        
        # Success breakdown
        print(f"\n📊 PHÂN BỔ THEO MODULE")
        print("=" * 80)
        
        module_coverage = {
            'Đăng ký': {'total': 73, 'automated': 64},
            'Đăng nhập': {'total': 57, 'automated': 50},
            'Đăng xuất & Profile': {'total': 49, 'automated': 4}
        }
        
        for module, info in module_coverage.items():
            coverage = (info['automated'] / info['total'] * 100)
            bar_length = int(coverage / 2)  # Scale to 50 chars max
            bar = '█' * bar_length + '░' * (50 - bar_length)
            print(f"{module:25} [{bar}] {info['automated']:3}/{info['total']:3} ({coverage:5.1f}%)")
        
        print("=" * 80)
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi analyze: {str(e)}")
        return False

# ============================================
# PART 3: GENERATE REPORT
# ============================================

def generate_report():
    """
    Generate detailed coverage report
    """
    print(f"\n{'=' * 80}")
    print("📄 REPORT")
    print("=" * 80)
    print(f"\n✅ Test cases đã được parse vào: {OUTPUT_JSON}")
    print(f"✅ Coverage analysis hoàn tất")
    print(f"\n🚀 SẴN SÀNG CHẠY AUTOMATION TESTS")
    print(f"\nChạy các lệnh sau để test:")
    print(f"   npm test              # Chạy tất cả 118 tests")
    print(f"   npm run test:ui       # UI mode (recommended)")
    print(f"   npm run report        # Xem HTML report")
    print("=" * 80)

# ============================================
# MAIN EXECUTION
# ============================================

def main():
    """
    Main function - chạy tất cả steps
    """
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 20 + "AUTOMATION TESTING SETUP TOOL" + " " * 29 + "║")
    print("╚" + "=" * 78 + "╝")
    print()
    
    # Step 1: Parse Excel
    step1_success = parse_excel_to_json()
    
    if not step1_success:
        print("\n❌ Parse Excel thất bại. Dừng lại.")
        return
    
    # Step 2: Analyze Coverage
    step2_success = analyze_coverage()
    
    if not step2_success:
        print("\n❌ Analysis thất bại.")
        return
    
    # Step 3: Generate Report
    generate_report()
    
    print("\n✅ HOÀN TẤT TẤT CẢ BƯỚC!")
    print()

# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    main()
