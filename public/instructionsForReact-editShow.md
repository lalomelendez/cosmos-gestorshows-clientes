Component Structure

- EditShowPage
  - NavigationBar
  - ShowSelector (dropdown)
  - UsersList
    - UserCard
      - RemoveUserButton
  - DeleteShowButton
  - MessageDisplay

State Management
interface State {
shows: Array<{
\_id: string
startTime: Date
clients: Array<{
\_id: string
name: string
email: string
energy: string
element: string
essence: string
}>
}>
selectedShowId: string | null
message: {
text: string
type: 'success' | 'error'
}
loading: boolean
}

API Layer
interface ShowAPI {
getAvailableShows: () => Promise<Show[]>
removeUserFromShow: (showId: string, userId: string) => Promise<void>
deleteShow: (showId: string) => Promise<void>
}

// Endpoints
GET /api/shows/available
PATCH /api/shows/:showId/remove-user/:userId
DELETE /api/shows/:showId

Core Functions

- loadAvailableShows(): Load shows with "creado" status
- handleShowSelect(showId: string): Update selected show
- removeUser(showId: string, userId: string): Remove user from show
- deleteShow(showId: string): Delete entire show
- displayMessage(text: string, type: string): Show feedback

Business Rules

- Only shows with "creado" status are editable
- Removing user sets their status to "en espera"
- Show can be deleted regardless of user count
- Show deletion resets all user statuses
- UI refreshes after each operation

Data Flow

1. Initial Load

   - Fetch available shows
   - Populate dropdown
   - Disable delete button

2. Show Selection

   - Enable delete button
   - Display users if any
   - Show user removal options

3. User Removal

   - Update show data
   - Reset user status
   - Refresh show list
   - Update UI

4. Show Deletion
   - Delete show
   - Reset user statuses
   - Clear selection
   - Refresh list

Error Handling

- Network errors
- Empty responses
- API failures
- Invalid show/user IDs
- User feedback messages

UI States

- Loading
- Empty shows list
- Show selected
- Operation in progress
- Success/Error messages

Testing Requirements

- Show loading
- User removal
- Show deletion
- Error scenarios
- State updates
- API integration

Styling Migration

- Convert Tailwind classes
- Maintain responsive design
- Keep consistent spacing
- Preserve color scheme
