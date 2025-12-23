import { BasePage } from './BasePage.js';

/**
 * Home Page Object
 * Handles interactions with the home page including navigation and logout
 */
export class HomePage extends BasePage {
    constructor(page) {
        super(page);

        // Selectors
        this.selectors = {
            // Header
            loginButton: 'button:has-text("Đăng nhập"), a:has-text("Đăng nhập")',
            registerButton: 'button:has-text("Đăng ký"), a:has-text("Đăng ký")',
            userAvatar: '.avatar, .user-avatar, [class*="avatar"]',
            userName: '.user-name, .username, [class*="user-name"]',

            // Logout
            logoutButton: 'button:has-text("Đăng xuất"), a:has-text("Đăng xuất")',
            logoutConfirmButton: 'button:has-text("Đồng ý"), button:has-text("OK")',

            // Navigation
            profileLink: 'a:has-text("Profile"), a[href*="profile"], a[href*="account"]',

            // Modals
            logoutModal: '.modal, [role="dialog"]',
        };
    }

    /**
     * Navigate to home page
     */
    async navigate() {
        await this.goto('/');
        await this.waitForNavigation();
    }

    /**
     * Click login button
     */
    async clickLogin() {
        await this.click(this.selectors.loginButton);
    }

    /**
     * Click register button
     */
    async clickRegister() {
        await this.click(this.selectors.registerButton);
    }

    /**
     * Check if user is logged in
     * @returns {Promise<boolean>}
     */
    async isUserLoggedIn() {
        return await this.isVisible(this.selectors.userAvatar);
    }

    /**
     * Logout user
     */
    async logout() {
        // Click user avatar/name
        await this.click(this.selectors.userAvatar);

        // Click logout button
        await this.click(this.selectors.logoutButton);

        // Confirm logout if modal appears
        try {
            await this.click(this.selectors.logoutConfirmButton);
        } catch {
            // No confirmation modal
        }

        await this.waitForNavigation();
    }

    /**
     * Get user name
     * @returns {Promise<string>}
     */
    async getUserName() {
        return await this.getText(this.selectors.userName);
    }

    /**
     * Click profile link
     */
    async clickProfile() {
        await this.click(this.selectors.userAvatar);
        await this.click(this.selectors.profileLink);
    }
}
