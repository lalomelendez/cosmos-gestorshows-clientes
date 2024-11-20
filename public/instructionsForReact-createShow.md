1. UI Components (createShow.html)

- Navigation Bar

  - Links to all sections
  - Fixed position at top

- Create Show Form

  - Time picker for show start
  - Duration input (minutes)
  - Submit button
  - Success/Error message display

  2. Frontend Logic (JS)
     Core Functions:
  1. Form Submission Handler

  - Captures form data
  - Validates inputs
  - Makes POST request to /api/shows
  - Handles response/errors
  - Updates UI with success/failure

  2. Date/Time Handling

  - Formats datetime for API
  - Validates show timing

3. Server Routes (server.js)

   1. Static File Serving

   - Serves HTML from public/html/
   - Serves static JS/CSS

   2. Main Route

   - GET /create-show -> Serves createShow.html

4. API Routes (showRoutes.js)

   1. Show Creation Endpoint

   - POST /api/shows
   - Connects to showController.createShow
   - Handles request validation

5. Controller Logic (showController.js)
   createShow function:

   1. Data Processing

   - Extracts startTime, duration from request
   - Sets initial status as "creado"

   2. Database Operations

   - Creates new Show document
   - Saves to MongoDB
   - Returns saved show data

   3. Error Handling

   - Validates input data
   - Handles DB errors
   - Returns appropriate status codes

React Migration Plan 1. Components Structure - CreateShowPage (main container) - NavigationBar (shared component) - CreateShowForm - MessageDisplay

    2. State Management
    - Form state (startTime, duration)
    - Loading states
    - Error/Success messages

    3. API Integration
    - Create shows service
    - Axios/fetch wrapper
    - Error handling utilities

    4. Validation Layer
    - Input validation
    - Time/date formatting
    - Form submission checks

    5. UI Enhancement
    - Tailwind CSS migration
    - React form libraries
    - DateTime picker component
