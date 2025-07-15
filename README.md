# URL Shortener Microservice Project

This is a full-stack URL shortener application with analytics capabilities and a custom logging middleware. The project consists of three main components:

1. Backend Service (Express/Node.js)
2. Frontend Application (React/Vite)
3. Reusable Logging Middleware

## Project Structure

```
placement/
├── Backend Test Submission/      # Backend service
│   ├── src/
│   │   ├── server.js            # Express server setup
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── models/             # Database models
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── Frontend Test Submission/    # Frontend application
│   ├── placement-project/
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── assets/       # Static assets
│   │   │   ├── App.jsx       # Main application
│   │   │   └── main.jsx      # Entry point
│   │   └── package.json
│   └── README.md
│
└── Logging Middleware/         # Custom logging package
    ├── src/
    │   └── index.js          # Logger implementation
    └── package.json
```

## Features

### Backend Service
- URL shortening with custom or auto-generated codes
- URL validity period configuration
- Analytics tracking (clicks, locations, referrers)
- MongoDB integration for data persistence
- GeoIP location detection
- Comprehensive error handling
- Custom logging integration

### Frontend Application
- Modern, responsive design with vanilla CSS
- Dark theme with minimal, aesthetic UI
- URL submission form with validity configuration
- Statistics view for shortened URLs
- Error handling and user feedback
- Custom logging integration

### Logging Middleware
- Reusable logging package for both frontend and backend
- Configurable log levels (debug, info, warn, error, fatal)
- Stack-specific package validation
- Error resilient - continues operation even if logging fails
- Bearer token authentication
- Structured logging format

## Technical Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Packages:
  - shortid: URL code generation
  - geoip-lite: Location detection
  - valid-url: URL validation
  - cors: Cross-origin support
  - dotenv: Environment configuration

### Frontend
- React 18
- Vite
- Vanilla CSS
- Packages:
  - axios: HTTP client
  - react-router-dom: Navigation
  - date-fns: Date formatting

### Logging Middleware
- Pure JavaScript implementation
- axios: HTTP client for log submission

## Setup and Running

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd "Backend Test Submission"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend project:
   ```bash
   cd "Frontend Test Submission/placement-project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Logging Middleware Setup
1. Navigate to the logging directory:
   ```bash
   cd "Logging Middleware"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## API Endpoints

### URL Shortener API
- `POST /shorturls`
  - Create short URL
  - Body: `{ url, validity, shortcode }`

- `GET /shorturls/:shortCode`
  - Get URL statistics
  - Returns clicks and analytics

- `GET /:shortCode`
  - Redirect to original URL
  - Records click analytics

### Logging API
- Endpoint: `http://20.244.56.144/evaluation-service/logs`
- Method: POST
- Authentication: Bearer token
- Body:
  ```json
  {
    "stack": "backend|frontend",
    "level": "debug|info|warn|error|fatal",
    "package": "<package-name>",
    "message": "<log-message>"
  }
  ```

## Screenshots

[Place your screenshots here with descriptions]

## Error Handling

### Backend
- URL validation errors
- Duplicate shortcode handling
- Database connection errors
- Invalid request handling
- Expired URL handling

### Frontend
- Network error handling
- User input validation
- Loading states
- Error messages display
- Form validation feedback

### Logger
- Token validation
- Network failure handling
- Invalid parameter handling
- Graceful degradation on errors

## Development Notes

### Backend Development
- RESTful API design
- MVC architecture
- Middleware for common functionality
- Comprehensive error handling
- Database indexing for performance

### Frontend Development
- Component-based architecture
- Custom CSS styling
- Responsive design
- Error boundary implementation
- Loading state management

### Logger Development
- Fault-tolerant design
- Parameter validation
- Flexible configuration
- Console fallback for errors

## Security Considerations

- URL validation
- Rate limiting (TODO)
- Input sanitization
- Error message safety
- CORS configuration
- Logging security (token-based)

## Future Enhancements

1. User authentication
2. Custom domain support
3. QR code generation
4. Advanced analytics
5. Rate limiting
6. Cache implementation
7. Batch URL processing
8. API documentation (Swagger)

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information if applicable]
