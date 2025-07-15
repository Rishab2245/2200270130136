const axios = require('axios');

// Valid values for stack, level, and package parameters
const VALID_VALUES = {
    stacks: ['backend', 'frontend'],
    levels: ['debug', 'info', 'warn', 'error', 'fatal'],
    packages: {
        backend: [
            'cache',
            'controller',
            'cron_job',
            'db',
            'domain',
            'handler',
            'repository',
            'route',
            'service'
        ],
        frontend: [
            'api',
            'component',
            'hook',
            'page',
            'state',
            'style'
        ],
        common: [
            'auth',
            'config',
            'middleware',
            'utils'
        ]
    }
};

class Logger {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || 'http://20.244.56.144/evaluation-service/logs';
        this.accessToken = config.accessToken;
        this.isEnabled = true;

        if (!this.accessToken) {
            console.warn('Logger warning: No access token provided. Logging will be disabled.');
            this.isEnabled = false;
        }
    }

    /**
     * Validates the input parameters for logging
     * @param {string} stack - The stack (backend/frontend)
     * @param {string} level - The log level
     * @param {string} pkg - The package name
     * @param {string} message - The log message
     * @throws {Error} If any parameter is invalid
     */
    validateParams(stack, level, pkg, message) {
        // Convert to lowercase for comparison
        stack = stack.toLowerCase();
        level = level.toLowerCase();
        pkg = pkg.toLowerCase();

        // Validate stack
        if (!VALID_VALUES.stacks.includes(stack)) {
            throw new Error(`Invalid stack. Must be one of: ${VALID_VALUES.stacks.join(', ')}`);
        }

        // Validate level
        if (!VALID_VALUES.levels.includes(level)) {
            throw new Error(`Invalid level. Must be one of: ${VALID_VALUES.levels.join(', ')}`);
        }

        // Validate package
        const validPackages = [
            ...VALID_VALUES.packages.common,
            ...(stack === 'backend' ? VALID_VALUES.packages.backend : []),
            ...(stack === 'frontend' ? VALID_VALUES.packages.frontend : [])
        ];

        if (!validPackages.includes(pkg)) {
            throw new Error(`Invalid package for ${stack}. Must be one of: ${validPackages.join(', ')}`);
        }

        // Validate message
        if (!message || typeof message !== 'string') {
            throw new Error('Message is required and must be a string');
        }
    }

    /**
     * Sends a log to the logging service
     * @param {string} stack - The stack (backend/frontend)
     * @param {string} level - The log level
     * @param {string} pkg - The package name
     * @param {string} message - The log message
     * @returns {Promise<Object>} The response from the logging service
     */
    async log(stack, level, pkg, message) {
        try {
            // Validate parameters
            try {
                this.validateParams(stack, level, pkg, message);
            } catch (validationError) {
                // If validation fails, log to console but don't throw
                console.warn('Logger validation failed:', validationError.message);
                return null;
            }

            // Make the API call
            const response = await axios.post(
                this.baseUrl,
                {
                    stack: stack.toLowerCase(),
                    level: level.toLowerCase(),
                    package: pkg.toLowerCase(),
                    message
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            // Log the error to console but don't throw
            if (error.response) {
                console.warn('Logger API error:', error.response.data.message || error.message);
            } else if (error.request) {
                console.warn('Logger connection error: No response received from logging service');
            } else {
                console.warn('Logger error:', error.message);
            }
            
            // Return null instead of throwing to allow application to continue
            return null;
        }
    }
}

module.exports = Logger;
