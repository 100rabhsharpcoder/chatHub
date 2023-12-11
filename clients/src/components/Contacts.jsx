import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat, fetchChats } from '../redux/chatsSlice';
import { useEffect } from 'react';
import { getChatName, getChatPhoto, timeSince } from '../utils/logics';
import NoContacts from './ui/NoContacts';

// Constant representing a day in milliseconds
var aDay = 24 * 60 * 60 * 1000;

// Component for displaying the list of contacts
function Contacts() {
  // Redux state and dispatch
  const { chats, activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);

  // Fetch chats on component mount
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <>
      <div className='flex flex-col -space-y-1 overflow-y-scroll scrollbar-hide h-[87vh] pb-10'>
        {/* Map through the chats to display contact information */}
        {chats?.length > 0 ? (
          chats?.map((e) => {
            return (
              <div
                onClick={() => {
                  dispatch(setActiveChat(e));
                }}
                key={e._id}
                className={`flex items-center justify-between sm:gap-x-1 md:gap-x-1 mt-5 ${
                  activeChat._id === e._id ? 'bg-[#fafafa]' : 'bg-[#fff]'
                } cursor-pointer  py-4 px-2`}
              >
                <div className='flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3'>
                  {/* Display chat photo */}
                  <img
                    className='w-12 h-12  sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover'
                    src={getChatPhoto(e, activeUser)}
                    alt=''
                  />
                  <div>
                    {/* Display contact name */}
                    <h5 className='text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold'>{getChatName(e, activeUser)}</h5>
                    {/* Display the latest message truncated if it is too long */}
                    <p className='text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c] '>
                      {e.latestMessage?.message.length > 30
                        ? e.latestMessage?.message.slice(0, 30) + '...'
                        : e.latestMessage?.message}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-y-[8px]'>
                  {/* Display the time since the last message */}
                  <p className='text-[12.4px] sm:text-[12px]  font-normal text-[#b0b2b3] tracking-wide'>
                    {timeSince(new Date(Date.parse(e.updatedAt) - aDay))}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          // Display a message when there are no contacts
          <NoContacts />
        )}
      </div>
    </>
  );
}

export default Contacts;
