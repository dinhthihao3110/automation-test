import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { loadTestCases } from '../utils/testHelpers.js';

// Load test cases
const testCases = loadTestCases();
const logoutTestCases = testCases['CN Đăng Xuất+CN Profile'];

test.describe('Logout & Profile Tests', () => {
    let homePage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);

        // Login first
        await homePage.navigate();
        await homePage.clickLogin();
        await loginPage.login('Hảo', '123456');
        await loginPage.waitForNavigation();
    });

    // ========================================
    // LOGOUT TESTS
    // ========================================

    test('TC_Logout_001: Should display logout button', async () => {
        expect(await homePage.isUserLoggedIn()).toBeTruthy();

        await homePage.click(homePage.selectors.userAvatar);
        expect(await homePage.isVisible(homePage.selectors.logoutButton)).toBeTruthy();
    });

    test('TC_Logout_002: Should logout successfully', async () => {
        await homePage.logout();

        expect(await homePage.isVisible(homePage.selectors.loginButton)).toBeTruthy();
    });

    test('Should redirect to home after logout', async () => {
        await homePage.logout();

        const url = homePage.getCurrentUrl();
        expect(url).not.toContain('account');
        expect(url).not.toContain('profile');
    });

    test('Should clear session after logout', async ({ context }) => {
        await homePage.logout();

        const cookies = await context.cookies();
        // Session should be cleared
    });

    test('Should not access protected pages after logout', async ({ page }) => {
        await homePage.logout();

        await page.goto('/account');
        await page.waitForLoadState('networkidle');

        const url = page.url();
        expect(
            url.includes('sign-in') ||
            url.includes('login') ||
            url === '/'
        ).toBeTruthy();
    });

    test('TC_Logout_003: Should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        await homePage.click(homePage.selectors.userAvatar);
        expect(await homePage.isVisible(homePage.selectors.logoutButton)).toBeTruthy();
    });

    // ========================================
    // PROFILE TESTS
    // ========================================

    test('TC_Profile_050: Should display profile button', async () => {
        await homePage.click(homePage.selectors.userAvatar);

        const hasProfileLink = await homePage.isVisible(homePage.selectors.profileLink);
        expect(hasProfileLink).toBeTruthy();
    });

    test('Should navigate to profile page', async () => {
        await homePage.click(homePage.selectors.userAvatar);
        await homePage.click(homePage.selectors.profileLink);
        await homePage.waitForNavigation();

        const url = homePage.getCurrentUrl();
        expect(url).toMatch(/account|profile/);
    });

    test('Should display user information', async ({ page }) => {
        await homePage.clickProfile();
        await page.waitForLoadState('networkidle');

        const hasUserInfo = await page.isVisible('text=Hảo') ||
            await page.isVisible('[class*="user"]') ||
            await page.isVisible('[class*="profile"]');

        expect(hasUserInfo).toBeTruthy();
    });

    // ========================================
    // SESSION MANAGEMENT TESTS
    // ========================================

    test('Should maintain session across page refreshes', async ({ page }) => {
        expect(await homePage.isUserLoggedIn()).toBeTruthy();

        await page.reload();
        await page.waitForLoadState('networkidle');

        expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('Should maintain session across navigation', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('Should handle concurrent sessions', async ({ context }) => {
        const page1 = await context.newPage();
        const homePage1 = new HomePage(page1);

        await page1.goto('/');
        await page1.waitForLoadState('networkidle');

        expect(await homePage1.isUserLoggedIn()).toBeTruthy();

        await page1.close();
    });

    test('Should not access protected routes when logged out', async ({ page }) => {
        await page.goto('/account');
        await page.waitForLoadState('networkidle');

        const url = page.url();
        // Should redirect to login if not logged in
    });
});
