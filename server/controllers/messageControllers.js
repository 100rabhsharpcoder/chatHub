import Message from '../models/messageModel.js';
import user from '../models/userModel.js';
import Chat from '../models/chatModel.js';

// Function to send a message to a chat
export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  try {
    // Create a new message with the sender's ID, message content, and chat ID
    let msg = await Message.create({ sender: req.rootUserId, message, chatId });

    // Populate the sender field in the message with user details (name, profilePic, email)
    msg = await (
      await msg.populate('sender', 'name profilePic email')
    ).populate({
      // Populate the chatId field in the message with chat details (chatName, isGroup, users)
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        // Populate the users field in the chat with user details (name, email, profilePic)
        path: 'users',
        select: 'name email profilePic',
        model: 'User',
      },
    });

    // Update the latestMessage field in the chat with the newly sent message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });

    // Send the created and populated message as a response
    res.status(200).send(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// Function to retrieve all messages for a specific chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Retrieve all messages for the specified chat, populating sender and chat details
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });

    // Send the retrieved messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ error: error });
  }
};
