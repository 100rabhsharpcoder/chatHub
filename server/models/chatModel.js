import mongoose from 'mongoose';

// Define the structure of the Chat schema
const chatSchema = mongoose.Schema(
  {
    // Default photo URL for the chat (if not specified)
    photo: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/9790/9790561.png',
    },
    // Name of the chat (used for group chats)
    chatName: {
      type: String,
    },
    // Indicates whether the chat is a group chat or not
    isGroup: {
      type: Boolean,
      default: false,
    },
    // Users participating in the chat (references User model)
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Reference to the latest message in the chat (references Message model)
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    // Reference to the group admin user (for group chats)
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Include timestamps for created and updated timestamps
    timestamps: true,
  }
);

// Create a model named 'Chat' using the chatSchema
const chatModel = mongoose.model('Chat', chatSchema);

// Export the chatModel for use in other parts of the application
export default chatModel;
