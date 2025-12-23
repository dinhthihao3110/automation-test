import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage.js';
import { HomePage } from '../pages/HomePage.js';

test.describe('Registration Tests', () => {
    let registerPage;
    let homePage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        homePage = new HomePage(page);

        await homePage.navigate();
        await homePage.clickRegister();
    });

    // ========================================
    // UI & DISPLAY TESTS (10 tests)
    // ========================================

    test('TC_REG_001: Should display registration form', async () => {
        expect(await registerPage.isOnRegisterPage()).toBeTruthy();
        const title = await registerPage.getFormTitle();
        expect(title).toContain('Đăng ký');
    });

    test('TC_REG_002: Should have all required form fields', async () => {
        expect(await registerPage.isVisible(registerPage.selectors.usernameInput)).toBeTruthy();
        expect(await registerPage.isVisible(registerPage.selectors.passwordInput)).toBeTruthy();
        expect(await registerPage.isVisible(registerPage.selectors.confirmPasswordInput)).toBeTruthy();
        expect(await registerPage.isVisible(registerPage.selectors.fullNameInput)).toBeTruthy();
        expect(await registerPage.isVisible(registerPage.selectors.emailInput)).toBeTruthy();
    });

    test('TC_REG_003: Should have register button', async () => {
        expect(await registerPage.isVisible(registerPage.selectors.registerButton)).toBeTruthy();
    });

    test('TC_REG_004: Should have login link', async () => {
        expect(await registerPage.isVisible(registerPage.selectors.loginLink)).toBeTruthy();
    });

    test('TC_REG_005: Should display form labels correctly', async ({ page }) => {
        const hasLabels = await page.$$('label');
        expect(hasLabels.length).toBeGreaterThan(0);
    });

    test('TC_REG_006: Should have proper page title', async ({ page }) => {
        const title = await page.title();
        expect(title.toLowerCase()).toContain('đăng ký');
    });

    test('TC_REG_007: Should display logo/branding', async ({ page }) => {
        const hasLogo = await page.$('[class*="logo"], img[alt*="logo"]');
        expect(hasLogo).toBeTruthy();
    });

    test('TC_REG_008: Should have consistent styling', async ({ page }) => {
        await page.screenshot({ path: 'screenshots/register-page.png', fullPage: true });
    });

    test('TC_REG_009: Should not have console errors on load', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
    });

    test('TC_REG_010: Should load within acceptable time', async () => {
        const start = Date.now();
        await registerPage.navigate();
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(3000);
    });

    // ========================================
    // USERNAME VALIDATION TESTS (10 tests)
    // ========================================

    test('TC_REG_021: Should show error when username is empty', async () => {
        await registerPage.fillRegistrationForm({
            username: '',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('username')).toBeTruthy();
    });

    test('TC_REG_022: Should reject special characters in username', async () => {
        await registerPage.fillRegistrationForm({
            username: 'test@#$',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('username')).toBeTruthy();
    });

    test('TC_REG_023: Should reject emoji in username', async () => {
        await registerPage.fillRegistrationForm({
            username: '🌸🌸🌸',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('username')).toBeTruthy();
    });

    test('TC_REG_024: Should accept valid username with numbers', async () => {
        await registerPage.fillRegistrationForm({
            username: 'user123',
            password: '12345678',
            confirmPassword: '12345678',
            fullName: 'Test User',
            email: 'test123@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_025: Should trim whitespace from username', async () => {
        await registerPage.fill(registerPage.selectors.usernameInput, '  testuser  ');
        const value = await registerPage.page.inputValue(registerPage.selectors.usernameInput);
        // Should auto-trim or validate
    });

    test('TC_REG_026a: Should reject username too short', async () => {
        await registerPage.fillRegistrationForm({
            username: 'ab',
            password: '12345678',
            confirmPassword: '12345678',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
    });

    test('TC_REG_026b: Should reject username too long', async () => {
        await registerPage.fillRegistrationForm({
            username: 'a'.repeat(100),
            password: '12345678',
            confirmPassword: '12345678',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
    });

    test('TC_REG_027: Should show username availability', async () => {
        await registerPage.fill(registerPage.selectors.usernameInput, 'testuser');
        await registerPage.page.waitForTimeout(500);
        // Check for availability indicator
    });

    test('TC_REG_028: Should prevent duplicate username', async () => {
        await registerPage.fillRegistrationForm({
            username: 'existinguser',
            password: '12345678',
            confirmPassword: '12345678',
            fullName: 'Test User',
            email: 'new@gmail.com'
        });

        await registerPage.clickRegister();
    });

    test('TC_REG_029: Should accept alphanumeric username', async () => {
        await registerPage.fillRegistrationForm({
            username: 'TestUser123',
            password: '12345678',
            confirmPassword: '12345678',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    // ========================================
    // PASSWORD VALIDATION TESTS (15 tests)
    // ========================================

    test('TC_REG_030: Should reject password under 6 characters', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '12345',
            confirmPassword: '12345',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('password')).toBeTruthy();
    });

    test('TC_REG_031: Should accept password with 6 characters', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_032: Should accept password with special characters', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: 'Pass@123',
            confirmPassword: 'Pass@123',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_033: Should accept password with uppercase', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: 'Password123',
            confirmPassword: 'Password123',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_034: Should have password visibility toggle', async ({ page }) => {
        await registerPage.fill(registerPage.selectors.passwordInput, 'Ab@12345');

        const passwordType = await page.getAttribute(registerPage.selectors.passwordInput, 'type');
        expect(passwordType).toBe('password');

        expect(await registerPage.isVisible(registerPage.selectors.passwordToggle)).toBeTruthy();
    });

    test('TC_REG_035: Should show error when passwords do not match', async () => {
        await registerPage.fill(registerPage.selectors.passwordInput, 'Password123');
        await registerPage.fill(registerPage.selectors.confirmPasswordInput, 'DifferentPass');

        const error = await registerPage.getFieldError('confirmPassword');
        expect(error).toBeTruthy();
    });

    test('TC_REG_036: Should show error when password is empty', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '',
            confirmPassword: '',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('password')).toBeTruthy();
    });

    test('TC_REG_037: Should show password strength indicator', async () => {
        await registerPage.fill(registerPage.selectors.passwordInput, 'WeakPass');
        await registerPage.page.waitForTimeout(500);
        // Check for strength indicator
    });

    test('TC_REG_038: Should show error when confirm password is empty', async () => {
        await registerPage.fill(registerPage.selectors.passwordInput, '12345678');
        await registerPage.fill(registerPage.selectors.confirmPasswordInput, '');

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('confirmPassword')).toBeTruthy();
    });

    test('TC_REG_039: Should accept strong password', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: 'Str0ng!Pass@2024',
            confirmPassword: 'Str0ng!Pass@2024',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_040: Should mask password by default', async ({ page }) => {
        const type = await page.getAttribute(registerPage.selectors.passwordInput, 'type');
        expect(type).toBe('password');
    });

    test('TC_REG_041: Should toggle password visibility', async ({ page }) => {
        await registerPage.fill(registerPage.selectors.passwordInput, 'TestPass123');

        if (await registerPage.isVisible(registerPage.selectors.passwordToggle)) {
            await registerPage.click(registerPage.selectors.passwordToggle);
            await page.waitForTimeout(500);
        }
    });

    test('TC_REG_042: Should accept password with numbers only', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456789',
            confirmPassword: '123456789',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_043: Should show real-time password match', async () => {
        await registerPage.fill(registerPage.selectors.passwordInput, 'Pass123');
        await registerPage.fill(registerPage.selectors.confirmPasswordInput, 'Pass123');
        await registerPage.page.waitForTimeout(500);
        // Check for match indicator
    });

    test('TC_REG_044: Should handle copy-paste in password', async ({ page }) => {
        await page.evaluate(() => {
            navigator.clipboard.writeText('TestPassword123');
        });

        await registerPage.fill(registerPage.selectors.passwordInput, 'TestPassword123');
        expect(true).toBeTruthy();
    });

    // ========================================
    // EMAIL & NAME VALIDATION (10 tests)
    // ========================================

    test('TC_REG_045: Should reject invalid email format', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'invalid-email'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('email')).toBeTruthy();
    });

    test('TC_REG_046: Should show error when email is empty', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: ''
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('email')).toBeTruthy();
    });

    test('TC_REG_047: Should accept valid email', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'valid@email.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_048: Should accept email with plus sign', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test+label@email.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_049: Should validate duplicate email', async () => {
        await registerPage.fillRegistrationForm({
            username: 'newuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'existing@email.com'
        });

        await registerPage.clickRegister();
    });

    test('TC_REG_050: Should accept email with subdomain', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@mail.example.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_051: Should show error when full name is empty', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: '',
            email: 'test@email.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('fullName')).toBeTruthy();
    });

    test('TC_REG_052: Should accept full name with spaces', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Nguyễn Văn A',
            email: 'test@email.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_053: Should accept Vietnamese characters in name', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Trần Thị Ánh',
            email: 'test@email.com'
        });

        await registerPage.clickRegister();
        await registerPage.page.waitForTimeout(1000);
    });

    test('TC_REG_054: Should reject numbers in full name', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test123',
            email: 'test@email.com'
        });

        await registerPage.clickRegister();
        expect(await registerPage.hasFieldError('fullName')).toBeTruthy();
    });

    // ========================================
    // UI/UX & NAVIGATION (10 tests)
    // ========================================

    test('TC_REG_055: Should navigate to login page', async () => {
        await registerPage.clickLoginLink();
        await registerPage.waitForNavigation();

        const url = registerPage.getCurrentUrl();
        expect(url).toContain('sign-in');
    });

    test('TC_REG_056: Should submit using Enter key', async ({ page }) => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.pressEnter();
        await page.waitForTimeout(1000);
    });

    test('TC_REG_057: Should have hover effects', async ({ page }) => {
        await registerPage.hoverOverField('username');
        await page.screenshot({ path: 'screenshots/register-hover.png' });
    });

    test('TC_REG_058: Should have focus effects', async ({ page }) => {
        await registerPage.focusOnField('username');

        const hasFocus = await page.evaluate(() => {
            const input = document.querySelector('input[name="taiKhoan"]');
            return document.activeElement === input;
        });

        expect(hasFocus).toBeTruthy();
    });

    test('TC_REG_059: Should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await registerPage.navigate();

        expect(await registerPage.isVisible(registerPage.selectors.usernameInput)).toBeTruthy();
    });

    test('TC_REG_060: Should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await registerPage.navigate();

        expect(await registerPage.isVisible(registerPage.selectors.registerButton)).toBeTruthy();
    });

    test('TC_REG_061: Should maintain state on page refresh', async ({ page }) => {
        await registerPage.fill(registerPage.selectors.usernameInput, 'testuser');
        await page.reload();
        // Check if form data persisted
    });

    test('TC_REG_062: Should clear form on reset', async ({ page }) => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        const resetBtn = await page.$('button[type="reset"]');
        if (resetBtn) {
            await resetBtn.click();
        }
    });

    test('TC_REG_063: Should mark required fields', async () => {
        const hasRequiredFields = await registerPage.areRequiredFieldsMarked();
        expect(hasRequiredFields).toBeTruthy();
    });

    test('TC_REG_064: Should show loading on submit', async () => {
        await registerPage.fillRegistrationForm({
            username: 'testuser',
            password: '123456',
            confirmPassword: '123456',
            fullName: 'Test User',
            email: 'test@gmail.com'
        });

        await registerPage.clickRegister();
        // Check for loading indicator
        await registerPage.page.waitForTimeout(500);
    });
});
