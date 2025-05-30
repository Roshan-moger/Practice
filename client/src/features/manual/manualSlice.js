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
      });
  },
});

export default manualTransactionSlice.reducer;
