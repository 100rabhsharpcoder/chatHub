import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with a base URL and headers for authorization
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

// Retrieve the server URL from environment variables
let url = process.env.REACT_APP_SERVER_URL;

// Function to log in a user
export const loginUser = async (body) => {
  try {
    return await axios.post(`${url}/auth/login`, body);
  } catch (error) {
    console.log('error in loginUser API');
  }
};

// Function for Google authentication
export const googleAuth = async (body) => {
  try {
    return await axios.post(`${url}/api/google`, body);
  } catch (error) {
    console.log(error);
  }
};

// Function to register a new user
export const registerUser = async (body) => {
  try {
    return await axios.post(`${url}/auth/register`, body);
  } catch (error) {
    console.log('error in registerUser API');
  }
};

// Function to check if a user is valid (authenticated)
export const validUser = async () => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).get(`/auth/valid`, {
      headers: { Authorization: token },
    });
    return data;
  } catch (error) {
    console.log('error in validUser API');
  }
};

// Function to search for users
export const searchUsers = async (id) => {
  try {
    const token = localStorage.getItem('userToken');

    return await API(token).get(`/api/user?search=${id}`);
  } catch (error) {
    console.log('error in searchUsers API');
  }
};

// Function to update user information
export const updateUser = async (id, body) => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).patch(`/api/users/update/${id}`, body);
    return data;
  } catch (error) {
    console.log('error in updateUser API');
    toast.error('Something went wrong. Try again!');
  }
};

// Function to check if a user is valid and redirect accordingly
export const checkValid = async () => {
  const data = await validUser();
  if (!data?.user) {
    window.location.href = '/login';
  } else {
    window.location.href = '/chats';
  }
};
