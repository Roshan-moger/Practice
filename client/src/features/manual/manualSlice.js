import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to save a manual transaction
export const saveManualTransactionAsync = createAsyncThunk(
  'manualTransaction/save',
  async (transactionData) => {
    const response = await axios.post('http://localhost:5000/api/manualtransactions', transactionData);
    return response.data; // saved transaction from backend
  }
);

// Async thunk to fetch all manual transactions
export const fetchManualTransactions = createAsyncThunk(
  'manualTransaction/fetchAll',
  async () => {
    const response = await axios.get('http://localhost:5000/api/manualtransactions');
    return response.data;
  }
);

// Async thunk to update a manual transaction note
export const updateManualNoteAsync = createAsyncThunk(
  'manualTransaction/updateNote',
  async ({ manualId, note }) => {
    const response = await axios.put(`http://localhost:5000/api/manualtransactions/${manualId}`, { note });
    return response.data; // Updated manual transaction
  }
);
const manualTransactionSlice = createSlice({
  name: 'manualTransaction',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManualTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManualTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchManualTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(saveManualTransactionAsync.fulfilled, (state, action) => {
        state.data.unshift(action.payload); // Add new at top
      })
      .addCase(updateManualNoteAsync.fulfilled, (state, action) => {
  const updated = action.payload;
  const index = state.data.findIndex(txn => txn._id === updated._id);
  if (index !== -1) {
    state.data[index] = updated;
  }
});
;
  },
});

export default manualTransactionSlice.reducer;
