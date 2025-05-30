import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';

const extractAmountFromSubject = (subject) => {
  const match = subject.match(/(?:INR|₹)\s?([\d,]+\.\d{2}|\d+)/i);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  return 0;
};

const getTypeFromSubject = (subject) => {
  if (/credit/i.test(subject)) return 'credited';
  if (/debit/i.test(subject)) return 'debited';
  return 'unknown';
};

const RecentTransactions = () => {
  const emails = useSelector((state) => state.emails.data || []);
  const manual = useSelector((state) => state.manualTransaction.data || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTxn, setCurrentTxn] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const handleEditClick = (txn) => {
    setCurrentTxn(txn);
    setNoteInput(txn.note || '');
    setModalOpen(true);
  };

  const handleNoteSubmit = async () => {
    if (!currentTxn) return;

    try {
      const endpoint =
        currentTxn.source === 'manual'
          ? `http://localhost:5000/api/manualtransactions/${currentTxn._id}`
          : `http://localhost:5000/api/emails/${currentTxn._id}/note`;

      await axios.put(endpoint, { note: noteInput });

      currentTxn.note = noteInput; // Update locally to reflect immediately
      setModalOpen(false);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const formattedEmails = emails.map((email, idx) => ({
    _id: email._id || `email-${idx}`,
    date: email.date,
    amount: extractAmountFromSubject(email.subject),
    note: email.note || '',
    type: getTypeFromSubject(email.subject),
    source: 'email',
  }));

  const formattedManual = manual.map((txn, idx) => ({
    _id: txn._id || `manual-${idx}`,
    ...txn,
    source: 'manual',
  }));

  const allTransactions = [...formattedEmails, ...formattedManual]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-md w-full mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>

      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 mb-2">
        <span>Date</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Note</span>
      </div>

      {allTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No transactions available.</p>
      ) : (
        <ul className="space-y-1">
          {allTransactions.map((txn) => (
            <li
              key={txn._id}
              className="grid grid-cols-4 gap-4 items-center bg-gray-50 px-4 py-2 rounded-md"
            >
              <span className="text-gray-600 text-sm">
                {new Date(txn.date).toLocaleString('en-IN')}
              </span>
              <span
                className={`text-sm font-semibold capitalize ${
                  txn.type === 'credited'
                    ? 'text-green-600'
                    : txn.type === 'debited'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {txn.type}
              </span>
              <span
                className={`text-sm font-bold ${
                  txn.type === 'credited'
                    ? 'text-green-700'
                    : txn.type === 'debited'
                    ? 'text-red-700'
                    : 'text-gray-600'
                }`}
              >
                ₹{txn.amount.toFixed(2)}
              </span>
              <span className="text-sm text-gray-700 flex items-center justify-between">
                {txn.note || '—'}
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700 text-xs cursor-pointer"
                  onClick={() => handleEditClick(txn)}
                  title="Edit note"
                >
                  ✏️
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add/Edit Note</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleNoteSubmit}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
