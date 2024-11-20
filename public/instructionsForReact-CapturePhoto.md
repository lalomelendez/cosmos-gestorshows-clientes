Capture Photo - React Migration Plan

Component Structure
Main CapturePhoto container
Navigation bar (shared component)
Show selector dropdown
Photo capture button
Message display area
Loading states

State Requirements
Available shows list
Selected show data
Capture status/loading
Success/error messages
Client list from selected show

API Integration Points
Fetch shows with assigned users
Submit photo capture request
Handle photo metadata storage
Error handling for API calls

Business Logic
Only shows with assigned users are selectable
Photo capture requires active show selection
Success updates show's photo collection
Error handling with user feedback

Data Flow
Initial shows load on mount
Show selection updates available clients
Capture triggers API call
Response updates UI state
Success refreshes show data

Error Scenarios
Network failures
Empty show selection
No assigned users
Failed photo capture
Database errors

UI/UX Considerations
Loading indicators
Disabled states
Success/error messages
Clear user feedback
Responsive design

Testing Strategy
Component rendering
Show selection flow
Photo capture process
Error handling
API integration
Loading states
Would you like me to elaborate on any of these points?

Capture Photo - React Migration Plan
Project Structure

src/
├── components/
│ ├── CapturePhoto/
│ │ ├── index.tsx
│ │ ├── ShowSelector.tsx
│ │ ├── CaptureButton.tsx
│ │ └── MessageDisplay.tsx
├── services/
│ ├── api.ts
│ └── photo.service.ts
├── types/
│ └── index.ts
└── utils/
└── date.ts

Type Definitions
// types/index.ts
interface Show {
\_id: string;
startTime: Date;
clients: Client[];
photos: string[];
}

interface Client {
\_id: string;
name: string;
email: string;
}

interface PhotoData {
url: string;
showId: string;
clientIds: string[];
}

API Service
// services/photo.service.ts
import axios from 'axios';

export const photoService = {
getShows: () =>
axios.get<Show[]>('/api/shows'),

capturePhoto: (data: PhotoData) =>
axios.post('/api/photos', data),
};

Main Component
// components/CapturePhoto/index.tsx
import React, { useState, useEffect } from 'react';
import { ShowSelector } from './ShowSelector';
import { CaptureButton } from './CaptureButton';
import { MessageDisplay } from './MessageDisplay';
import { photoService } from '../../services/photo.service';

export const CapturePhoto: React.FC = () => {
const [shows, setShows] = useState<Show[]>([]);
const [selectedShow, setSelectedShow] = useState<Show | null>(null);
const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

useEffect(() => {
loadShows();
}, []);

const loadShows = async () => {
try {
const { data } = await photoService.getShows();
setShows(data.filter(show => show.clients.length > 0));
} catch (error) {
setMessage({ type: 'error', text: 'Error loading shows' });
}
};

const handleCapture = async () => {
if (!selectedShow) return;

    try {
      await photoService.capturePhoto({
        url: 'https://example.com/photo.jpg', // Replace with actual photo capture
        showId: selectedShow._id,
        clientIds: selectedShow.clients.map(c => c._id)
      });

      setMessage({
        type: 'success',
        text: 'Photo captured successfully'
      });

      await loadShows(); // Refresh shows list
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error capturing photo'
      });
    }

};

return (
<div className="min-h-screen bg-gray-100 p-4">
<div className="max-w-2xl mx-auto">
<ShowSelector
          shows={shows}
          onChange={setSelectedShow}
        />
<CaptureButton
          disabled={!selectedShow}
          onClick={handleCapture}
        />
{message && (
<MessageDisplay
            type={message.type}
            text={message.text}
          />
)}
</div>
</div>
);
};

// components/CapturePhoto/ShowSelector.tsx
interface Props {
shows: Show[];
onChange: (show: Show | null) => void;
}

export const ShowSelector: React.FC<Props> = ({ shows, onChange }) => (
<select
onChange={e => {
const show = shows.find(s => s.\_id === e.target.value);
onChange(show || null);
}}
className="w-full p-2 rounded border"

>

    <option value="">Select a show</option>
    {shows.map(show => (
      <option key={show._id} value={show._id}>
        {`Show - ${new Date(show.startTime).toLocaleString()} (${show.clients.length} users)`}
      </option>
    ))}

  </select>
);

Child Components
// components/CapturePhoto/CaptureButton.tsx
interface Props {
disabled: boolean;
onClick: () => void;
}

export const CaptureButton: React.FC<Props> = ({ disabled, onClick }) => (
<button
onClick={onClick}
disabled={disabled}
className="bg-blue-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"

>

    Capture Photo

  </button>
);

Error Handling
// utils/error.ts
export const handleApiError = (error: unknown) => {
if (axios.isAxiosError(error)) {
return error.response?.data?.message || 'Network error';
}
return 'An unexpected error occurred';
};

Component Tests
// components/CapturePhoto/**tests**/index.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CapturePhoto } from '../index';
import { photoService } from '../../../services/photo.service';

jest.mock('../../../services/photo.service');

describe('CapturePhoto', () => {
it('loads and displays shows', async () => {
const mockShows = [{
\_id: '1',
startTime: new Date(),
clients: [{ _id: '1', name: 'Test' }]
}];

    (photoService.getShows as jest.Mock).mockResolvedValue({ data: mockShows });

    render(<CapturePhoto />);

    expect(await screen.findByText(/Test/)).toBeInTheDocument();

});
});
