import { BasePage } from './BasePage.js';

/**
 * Login Page Object
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        // Selectors
        this.selectors = {
            // Form fields
            usernameInput: 'input[name="taiKhoan"], input#taiKhoan, input[placeholder*="Tài khoản"]',
            passwordInput: 'input[name="matKhau"], input#matKhau, input[type="password"]',

            // Checkboxes
            rememberMeCheckbox: 'input[type="checkbox"], input[name="rememberMe"]',

            // Buttons
            loginButton: 'button:has-text("Đăng nhập"), button[type="submit"]',
            registerLink: 'a:has-text("Đăng ký"), a[href*="sign-up"], a[href*="register"]',
            forgotPasswordLink: 'a:has-text("Quên mật khẩu"), a[href*="forgot-password"]',

            // Error messages
            errorMessage: '.error, .text-danger, .alert-danger, [class*="error"]',
            usernameError: 'input[name="taiKhoan"] ~ .error, input[name="taiKhoan"] + .error',
            passwordError: 'input[name="matKhau"] ~ .error, input[name="matKhau"] + .error',

            // Success messages
            successMessage: '.success, .alert-success',

            // Password toggle
            passwordToggle: 'button[aria-label*="password"], .password-toggle, [class*="eye"]',

            // Form elements
            formTitle: 'h1, h2, .title',
            requiredFields: 'input[required]',
        };
    }

    /**
     * Navigate to login page
     */
    async navigate() {
        await this.goto('/sign-in');
        await this.waitForNavigation();
    }

    /**
     * Login with credentials
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember me option
     */
    async login(username, password, rememberMe = false) {
        if (username) await this.fill(this.selectors.usernameInput, username);
        if (password) await this.fill(this.selectors.passwordInput, password);

        if (rememberMe) {
            await this.click(this.selectors.rememberMeCheckbox);
        }

        await this.click(this.selectors.loginButton);
    }

    /**
     * Check if login was successful
     * @returns {Promise<boolean>}
     */
    async isLoginSuccessful() {
        await this.page.waitForTimeout(2000);
        const url = this.getCurrentUrl();
        // Successful login redirects to home page
        return !url.includes('sign-in') && !url.includes('login');
    }

    /**
     * Get login error message
     * @returns {Promise<string>}
     */
    async getLoginError() {
        try {
            await this.waitForElement(this.selectors.errorMessage, 5000);
            return await this.getText(this.selectors.errorMessage);
        } catch {
            return '';
        }
    }

    /**
     * Get field error message
     * @param {string} field - Field name (username or password)
     * @returns {Promise<string>}
     */
    async getFieldError(field) {
        const selector = this.selectors[`${field}Error`];
        try {
            return await this.getText(selector);
        } catch {
            return '';
        }
    }

    /**
     * Click register link
     */
    async clickRegisterLink() {
        await this.click(this.selectors.registerLink);
    }

    /**
     * Click forgot password link
     */
    async clickForgotPasswordLink() {
        await this.click(this.selectors.forgotPasswordLink);
    }

    /**
     * Toggle password visibility
     */
    async togglePasswordVisibility() {
        await this.click(this.selectors.passwordToggle);
    }

    /**
     * Check if password is visible
     * @returns {Promise<boolean>}
     */
    async isPasswordVisible() {
        const type = await this.page.getAttribute(this.selectors.passwordInput, 'type');
        return type === 'text';
    }

    /**
     * Press Enter to login
     */
    async pressEnterToLogin() {
        await this.pressKey('Enter');
    }

    /**
     * Check if on login page
     * @returns {Promise<boolean>}
     */
    async isOnLoginPage() {
        const url = this.getCurrentUrl();
        return url.includes('sign-in') || url.includes('login');
    }

    /**
     * Hover over field
     * @param {string} field - Field name
     */
    async hoverOverField(field) {
        const selector = this.selectors[`${field}Input`];
        await this.hover(selector);
    }

    /**
     * Focus on field
     * @param {string} field - Field name
     */
    async focusOnField(field) {
        const selector = this.selectors[`${field}Input`];
        await this.page.focus(selector);
    }

    async getFormTitle() {
        return await this.getText(this.selectors.formTitle);
    }
}
