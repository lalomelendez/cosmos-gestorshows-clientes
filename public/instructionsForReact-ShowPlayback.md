Component Structure

- ShowPlaybackPage
  - NavigationBar
  - ShowSelector (dropdown)
  - UsersList
  - PlayButton
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
selectedShow: Show | null
message: {
text: string
type: 'success' | 'error'
}
isPlaying: boolean
}

API Services
interface PlaybackAPI {
getAvailableShows: () => Promise<Show[]>
sendOscPlay: () => Promise<void>
sendUserDetails: (showId: string, users: User[]) => Promise<void>
updateShowStatus: (showId: string, status: string) => Promise<void>
}

// Endpoints
GET /api/shows/available
POST /api/osc/play
POST /api/osc/send-users
PATCH /api/shows/:id/status

Core Functions
const handleShowSelect = (showId: string) => {
// Update selected show
// Enable/disable play button
// Display users list
}

const handlePlay = async () => {
// Send user details to TouchDesigner
// Send OSC play signal
// Update show status
// Handle responses
}

const loadShows = async () => {
// Fetch available shows
// Update UI
}

Playback Flow

1. Load Available Shows

   - Fetch shows with "creado" status
   - Populate dropdown
   - Initialize play button as disabled

2. Show Selection

   - Display assigned users
   - Enable play button if users exist
   - Store selected show data

3. Play Sequence
   - Send user details to TD (192.168.1.12:5000)
   - Send play signal (localhost:5000)
   - Update show status to "ha sido reproducido"
   - Show success/error messages

Error Handling

- Network errors (OSC endpoints)
- Show status updates
- Invalid show selection
- Empty user lists
- API timeouts

OSC Integration
interface OSCPlayload {
showId: string
users: User[]
}

const sendOSCSignals = async (payload: OSCPlayload) => {
await sendUserDetails(payload)
await sendPlaySignal()
}

UI States

- Loading shows
- Show selected
- Playing show
- Success feedback
- Error states

Business Rules

- Only shows with "creado" status are playable
- Must have assigned users to play
- Status changes to "ha sido reproducido" after play
- Cannot replay shows

Testing Points

- Show loading
- User display
- OSC signal sending
- Status updates
- Error handling
