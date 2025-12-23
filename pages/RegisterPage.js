import { BasePage } from './BasePage.js';

/**
 * Register Page Object
 * Handles all interactions with the registration page
 */
export class RegisterPage extends BasePage {
    constructor(page) {
        super(page);

        // Selectors
        this.selectors = {
            // Form fields
            usernameInput: 'input[name="taiKhoan"], input#taiKhoan, input[placeholder*="Tài khoản"]',
            passwordInput: 'input[name="matKhau"], input#matKhau, input[type="password"]:first-of-type',
            confirmPasswordInput: 'input[name="nhapLaiMatKhau"], input#nhapLaiMatKhau, input[type="password"]:last-of-type',
            fullNameInput: 'input[name="hoTen"], input#hoTen, input[placeholder*="Họ tên"]',
            emailInput: 'input[name="email"], input#email, input[type="email"]',

            // Buttons
            registerButton: 'button:has-text("Đăng ký"), button[type="submit"]',
            loginLink: 'a:has-text("Đăng nhập"), a[href*="login"], a[href*="sign-in"]',

            // Error messages
            errorMessage: '.error, .text-danger, .invalid-feedback, [class*="error"]',
            usernameError: 'input[name="taiKhoan"] ~ .error, input[name="taiKhoan"] + .error',
            passwordError: 'input[name="matKhau"] ~ .error, input[name="matKhau"] + .error',
            confirmPasswordError: 'input[name="nhapLaiMatKhau"] ~ .error',
            fullNameError: 'input[name="hoTen"] ~ .error, input[name="hoTen"] + .error',
            emailError: 'input[name="email"] ~ .error, input[name="email"] + .error',

            // Success messages
            successMessage: '.success, .alert-success, [class*="success"]',

            // Form elements
            formTitle: 'h1, h2, .title, [class*="title"]',
            requiredFields: 'input[required], input[aria-required="true"]',
            passwordToggle: 'button[aria-label*="password"], .password-toggle, [class*="eye"]',

            // Loading
            loadingIndicator: '.loading, .spinner, [class*="loading"]',
        };
    }

    /**
     * Navigate to register page
     */
    async navigate() {
        await this.goto('/sign-up');
        await this.waitForNavigation();
    }

    /**
     * Fill registration form
     * @param {Object} data - Registration data
     * @param {string} data.username - Username
     * @param {string} data.password - Password
     * @param {string} data.confirmPassword - Confirm password
     * @param {string} data.fullName - Full name
     * @param {string} data.email - Email
     */
    async fillRegistrationForm({ username, password, confirmPassword, fullName, email }) {
        if (username) await this.fill(this.selectors.usernameInput, username);
        if (password) await this.fill(this.selectors.passwordInput, password);
        if (confirmPassword) await this.fill(this.selectors.confirmPasswordInput, confirmPassword);
        if (fullName) await this.fill(this.selectors.fullNameInput, fullName);
        if (email) await this.fill(this.selectors.emailInput, email);
    }

    /**
     * Click register button
     */
    async clickRegister() {
        await this.click(this.selectors.registerButton);
    }

    /**
     * Complete registration
     * @param {Object} data - Registration data
     */
    async register(data) {
        await this.fillRegistrationForm(data);
        await this.clickRegister();
    }

    /**
     * Check if on register page
     * @returns {Promise<boolean>}
     */
    async isOnRegisterPage() {
        const url = this.getCurrentUrl();
        return url.includes('sign-up') || url.includes('register') || url.includes('dang-ky');
    }

    /**
     * Click login link
     */
    async clickLoginLink() {
        await this.click(this.selectors.loginLink);
    }

    /**
     * Get error message for specific field
     * @param {string} field - Field name (username, password, email, etc.)
     * @returns {Promise<string>}
     */
    async getFieldError(field) {
        const selector = this.selectors[`${field}Error`];
        if (!selector) return '';

        try {
            return await this.getText(selector);
        } catch {
            return '';
        }
    }

    /**
     * Check if field has error
     * @param {string} field - Field name
     * @returns {Promise<boolean>}
     */
    async hasFieldError(field) {
        const selector = this.selectors[`${field}Error`];
        if (!selector) return false;

        return await this.isVisible(selector);
    }

    /**
     * Get success message
     * @returns {Promise<string>}
     */
    async getSuccessMessage() {
        try {
            await this.waitForElement(this.selectors.successMessage, 5000);
            return await this.getText(this.selectors.successMessage);
        } catch {
            return '';
        }
    }

    /**
     * Check if registration was successful
     * @returns {Promise<boolean>}
     */
    async isRegistrationSuccessful() {
        // Check if redirected to login page
        await this.page.waitForTimeout(2000);
        const url = this.getCurrentUrl();
        return url.includes('sign-in') || url.includes('login') || url.includes('dang-nhap');
    }

    /**
     * Toggle password visibility
     */
    async togglePasswordVisibility() {
        await this.click(this.selectors.passwordToggle);
    }

    /**
     * Press Enter key (for testing Enter as submit)
     */
    async pressEnter() {
        await this.pressKey('Enter');
    }

    /**
     * Check if required fields are marked
     * @returns {Promise<boolean>}
     */
    async areRequiredFieldsMarked() {
        const requiredFields = await this.page.$$(this.selectors.requiredFields);
        return requiredFields.length > 0;
    }

    /**
     * Get form title
     * @returns {Promise<string>}
     */
    async getFormTitle() {
        return await this.getText(this.selectors.formTitle);
    }

    /**
     * Check if loading indicator is visible
     * @returns {Promise<boolean>}
     */
    async isLoading() {
        return await this.isVisible(this.selectors.loadingIndicator);
    }

    /**
     * Wait for loading to complete
     */
    async waitForLoadingComplete() {
        try {
            await this.page.waitForSelector(this.selectors.loadingIndicator, {
                state: 'hidden',
                timeout: 10000
            });
        } catch {
            // Loading indicator might not exist
        }
    }

    /**
     * Hover over field to check hover effects
     * @param {string} field - Field name
     */
    async hoverOverField(field) {
        const selector = this.selectors[`${field}Input`];
        await this.hover(selector);
    }

    /**
     * Focus on field to check focus effects
     * @param {string} field - Field name
     */
    async focusOnField(field) {
        const selector = this.selectors[`${field}Input`];
        await this.page.focus(selector);
    }
}
