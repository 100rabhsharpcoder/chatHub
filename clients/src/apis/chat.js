import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with a base URL and headers for authorization
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

// Function to create a new chat (1-on-1 chat)
export const acessCreate = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a POST request to create a new chat
    const { data } = await API(token).post('/api/chat', body);
    console.log(data); // Log the response data
    return data;
  } catch (error) {
    console.log('error in accessCreate API'); // Log an error if something goes wrong
  }
};

// Function to fetch all chats
export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a GET request to fetch all chats
    const { data } = await API(token).get('/api/chat');
    return data;
  } catch (error) {
    console.log('error in fetchAllChats API'); // Log an error if something goes wrong
  }
};

// Function to create a new group chat
export const createGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a POST request to create a new group chat
    const { data } = await API(token).post('/api/chat/group', body);
    toast.success(`${data.chatName} Group Created`); // Display a success toast
    return data;
  } catch (error) {
    console.log('error in createGroup API'); // Log an error if something goes wrong
  }
};

// Function to add users to a group chat
export const addToGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a PATCH request to add users to a group chat
    const { data } = await API(token).patch('/api/chat/groupAdd', body);
    return data;
  } catch (error) {
    console.log('error in addToGroup API'); // Log an error if something goes wrong
  }
};

// Function to rename a group chat
export const renameGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a PATCH request to rename a group chat
    const { data } = await API(token).patch('/api/chat/group/rename', body);
    return data;
  } catch (error) {
    console.log('error in renameGroup API'); // Log an error if something goes wrong
  }
};

// Function to remove a user from a group chat
export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    // Send a PATCH request to remove a user from a group chat
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    return data;
  } catch (error) {
    console.log('error in removeUser API'); // Log an error if something goes wrong
  }
};
