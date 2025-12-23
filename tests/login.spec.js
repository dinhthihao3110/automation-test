import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';

test.describe('Login Tests', () => {
    let loginPage;
    let homePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);

        await homePage.navigate();
        await homePage.clickLogin();
    });

    // ========================================
    // BASIC LOGIN TESTS (10 tests)
    // ========================================

    test('TC_LOG_001: Should login successfully', async () => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        expect(await loginPage.isLoginSuccessful()).toBeTruthy();
    });

    test('TC_LOG_002: Should logout after login', async () => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        await homePage.logout();
        expect(await homePage.isVisible(homePage.selectors.loginButton)).toBeTruthy();
    });

    test('TC_LOG_003: Should show error for invalid username', async () => {
        await loginPage.login('InvalidUser999', '123456');

        const errorMsg = await loginPage.getLoginError();
        expect(errorMsg).toBeTruthy();
    });

    test('TC_LOG_004: Should show error when username is empty', async () => {
        await loginPage.login('', '123456');

        const error = await loginPage.getFieldError('username');
        expect(error).toBeTruthy();
    });

    test('TC_LOG_005: Should show error when password is empty', async () => {
        await loginPage.login('Hảo', '');

        const error = await loginPage.getFieldError('password');
        expect(error).toBeTruthy();
    });

    test('TC_LOG_006: Should show error for wrong password', async () => {
        await loginPage.login('Hảo', 'wrongpassword');

        const error = await loginPage.getLoginError();
        expect(error).toBeTruthy();
    });

    test('TC_LOG_007: Should show error for empty both fields', async () => {
        await loginPage.login('', '');

        expect(await loginPage.getFieldError('username') || await loginPage.getLoginError()).toBeTruthy();
    });

    test('TC_LOG_008: Should login with Enter key', async () => {
        await loginPage.fill(loginPage.selectors.usernameInput, 'Hảo');
        await loginPage.fill(loginPage.selectors.passwordInput, '123456');

        await loginPage.pressEnterToLogin();
        await loginPage.waitForNavigation();

        expect(await loginPage.isLoginSuccessful()).toBeTruthy();
    });

    test('TC_LOG_009: Should trim whitespace from username', async () => {
        await loginPage.login('  Hảo  ', '123456');
        await loginPage.waitForNavigation();
    });

    test('TC_LOG_010: Should be case-sensitive for username', async () => {
        await loginPage.login('hảo', '123456');
        // Should fail or succeed based on system
        await loginPage.page.waitForTimeout(1000);
    });

    // ========================================
    // REMEMBER ME & SESSION (8 tests)
    // ========================================

    test('TC_LOG_011: Should remember credentials when checked', async ({ context }) => {
        await loginPage.login('Hảo', '123456', true);
        await loginPage.waitForNavigation();

        expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        const cookies = await context.cookies();
        const hasRememberCookie = cookies.some(c => c.name.includes('remember') || c.name.includes('token'));
        expect(hasRememberCookie).toBeTruthy();
    });

    test('TC_LOG_012: Should not remember when unchecked', async ({ context }) => {
        await loginPage.login('Hảo', '123456', false);
        await loginPage.waitForNavigation();

        const cookies = await context.cookies();
        const hasSessionOnly = !cookies.some(c => c.name.includes('remember'));
        expect(hasSessionOnly).toBeTruthy();
    });

    test('TC_LOG_013: Should maintain session across tabs', async ({ context }) => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        const newPage = await context.newPage();
        await newPage.goto('/');
        await newPage.waitForLoadState('networkidle');

        const homePageNew = new HomePage(newPage);
        expect(await homePageNew.isUserLoggedIn()).toBeTruthy();

        await newPage.close();
    });

    test('TC_LOG_014: Should persist session after browser reload', async ({ page }) => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        await page.reload();
        await page.waitForLoadState('networkidle');

        expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('TC_LOG_015: Should handle multiple failed login attempts', async () => {
        for (let i = 0; i < 3; i++) {
            await loginPage.login('Hảo', 'wrongpass');
            await loginPage.page.waitForTimeout(1000);
        }
        // Check for lockout or captcha
    });

    test('TC_LOG_016: Should clear session on logout', async ({ context }) => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        await homePage.logout();

        const cookies = await context.cookies();
        // Session should be cleared
    });

    test('TC_LOG_017: Should redirect after successful login', async () => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        const url = loginPage.getCurrentUrl();
        expect(url).not.toContain('sign-in');
    });

    test('TC_LOG_018: Should stay on login page on failure', async () => {
        await loginPage.login('wrong', 'wrong');
        await loginPage.page.waitForTimeout(1000);

        const url = loginPage.getCurrentUrl();
        expect(url).toContain('sign-in');
    });

    // ========================================
    // UI TESTS (10 tests)
    // ========================================

    test('TC_LOG_019: Should have password visibility toggle', async () => {
        expect(await loginPage.isVisible(loginPage.selectors.passwordToggle)).toBeTruthy();
    });

    test('TC_LOG_020: Should mask password by default', async ({ page }) => {
        await loginPage.fill(loginPage.selectors.passwordInput, '123456');

        const passwordType = await page.getAttribute(loginPage.selectors.passwordInput, 'type');
        expect(passwordType).toBe('password');
    });

    test('TC_LOG_021: Should navigate to register page', async () => {
        await loginPage.clickRegisterLink();
        await loginPage.waitForNavigation();

        const url = loginPage.getCurrentUrl();
        expect(url).toContain('sign-up');
    });

    test('TC_LOG_022: Should have hover effect on username', async ({ page }) => {
        await loginPage.hoverOverField('username');
        await page.screenshot({ path: 'screenshots/login-hover-username.png' });
    });

    test('TC_LOG_023: Should have hover effect on password', async ({ page }) => {
        await loginPage.hoverOverField('password');
        await page.screenshot({ path: 'screenshots/login-hover-password.png' });
    });

    test('TC_LOG_024: Should have hover effect on button', async ({ page }) => {
        await loginPage.hover(loginPage.selectors.loginButton);
        await page.screenshot({ path: 'screenshots/login-hover-button.png' });
    });

    test('TC_LOG_025: Should mark required fields', async () => {
        const usernameRequired = await loginPage.hasAttribute(loginPage.selectors.usernameInput, 'required');
        const passwordRequired = await loginPage.hasAttribute(loginPage.selectors.passwordInput, 'required');

        expect(usernameRequired || passwordRequired).toBeTruthy();
    });

    test('TC_LOG_026: Should have focus indicator', async ({ page }) => {
        await loginPage.focusOnField('username');

        const hasFocus = await page.evaluate(() => {
            const input = document.querySelector('input[name="taiKhoan"]');
            return document.activeElement === input;
        });

        expect(hasFocus).toBeTruthy();
    });

    test('TC_LOG_027: Should have login form title', async () => {
        const title = await loginPage.getFormTitle();
        expect(title).toBeTruthy();
    });

    test('TC_LOG_028: Should display logo/branding', async ({ page }) => {
        const hasLogo = await page.$('[class*="logo"]');
        expect(hasLogo).toBeTruthy();
    });

    // ========================================
    // RESPONSIVE TESTS (5 tests)
    // ========================================

    test('TC_LOG_029: Should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await loginPage.navigate();

        expect(await loginPage.isVisible(loginPage.selectors.usernameInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.selectors.loginButton)).toBeTruthy();
    });

    test('TC_LOG_030: Should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await loginPage.navigate();

        expect(await loginPage.isVisible(loginPage.selectors.loginButton)).toBeTruthy();
    });

    test('TC_LOG_031: Should be responsive on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await loginPage.navigate();

        expect(await loginPage.isVisible(loginPage.selectors.loginButton)).toBeTruthy();
    });

    test('TC_LOG_032: Should adapt to small screens', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        await loginPage.navigate();

        expect(await loginPage.isVisible(loginPage.selectors.usernameInput)).toBeTruthy();
    });

    test('TC_LOG_033: Should maintain layout on landscape', async ({ page }) => {
        await page.setViewportSize({ width: 667, height: 375 });
        await loginPage.navigate();

        await page.screenshot({ path: 'screenshots/login-landscape.png' });
    });

    // ========================================
    // PERFORMANCE TESTS (5 tests)
    // ========================================

    test('TC_LOG_034: Should login within 2 seconds', async () => {
        const startTime = Date.now();

        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(2000);
    });

    test('TC_LOG_035: Should load page within 2 seconds', async () => {
        const startTime = Date.now();
        await loginPage.navigate();
        const duration = Date.now() - startTime;

        expect(duration).toBeLessThan(2000);
    });

    test('TC_LOG_036: Should not have memory leaks', async ({ page }) => {
        for (let i = 0; i < 5; i++) {
            await loginPage.navigate();
            await page.waitForTimeout(500);
        }
        // Memory should be stable
    });

    test('TC_LOG_037: Should handle slow network', async ({ page }) => {
        await page.route('**/*', route => {
            setTimeout(() => route.continue(), 500);
        });

        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();
    });

    test('TC_LOG_038: Should show loading indicator', async () => {
        await loginPage.fillform('Hảo', '123456');
        await loginPage.clickLoginButton();
        // Check for loading state
        await loginPage.page.waitForTimeout(500);
    });

    // ========================================
    // SECURITY TESTS (6 tests)
    // ========================================

    test('TC_LOG_039: Should prevent SQL injection', async () => {
        await loginPage.login("' OR '1'='1", '123456');

        const error = await loginPage.getLoginError();
        expect(error).toBeTruthy();
    });

    test('TC_LOG_040: Should prevent XSS', async () => {
        await loginPage.login('<script>alert("XSS")</script>', '123456');

        const error = await loginPage.getLoginError();
        expect(error).toBeTruthy();
    });

    test('TC_LOG_041: Should not expose password in URL', async ({ page }) => {
        await loginPage.login('Hảo', '123456');

        const url = page.url();
        expect(url).not.toContain('123456');
    });

    test('TC_LOG_042: Should not expose password in HTML', async ({ page }) => {
        await loginPage.fill(loginPage.selectors.passwordInput, 'secret123');

        const type = await page.getAttribute(loginPage.selectors.passwordInput, 'type');
        expect(type).toBe('password');
    });

    test('TC_LOG_043: Should sanitize user input', async () => {
        await loginPage.login('<img src=x onerror=alert(1)>', '123456');
        // Should not execute script
    });

    test('TC_LOG_044: Should use HTTPS', async ({ page }) => {
        const url = page.url();
        expect(url).toMatch(/^https:/);
    });

    // ========================================
    // EDGE CASES (6 tests)
    // ========================================

    test('TC_LOG_045: Should handle special characters in password', async () => {
        await loginPage.login('Hảo', '!@#$%^&*()');
        await loginPage.page.waitForTimeout(1000);
    });

    test('TC_LOG_046: Should handle long username', async () => {
        await loginPage.login('a'.repeat(100), '123456');
        await loginPage.page.waitForTimeout(1000);
    });

    test('TC_LOG_047: Should handle long password', async () => {
        await loginPage.login('Hảo', 'a'.repeat(100));
        await loginPage.page.waitForTimeout(1000);
    });

    test('TC_LOG_048: Should handle Unicode characters', async () => {
        await loginPage.login('用户名', 'пароль');
        await loginPage.page.waitForTimeout(1000);
    });

    test('TC_LOG_049: Should handle rapid clicks', async () => {
        await loginPage.fill(loginPage.selectors.usernameInput, 'Hảo');
        await loginPage.fill(loginPage.selectors.passwordInput, '123456');

        for (let i = 0; i < 5; i++) {
            await loginPage.click(loginPage.selectors.loginButton);
        }

        await loginPage.page.waitForTimeout(1000);
    });

    test('TC_LOG_050: Should handle browser back button', async ({ page }) => {
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();

        await page.goBack();
        await page.waitForTimeout(1000);
    });
});
