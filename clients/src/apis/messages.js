import axios from 'axios';

// Create an axios instance with a base URL and headers for authorization
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

// Function to send a new message
export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a POST request to create a new message
    const { data } = await API(token).post('/api/message/', body);
    return data; // Return the response data
  } catch (error) {
    console.log('error in sendMessage API: ' + error); // Log an error if something goes wrong
  }
};

// Function to fetch messages for a specific chat
export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a GET request to fetch messages for a specific chat
    const { data } = await API(token).get(`/api/message/${id}`);
    return data; // Return the fetched data
  } catch (error) {
    console.log('error in fetchMessages API: ' + error); // Log an error if something goes wrong
  }
};
