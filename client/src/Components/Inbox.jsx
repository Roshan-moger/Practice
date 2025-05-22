import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmails, markEmailAsReadAsync } from '../features/Email/EmailSlice';

const Inbox = () => {
  const dispatch = useDispatch();
  const { data: emails, loading, error } = useSelector((state) => state.emails);



  // Count unread directly from Redux data
const unreadCount = emails.filter(e => !e.read).length;

  // Handle marking email as read
const handleMarkAsRead = (id) => {
  dispatch(markEmailAsReadAsync(id));
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
          Unread Messages: {unreadCount}
        </span>
      </div>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul className="space-y-3">
          {[...emails]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((email) => (
              <li
                key={email._id}
                onClick={() => handleMarkAsRead(email._id)}
                className={`p-3 border rounded shadow-sm cursor-pointer ${
                  email.read ? 'bg-white' : 'bg-gray-100'
                }`}
              >
                <p className={`font-${email.read ? 'normal' : 'bold'}`}>{email.subject}</p>
                <p className="text-sm text-gray-600">{email.from}</p>
                <p className="text-xs text-gray-400">
                  {new Date(email.date).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                  })}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
