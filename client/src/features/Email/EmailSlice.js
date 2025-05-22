import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch emails
export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async () => {
    const response = await axios.get('http://localhost:5000/api/emails/subjects');
    return response.data; // Expecting array of email objects from backend
  }
);

// Thunk to mark an email as read
export const markEmailAsReadAsync = createAsyncThunk(
  'emails/markAsReadAsync',
  async (emailId) => {
    const response = await axios.put(`http://localhost:5000/api/emails/${emailId}/read`);
    return response.data; // Updated email object from backend
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    data: [],        // Array of emails
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      const emailId = action.payload;
      const email = state.data.find(e => e._id === emailId);
      if (email) {
        email.read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;

        const newEmails = action.payload.filter((newEmail) => {
          return !state.data.some((existingEmail) => existingEmail._id === newEmail._id);
        });

        // 🛠️ Preserve original `read` value from backend
        const enrichedEmails = newEmails.map((email) => ({
          ...email,
          read: email.read ?? false,
        }));

        state.data = [...state.data, ...enrichedEmails];
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markEmailAsReadAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.data.findIndex(e => e._id === updated._id);
        if (idx !== -1) {
          state.data[idx] = updated;
        }
      });
  },
});

export const { markAsRead } = emailSlice.actions;
export default emailSlice.reducer;
