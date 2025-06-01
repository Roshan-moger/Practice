import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveManualTransactionAsync } from '../features/manual/manualSlice';
import toast from 'react-hot-toast';

const AddExpenses = () => {
  const dispatch = useDispatch();

  // Helper: format current local datetime as yyyy-MM-ddTHH:mm for datetime-local input
  const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('debited');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getLocalDateTime());

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert local datetime string to ISO string in UTC before saving
    // new Date(date) interprets date as local time
    const isoDate = new Date(date).toISOString();

    dispatch(
      saveManualTransactionAsync({
        amount: parseFloat(amount),
        type,
        note,
        date: isoDate,
      })
    ).then(() => {
      toast.success('Expense added successfully!');
      setAmount('');
      setNote('');
      setDate(getLocalDateTime()); // reset with current local datetime
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Manual Expense</h2>
      <div className="mb-2">
        <label className="block text-sm mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="debited">Debited</option>
          <option value="credited">Credited</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenses;
