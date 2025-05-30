import { useDispatch, useSelector } from 'react-redux';
import { markEmailAsReadAsync } from '../features/Email/EmailSlice';
import { formatDistanceToNow } from 'date-fns';
import {  useState } from 'react';
import toast from 'react-hot-toast';
import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";
const Inbox = () => {
  const dispatch = useDispatch();
  const { data: emails, error } = useSelector((state) => state.emails);

  // ⏳ Load deleted IDs from localStorage on initial render
  const [deletedIds, setDeletedIds] = useState(() => {
    const stored = localStorage.getItem('deletedEmailIds');
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ Delete email from UI only (persist to localStorage)
const handleDeleteAndMarkRead = async (id) => {
  await dispatch(markEmailAsReadAsync(id)); // ✅ mark as read in DB
  const updatedIds = [...deletedIds, id];
  setDeletedIds(updatedIds);
  localStorage.setItem("deletedEmailIds", JSON.stringify(updatedIds));
  toast.success("Email marked as read and removed from inbox");
};


const handleDeleteAllAndMarkRead = async () => {
  const allVisibleIds = visibleEmails.map((email) => email._id);
if (allVisibleIds.length === 0) {
    toast.error("No emails to delete");
    return; // Stop execution if no emails to delete
  }
  // mark all as read in DB
  await Promise.all(allVisibleIds.map((id) => dispatch(markEmailAsReadAsync(id))));

  const updatedIds = [...deletedIds, ...allVisibleIds];
  setDeletedIds(updatedIds);
  localStorage.setItem("deletedEmailIds", JSON.stringify(updatedIds));
  toast.success("All emails marked as read and deleted");
};


  // ✅ Mark email as read
  const handleMarkAsRead = (id) => {
    dispatch(markEmailAsReadAsync(id));
  };

  // ⏳ Loading Spinner
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-40">
  //       <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //       <span className="ml-4 text-blue-600 font-medium">Loading emails...</span>
  //     </div>
  //   );
  // }

  // ❌ Error toast

    if (error) {
     return (
       <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <FlagIcon className="w-20 h-20 mx-auto" />
          <Typography
            variant="h1"
            color="blue-gray"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl"
          >
            Error 404 <br /> It looks like something went wrong.
          </Typography>
          <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
            Don&apos;t worry, our team is already on it.Please try refreshing
            the page or come back later.
          </Typography>
          <Button color="gray" className="w-full px-4 md:w-[8rem]">
            back home
          </Button>
        </div>
      </div>
     )
    }

  const visibleEmails = emails
    .filter((email) => !deletedIds.includes(email._id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-4">
   <div className="mb-4 flex justify-between items-center">
  <h2 className="text-xl font-semibold">Inbox</h2>
  <div className="space-x-2">
 <button
  onClick={handleDeleteAllAndMarkRead}
  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Delete All
</button>

    
  </div>
</div>

      {/* 📨 Email List */}

      {visibleEmails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul className="space-y-3">
          {visibleEmails.map((email) => (
            <li
              key={email._id}
              className={`p-3 border rounded shadow-sm relative ${
                email.read ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div onClick={() => handleMarkAsRead(email._id)} className="cursor-pointer">
                <p className={`font-${email.read ? 'normal' : 'bold'}`}>{email.subject}</p>
                <p className="text-sm text-gray-600">{email.from}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </p>
              </div>

              {/* 🗑️ Delete Button */}
              <button
  onClick={() => handleDeleteAndMarkRead(email._id)}
  className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
>
  Delete
</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
