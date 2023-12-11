import mongoose from "mongoose";

// Define the structure of the Message schema
const messageSchema = mongoose.Schema(
  {
    // Reference to the sender of the message (references User model)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The content of the message
    message: {
      type: String,
      trim: true,
    },
    // Reference to the chat to which the message belongs (references Chat model)
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    // Include timestamps for created and updated timestamps
    timestamps: true,
  }
);

// Create a model named 'Message' using the messageSchema
const messageModel = mongoose.model("Message", messageSchema);

// Export the messageModel for use in other parts of the application
export default messageModel;
