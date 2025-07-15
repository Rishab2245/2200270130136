const Logger = require('./index');

// Initialize the logger with your access token
const logger = new Logger({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyaXNoYWIyMjEzMjEwQGFrZ2VjLmFjLmluIiwiZXhwIjoxNzUyNTU3MDMyLCJpYXQiOjE3NTI1NTYxMzIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI5Nzg0Zjc5OC03Y2RjLTRmY2YtODZjNS00ZTMzMzk5YWNmMmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJyaXNoYWIgY2hhdWRoYXJ5Iiwic3ViIjoiYWNmOTJlMmQtZmFjMi00NDc4LTkyMGMtNDg0YWUwZjg3NTI3In0sImVtYWlsIjoicmlzaGFiMjIxMzIxMEBha2dlYy5hYy5pbiIsIm5hbWUiOiJyaXNoYWIgY2hhdWRoYXJ5Iiwicm9sbE5vIjoiMjIwMDI3MDEzMDEzNiIsImFjY2Vzc0NvZGUiOiJ1dU1ieVkiLCJjbGllbnRJRCI6ImFjZjkyZTJkLWZhYzItNDQ3OC05MjBjLTQ4NGFlMGY4NzUyNyIsImNsaWVudFNlY3JldCI6IlZXS1pFRGpUdERheFd3dGEifQ.R1u_5BOhagQ8e-4sgfgDcpaVYjZbH7pA8farEqxGjAM'
});

// Example usage:

// Backend logging examples
async function backendExamples() {
    try {
        // Database connection error
        await logger.error('backend', 'db', 'Failed to connect to database: Connection timeout');

        // Route handler success
        await logger.info('backend', 'handler', 'Successfully processed user registration request');

        // Cache miss
        await logger.debug('backend', 'cache', 'Cache miss for user profile data');
    } catch (error) {
        console.error('Logging failed:', error.message);
    }
}

// Frontend logging examples
async function frontendExamples() {
    try {
        // Component render error
        await logger.error('frontend', 'component', 'Failed to render UserProfile component: Invalid props');

        // API call success
        await logger.info('frontend', 'api', 'Successfully fetched user data from API');

        // State update
        await logger.debug('frontend', 'state', 'Updated user preferences in global state');
    } catch (error) {
        console.error('Logging failed:', error.message);
    }
}

// Run examples
backendExamples();
frontendExamples();
