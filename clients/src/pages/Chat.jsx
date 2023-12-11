import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from 'react-icons/bs';
import { fetchMessages, sendMessage } from '../apis/messages';
import { useEffect } from 'react';
import MessageHistory from '../components/MessageHistory';
import io from 'socket.io-client';
import './home.css';
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import { PaperPlaneTilt } from 'phosphor-react';

const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket, selectedChatCompare;

function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const activeUser = useSelector((state) => state.activeUser);

  // Function to handle sending messages on key press or button click
  const keyDownFunction = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && message) {
      setMessage('');
      socket.emit('stop typing', activeChat._id);
      const data = await sendMessage({ chatId: activeChat._id, message });
      socket.emit('new message', data);
      setMessages([...messages, data]);
      dispatch(fetchChats());
    }
  };

  // Initializing the socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  // Setting up the socket connection with the active user
  useEffect(() => {
    socket.emit('setup', activeUser);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
  }, [messages, activeUser]);

  // Fetching messages when the active chat changes
  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true);
        const data = await fetchMessages(activeChat._id);
        setMessages(data);
        socket.emit('join room', activeChat._id);
        setLoading(false);
      }
    };
    fetchMessagesFunc();
    selectedChatCompare = activeChat;
  }, [activeChat]);

  // Handling new messages received through the socket
  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        (!selectedChatCompare || selectedChatCompare._id) !==
        newMessageRecieved.chatId._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]));
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
      dispatch(fetchChats());
    });
  });

  // Checking if the user is valid (logged in)
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        window.location.href = '/login';
      }
    };
    isValid();
  }, []);

  // Loading screen while fetching data
  if (loading) {
    return (
      <div className={props.className}>
        <Loading />
      </div>
    );
  }

  // Rendering the chat interface
  return (
    <>
      {activeChat ? (
        <div className={props.className}>
          {/* Chat Header */}
          <div className="flex justify-between h-16 items-center align-middle shadow-md px-7 bg-[#ffff] w-[100%]">
            <div className="flex items-center gap-x-[10px]">
              <div className="flex flex-col items-start justify-center">
                <h5 className="text-[17px] text-[#2b2e33] font-bold tracking-wide">
                  {getChatName(activeChat, activeUser)}
                </h5>
                {/* Last seen information */}
              </div>
            </div>
            <div>
              {/* Model Component or other actions */}
              <Model />
            </div>
          </div>

          {/* Message History */}
          <div className="scrollbar-hide w-[100%] h-[70vh] md:h-[66vh] lg:h-[69vh] flex flex-col overflow-y-scroll p-4">
            <MessageHistory typing={isTyping} messages={messages} />
            <div className="ml-7 -mb-10">
              {isTyping ? <Typing width="100" height="100" /> : ''}
            </div>
          </div>

          {/* Message Input Section */}
          <div className=" bg-white w-full absolute bottom-[1%]">
            {showPicker && (
              <Picker
                data={data}
                onEmojiSelect={(e) => setMessage(message + e.native)}
              />
            )}

            <div className="flex flex-row justify-between items-center border-[1px] px-7 py-5 w-[100%]  h-[50px]  rounded-[10px]">
              <div
                className=" p-2 cursor-pointer"
                onClick={() => setShowPicker(!showPicker)}
              >
                {/* Emoji picker toggle */}
                {showPicker ? (
                  <BsFillEmojiSmileFill className="w-[20px] h-[20px] text-[#f8b74eb2] border-[black]" />
                ) : (
                  <BsEmojiSmile className="w-[20px] h-[20px]" />
                )}
              </div>

              <div className=' w-[90%] bg-inherit'>
                {/* Message input form */}
                <form
                  onKeyDown={(e) => keyDownFunction(e)}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (!socketConnected) return;
                      if (!typing) {
                        setTyping(true);
                        socket.emit('typing', activeChat._id);
                      }
                      let lastTime = new Date().getTime();
                      var time = 3000;
                      setTimeout(() => {
                        var timeNow = new Date().getTime();
                        var timeDiff = timeNow - lastTime;
                        if (timeDiff >= time && typing) {
                          socket.emit('stop typing', activeChat._id);
                          setTyping(false);
                        }
                      }, time);
                    }}
                    className="focus:outline-0 w-[100%] bg-[#f8f9fa]"
                    type="text"
                    name="message"
                    placeholder="Enter message"
                    value={message}
                  />
                </form>
              </div>

              {/* Send Message Button */}
              <div className="flex justify-between items-start">
                <button
                  onClick={(e) => keyDownFunction(e)}
                  className="bg-[#f8f9fa] border-[2px] border-[#d4d4d4] text-[14px] px-3 py-[6px] text-[#9e9e9e] font-black rounded-[7px] -mt-1"
                >
                  <PaperPlaneTilt />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Welcome Screen when there's no active chat
        <div className={props.className}>
          <div className="relative">
            <div className="absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3">
              {/* User Profile Image */}
              <img
                className="w-[50px] h-[50px] rounded-[25px]"
                alt="User profile"
                src={activeUser.profilePic}
              />
              {/* Welcome Message */}
              <h3 className="text-[#111b21] text-[20px] font-medium tracking-wider">
                Welcome{' '}
                <span className="text-[#166e48df] text-[19px] font-bold">
                  {' '}
                  {activeUser.name}
                </span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
