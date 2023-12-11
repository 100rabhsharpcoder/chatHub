import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the structure of the User schema
const userSchema = mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: true,
    },
    // User's email (used for authentication)
    email: {
      type: String,
      required: true,
    },
    // User's hashed password
    password: {
      type: String,
      required: true,
    },
    // User's bio information (default: 'Available')
    bio: {
      type: String,
      default: 'Available',
    },
    // URL for the user's profile picture (default placeholder image)
    profilePic: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    // Array of contacts (references User model)
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // Include timestamps for created and updated timestamps
    timestamps: true,
  }
);

// Middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to generate authentication token for the user
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.SECRET,
      {
        expiresIn: '24h',
      }
    );

    return token;
  } catch (error) {
    console.log('error while generating token');
  }
};

// Create a model named 'User' using the userSchema
const userModel = mongoose.model('User', userSchema);

// Export the userModel for use in other parts of the application
export default userModel;
