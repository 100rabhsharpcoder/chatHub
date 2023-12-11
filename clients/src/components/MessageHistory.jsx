import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed';
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics';
import { Tooltip } from '@chakra-ui/tooltip';
import { Avatar } from '@chakra-ui/avatar';
import '../pages/home.css';

// Component to display message history
function MessageHistory({ messages }) {
  // Get active user from Redux store
  const activeUser = useSelector((state) => state.activeUser);

  return (
    <>
      {/* Scrollable container for messages */}
      <ScrollableFeed className='scrollbar-hide'>
        {messages &&
          messages.map((m, i) => (
            <div className='flex items-center gap-x-[6px]' key={m._id}>
              {/* Display sender's avatar with tooltip */}
              {isSameSender(messages, m, i, activeUser.id) ||
                isLastMessage(messages, i, activeUser.id) ? (
                  <Tooltip label={m.sender?.name} placement='bottom-start' hasArrow>
                    <Avatar
                      style={{ width: '32px', height: '32px' }}
                      mt='43px'
                      mr={1}
                      cursor='pointer'
                      name={m.sender?.name}
                      src={m.sender?.profilePic}
                      borderRadius='25px'
                    />
                  </Tooltip>
                ) : null}
              {/* Display the message with appropriate styling */}
              <span
                className='tracking-wider text-[15px] font-medium'
                style={{
                  boxshadow: '0px 0px 0px 3px #000000',
                  backgroundColor: `${m.sender._id === activeUser.id ? '#37bf6c' : '#ffffff'}`,
                  marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                  marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
                  borderRadius: `${m.sender._id === activeUser.id ? '10px 10px 0px 10px' : '10px 10px 10px 0'}`,
                  padding: '10px 18px',
                  maxWidth: '460px',
                  color: `${m.sender._id === activeUser.id ? '#ffff' : '#232324'}`,
                }}
              >
                {m.message}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
}

export default MessageHistory;
