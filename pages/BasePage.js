/**
 * Base Page Object
 * Contains common methods used across all pages
 */
export class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigate to a specific path
     * @param {string} path - URL path
     */
    async goto(path = '/') {
        await this.page.goto(path);
    }

    /**
     * Wait for element to be visible
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForElement(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }

    /**
     * Fill input field
     * @param {string} selector - Input selector
     * @param {string} value - Value to fill
     */
    async fill(selector, value) {
        await this.page.fill(selector, value);
    }

    /**
     * Click element
     * @param {string} selector - Element selector
     */
    async click(selector) {
        await this.page.click(selector);
    }

    /**
     * Get element text
     * @param {string} selector - Element selector
     * @returns {Promise<string>}
     */
    async getText(selector) {
        return await this.page.textContent(selector);
    }

    /**
     * Check if element is visible
     * @param {string} selector - Element selector
     * @returns {Promise<boolean>}
     */
    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    /**
     * Take screenshot
     * @param {string} name - Screenshot name
     */
    async screenshot(name) {
        await this.page.screenshot({
            path: `screenshots/${name}.png`,
            fullPage: true
        });
    }

    /**
     * Wait for navigation
     */
    async waitForNavigation() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get current URL
     * @returns {string}
     */
    getCurrentUrl() {
        return this.page.url();
    }

    /**
     * Press keyboard key
     * @param {string} key - Key to press (e.g., 'Enter', 'Tab')
     */
    async pressKey(key) {
        await this.page.keyboard.press(key);
    }

    /**
     * Hover over element
     * @param {string} selector - Element selector
     */
    async hover(selector) {
        await this.page.hover(selector);
    }

    /**
     * Check if element has attribute
     * @param {string} selector - Element selector
     * @param {string} attribute - Attribute name
     * @returns {Promise<boolean>}
     */
    async hasAttribute(selector, attribute) {
        const value = await this.page.getAttribute(selector, attribute);
        return value !== null;
    }

    /**
     * Get error message from page
     * @param {string} selector - Error message selector
     * @returns {Promise<string>}
     */
    async getErrorMessage(selector) {
        await this.waitForElement(selector);
        return await this.getText(selector);
    }
}
