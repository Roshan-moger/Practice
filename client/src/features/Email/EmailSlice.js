import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async () => {
    const response = await axios.get('http://localhost:5000/api/emails/subjects');
    return response.data;
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    data: [],        // email array with { ...email, read: false }
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

        // Add new emails only if not already present (by _id)
        const newEmails = action.payload.filter((newEmail) => {
          return !state.data.some((existingEmail) => existingEmail._id === newEmail._id);
        });

        // Add read: false to new emails
        const enrichedEmails = newEmails.map((email) => ({
          ...email,
          read: false,
        }));

        state.data = [...state.data, ...enrichedEmails];
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { markAsRead } = emailSlice.actions;
export default emailSlice.reducer;
