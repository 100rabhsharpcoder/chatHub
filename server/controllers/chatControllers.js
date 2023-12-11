// Importing models for Chat and User
import Chat from '../models/chatModel.js';
import user from '../models/userModel.js';

// Function to access chats, either retrieve an existing chat or create a new one
export const accessChats = async (req, res) => {
  const { userId } = req.body;

  // Check if userId is provided
  if (!userId) res.send({ message: "Provide User's Id" });

  // Check if a chat with the specified users exists
  let chatExists = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.rootUserId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  // Populate latestMessage sender's details
  chatExists = await user.populate(chatExists, {
    path: 'latestMessage.sender',
    select: 'name email profilePic',
  });

  // If the chat exists, return it; otherwise, create a new chat
  if (chatExists.length > 0) {
    res.status(200).send(chatExists[0]);
  } else {
    let data = {
      chatName: 'sender',
      users: [userId, req.rootUserId],
      isGroup: false,
    };

    try {
      const newChat = await Chat.create(data);
      const chat = await Chat.find({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

// Function to fetch all chats for a user
export const fetchAllChats = async (req, res) => {
  try {
    // Find all chats for the user, populating user details and sorting by updatedAt
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.rootUserId } },
    })
      .populate('users')
      .populate('latestMessage')
      .populate('groupAdmin')
      .sort({ updatedAt: -1 });

    // Populate latestMessage sender's details
    const finalChats = await user.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name email profilePic',
    });

    res.status(200).json(finalChats);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

// Function to create a group chat
export const creatGroup = async (req, res) => {
  const { chatName, users } = req.body;

  // Check if required fields are provided
  if (!chatName || !users) {
    res.status(400).json({ message: 'Please fill the fields' });
  }

  // Parse the list of users
  const parsedUsers = JSON.parse(users);

  // Check if there are at least two users in the group
  if (parsedUsers.length < 2)
    res.send(400).send('Group should contain more than 2 users');

  // Add the creator to the list of users
  parsedUsers.push(req.rootUser);

  try {
    // Create a new group chat
    const chat = await Chat.create({
      chatName: chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.rootUserId,
    });

    // Retrieve the created chat with populated user and admin details
    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.send(createdChat);
  } catch (error) {
    res.sendStatus(500);
  }
};

// Function to rename a group chat
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  // Check if required fields are provided
  if (!chatId || !chatName)
    res.status(400).send('Provide Chat id and Chat name');

  try {
    // Update the chat's name
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $set: { chatName },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) res.status(404);
    res.status(200).send(chat);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};



// Function to add a user to a group chat
export const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  // Find the group chat based on the provided chatId
  const existing = await Chat.findOne({ _id: chatId });

  // Check if the user is not already in the group
  if (!existing.users.includes(userId)) {
    // Add the user to the group and retrieve the updated chat
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId },
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password');

    // Check if the chat was updated successfully
    if (!chat) res.status(404);

    // Send the updated chat as a response
    res.status(200).send(chat);
  } else {
    // If the user is already in the group, send a conflict status
    res.status(409).send('User already exists in the group');
  }
};

// Function to remove a user from a group chat
export const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  // Find the group chat based on the provided chatId
  const existing = await Chat.findOne({ _id: chatId });

  // Check if the user is in the group
  if (existing.users.includes(userId)) {
    // Remove the user from the group and retrieve the updated chat
    Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId },
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password')
      .then((e) => res.status(200).send(e))
      .catch((e) => res.status(404));
  } else {
    // If the user is not in the group, send a conflict status
    res.status(409).send("User doesn't exist in the group");
  }
};

// Placeholder function to remove a contact (implementation needed)
export const removeContact = async (req, res) => {
  // Implementation for removing a contact is needed
};
