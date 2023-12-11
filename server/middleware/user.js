import jwt from 'jsonwebtoken';
import user from '../models/userModel.js';

// Middleware function for user authentication
export const Auth = async (req, res, next) => {
  try {
    // Extract the token from the authorization header
    let token = req.headers.authorization.split(' ')[0]; // When using browser, use this line
    // let token = req.headers.authorization.split(' ')[1]; // When using Postman, use this line

    // Check if the token length is less than 500 (assumed to be a JWT token)
    if (token.length < 500) {
      // Verify the JWT token and get the user details
      const verifiedUser = jwt.verify(token, process.env.SECRET);

      // Find the root user in the database based on the verified user ID
      const rootUser = await user
        .findOne({ _id: verifiedUser.id })
        .select('-password');

      // Set user-related properties in the request object
      req.token = token;
      req.rootUser = rootUser;
      req.rootUserId = rootUser._id;
    } else {
      // If token length is greater than 500, assume it's a Google token
      // Decode the Google token to extract user information
      let data = jwt.decode(token);

      // Set user-related properties in the request object for Google user
      req.rootUserEmail = data.email;
      const googleUser = await user
        .findOne({ email: req.rootUserEmail })
        .select('-password');

      req.rootUser = googleUser;
      req.token = token;
      req.rootUserId = googleUser._id;
    }

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid tokens
    res.json({ error: 'Invalid Token' });
  }
};
