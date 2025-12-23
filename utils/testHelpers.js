import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load test cases from JSON file
 * @returns {Object} Test cases grouped by sheet
 */
export function loadTestCases() {
    const filePath = path.join(__dirname, '../test_cases_clean.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

/**
 * Get test cases by status
 * @param {string} sheetName - Sheet name
 * @param {string} status - Test status (Passed, Failed, Blocked)
 * @returns {Array} Filtered test cases
 */
export function getTestCasesByStatus(sheetName, status) {
    const allTestCases = loadTestCases();
    const sheet = allTestCases[sheetName];

    if (!sheet) return [];

    return sheet.test_cases.filter(tc => tc.test_status === status);
}

/**
 * Get test case by ID
 * @param {string} testId - Test case ID
 * @returns {Object|null} Test case object
 */
export function getTestCaseById(testId) {
    const allTestCases = loadTestCases();

    for (const sheetName in allTestCases) {
        const sheet = allTestCases[sheetName];
        const testCase = sheet.test_cases.find(tc => tc.id === testId);
        if (testCase) {
            return { ...testCase, sheetName };
        }
    }

    return null;
}

/**
 * Parse test steps from string
 * @param {string} stepsString - Steps as string
 * @returns {Array} Array of step objects
 */
export function parseTestSteps(stepsString) {
    if (!stepsString) return [];

    const steps = stepsString.split('\n').filter(step => step.trim());
    return steps.map((step, index) => ({
        number: index + 1,
        description: step.replace(/^\d+\.\s*/, '').trim()
    }));
}

/**
 * Parse pre-condition to extract test data
 * @param {string} preCondition - Pre-condition string
 * @returns {Object} Extracted test data
 */
export function parsePreCondition(preCondition) {
    const data = {};

    if (!preCondition) return data;

    // Extract username
    const usernameMatch = preCondition.match(/Tài khoản\s*[=:"]?\s*"?([^"\n]+)"?/i);
    if (usernameMatch) data.username = usernameMatch[1].trim();

    // Extract password
    const passwordMatch = preCondition.match(/Mật khẩu\s*[=:"]?\s*"?([^"\n]+)"?/i);
    if (passwordMatch) data.password = passwordMatch[1].trim();

    // Extract email
    const emailMatch = preCondition.match(/Email\s*[=:"]?\s*"?([^"\n]+)"?/i);
    if (emailMatch) data.email = emailMatch[1].trim();

    // Extract full name
    const fullNameMatch = preCondition.match(/Họ\s*[Tt]ên\s*[=:"]?\s*"?([^"\n]+)"?/i);
    if (fullNameMatch) data.fullName = fullNameMatch[1].trim();

    return data;
}

/**
 * Generate random test data
 * @returns {Object} Random test data
 */
export function generateRandomTestData() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);

    return {
        username: `test_user_${timestamp}`,
        password: 'Test@123456',
        fullName: `Nguyễn Văn Test ${random}`,
        email: `test${timestamp}@example.com`
    };
}

/**
 * Create screenshots directory if not exists
 */
export function ensureScreenshotsDir() {
    const dir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Get test data from test case
 * @param {Object} testCase - Test case object
 * @returns {Object} Test data
 */
export function getTestDataFromCase(testCase) {
    const preConditionData = parsePreCondition(testCase.pre_condition);
    const testData = testCase.test_data ? parsePreCondition(testCase.test_data) : {};

    return {
        ...preConditionData,
        ...testData
    };
}

/**
 * Wait for a specific time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise}
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await wait(delay * Math.pow(2, i));
        }
    }
}
