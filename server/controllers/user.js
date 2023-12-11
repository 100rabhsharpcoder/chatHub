import user from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

// Function to register a new user
export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // Check if the user with the provided email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    // Create a new user with the provided details
    const fullname = firstname + ' ' + lastname;
    const newuser = new user({ email, password, name: fullname });
    
    // Generate an authentication token for the new user
    const token = await newuser.generateAuthToken();

    // Save the new user to the database
    await newuser.save();

    // Send a success response with the authentication token
    res.json({ message: 'success', token: token });
  } catch (error) {
    console.log('Error in register ' + error);
    res.status(500).send(error);
  }
};

// Function to log in an existing user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if a user with the provided email exists
    const valid = await user.findOne({ email });
    if (!valid) res.status(200).json({ message: 'User does not exist' });

    // Compare the provided password with the stored password using bcrypt
    const validPassword = await bcrypt.compare(password, valid.password);

    if (!validPassword) {
      res.status(200).json({ message: 'Invalid Credentials' });
    } else {
      // Generate an authentication token for the user
      const token = await valid.generateAuthToken();
      
      // Save the user and set an HTTP-only cookie with the token
      await valid.save();
      res.cookie('userToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send a success response with the authentication token
      res.status(200).json({ token: token, status: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Function to get details of a valid user
export const validUser = async (req, res) => {
  try {
    // Find and select the user details excluding the password
    const validuser = await user
      .findOne({ _id: req.rootUserId })
      .select('-password');

    if (!validuser) res.json({ message: 'User is not valid' });

    // Send a success response with the user details and token
    res.status(201).json({
      user: validuser,
      token: req.token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

// Function for Google authentication
export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const client = new OAuth2Client(process.env.CLIENT_ID);

    // Verify the Google ID token
    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });

    const { email_verified, email, name, picture } = verify.payload;

    if (!email_verified) res.json({ message: 'Email Not Verified' });

    // Check if the user already exists
    const userExist = await user.findOne({ email }).select('-password');

    if (userExist) {
      // If user exists, set an HTTP-only cookie with the token
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      // Send a success response with the token and user details
      res.status(200).json({ token: tokenId, user: userExist });
    } else {
      // If user doesn't exist, create a new user with Google credentials
      const password = email + process.env.CLIENT_ID;
      const newUser = await user({
        name: name,
        profilePic: picture,
        password,
        email,
      });
      await newUser.save();
      
      // Set an HTTP-only cookie with the token
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      // Send a success response with the token
      res.status(200).json({ message: 'User registered successfully', token: tokenId });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log('Error in googleAuth backend' + error);
  }
};

// Function to logout a user
export const logout = (req, res) => {
  // Remove the token from the user's tokens array
  req.rootUser.tokens = req.rootUser.tokens.filter((e) => e.token != req.token);
};

// Function to search for users based on name or email
export const searchUsers = async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  // Find users matching the search criteria, excluding the current user
  const users = await user.find(search).find({ _id: { $ne: req.rootUserId } });

  // Send the retrieved users as a response
  res.status(200).send(users);
};

// Function to get user details by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID and exclude the password
    const selectedUser = await user.findOne({ _id: id }).select('-password');
    res.status(200).json(selectedUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Function to update user information (name, bio)
export const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { bio, name } = req.body;

  // Update user information based on the provided data
  const updatedUser = await user.findByIdAndUpdate(id, { name, bio });

  // Return the updated user
  return updatedUser;
};
