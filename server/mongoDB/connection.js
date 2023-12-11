import mongoose from "mongoose";

// Function to establish a connection with MongoDB
const mongoDBConnect = () => {
  try {
    // Connect to MongoDB using the provided URL
    mongoose.connect(process.env.URL, {
      useUnifiedTopology: true,    // Use the new Server Discover and Monitoring engine
      useNewUrlParser: true,       // Use the new URL parser
    });

    // Log a success message if the connection is successful
    console.log("MongoDB - Connected");
  } catch (error) {
    // Log an error message if there's an issue with the connection
    console.log("Error - MongoDB Connection " + error);
  }
};

// Export the mongoDBConnect function for use in other parts of the application
export default mongoDBConnect;
