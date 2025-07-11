import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { markEmailAsReadAsync } from '../features/Email/EmailSlice';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Typography, Button } from '@material-tailwind/react';
import { FlagIcon, TrashIcon, InboxIcon } from '@heroicons/react/24/solid';

const Inbox = () => {
  const dispatch = useDispatch();
  const { data: emails, error } = useSelector((state) => state.emails);

  const [deletedIds, setDeletedIds] = useState(() => {
    const stored = localStorage.getItem('deletedEmailIds');
    return stored ? JSON.parse(stored) : [];
  });

  const handleDeleteAndMarkRead = async (id) => {
    await dispatch(markEmailAsReadAsync(id));
    const updatedIds = [...deletedIds, id];
    setDeletedIds(updatedIds);
    localStorage.setItem('deletedEmailIds', JSON.stringify(updatedIds));
    toast.success('Email removed from inbox', {
      style: {
        background: '#343434',
        color: '#EDEDED',
        fontWeight: 'bold',
      },
    });
  };

  const handleDeleteAllAndMarkRead = async () => {
    const allVisibleIds = visibleEmails.map((email) => email._id);
    if (allVisibleIds.length === 0) {
      toast.error('No emails to delete',{
      style: {
        background: '#343434',
        color: '#EDEDED',
        fontWeight: 'bold',
      },
    });
      return;
    }
    await Promise.all(allVisibleIds.map((id) => dispatch(markEmailAsReadAsync(id))));
    const updatedIds = [...deletedIds, ...allVisibleIds];
    setDeletedIds(updatedIds);
    localStorage.setItem('deletedEmailIds', JSON.stringify(updatedIds));
    toast.success('All emails marked as read and deleted',{
      style: {
        background: '#343434',
        color: '#EDEDED',
        fontWeight: 'bold',
      },
    });
  };

  const handleMarkAsRead = (id) => {
    dispatch(markEmailAsReadAsync(id));
  };

  const visibleEmails = emails
    .filter((email) => !deletedIds.includes(email._id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        {/* Background Animation */}
        <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md text-center">
          <FlagIcon className="w-16 h-16 mx-auto text-red-500" />
          <Typography
            variant="h1"
            color="blue-gray"
            className="mt-6 text-3xl font-bold md:text-4xl"
          >
            Error 404
          </Typography>
          <Typography className="mt-4 text-lg text-gray-600 max-w-sm mx-auto">
            Something went wrong. Please try refreshing the page or come back later.
          </Typography>
          <Button
            color="gray"
            className="mt-6 w-full md:w-32 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            onClick={() => window.location.href = '/dashboard'}
          >
            Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
   <div className="relative min-h-screen px-6 py-10 overflow-hidden">
  {/* Inbox Container */}
  <div className="relative z-10 max-w-5xl mx-auto">
    {/* Header */}
    <div className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-3">
        <InboxIcon className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
      </div>
      <button
        onClick={handleDeleteAllAndMarkRead}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-300"
      >
        Delete All
      </button>
    </div>

    {/* No Emails */}
    {visibleEmails.length === 0 ? (
      <div className="bg-white/70 backdrop-blur-lg p-10 rounded-xl shadow-md text-center">
        <p className="text-gray-600 text-lg">No emails found.</p>
      </div>
    ) : (
      <div className="space-y-6">
        {visibleEmails.map((email) => (
          <div
            key={email._id}
            className={`relative p-6 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
              email.read ? '' : 'bg-purple-50 border-purple-200'
            }`}
            onClick={() => handleMarkAsRead(email._id)}
          >
            <div className="flex justify-between items-start">
              {/* Email Content */}
              <div>
                <h3
                  className={`text-lg ${
                    email.read ? 'font-medium text-gray-800' : 'font-bold text-purple-800'
                  }`}
                >
                  {email.subject}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{email.from}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </p>
              </div>

              {/* Delete Button */}
              <button
                className="p-2 bg-[#8356D6] hover:bg-red-600 text-white rounded-full shadow transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAndMarkRead(email._id);
                }}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default Inbox;