Assign User to Show - React Migration Plan
Component Structure

- AssignUserToShowPage (main container)

  - NavigationBar
  - UsersList
    - UserCard
  - ShowsList
    - ShowCard
  - AssignmentButton
  - MessageDisplay

  State Management

  - selectedUser: null | User

- selectedShow: null | Show
- users: User[]
- shows: Show[]
- loading: { users: boolean, shows: boolean }
- error: string | null
- success: string | null

API Layer
/api/users/waiting

- GET: Fetch users with "en espera" status

/api/shows/available

- GET: Fetch shows with "creado" status

/api/users/:userId/show

- PATCH: Assign user to show
  Payload: { showId: string }

Main Features

- Load and display waiting users
- Load and display available shows
- User selection with visual feedback
- Show selection with visual feedback
- Capacity check (max 4 users per show)
- Assignment confirmation
- Real-time UI updates after assignment

Data Flow

1. Initial Load

   - Fetch waiting users
   - Fetch available shows
   - Initialize selections as null

2. Selection Process

   - User clicks user card → update selectedUser
   - User clicks show card → update selectedShow
   - Visual feedback for selections

3. Assignment Process

   - Validate selections
   - Send PATCH request
   - Handle response
   - Update lists
   - Reset selections

   UI/UX Requirements

   - Grid layout for users and shows

- Visual card selection state
- Show capacity indicator
- Loading states
- Error/Success messages
- Responsive design

Business Rules

- Users must have "en espera" status
- Shows must have "creado" status
- Maximum 4 users per show
- Can't assign already assigned users
- Must select both user and show

Error Handling

- Network errors
- Validation errors
- Capacity errors
- Server errors
- UI feedback for all error types

Styling Migration

- Convert Tailwind classes to components
- Maintain existing color scheme
- Keep card-based layout
- Preserve hover/active states

Testing Plan

- Unit tests for components
- Integration tests for API calls
- E2E tests for assignment flow
- Error scenario testing
