// Import createAsyncThunk and createSlice functions from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Import the toast module from 'react-toastify'
import { toast } from 'react-toastify';

// Import the fetchAllChats function from the 'chat' API
import { fetchAllChats } from '../apis/chat';

// Initial state for the chats slice
const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
};

// Create an asynchronous thunk to fetch all chats
export const fetchChats = createAsyncThunk('redux/chats', async () => {
  try {
    // Call the API function to fetch all chats
    const data = await fetchAllChats();
    return data;
  } catch (error) {
    // Display an error toast if fetching chats fails
    toast.error('Something Went Wrong! Try Again');
  }
});

// Create a slice for managing the chats state
const chatsSlice = createSlice({
  name: 'chats', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer to set the active chat
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
    
    // Reducer to set the notifications
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },
  extraReducers: {
    // Extra reducers to handle the asynchronous thunk lifecycle
    [fetchChats.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChats.fulfilled]: (state, { payload }) => {
      state.chats = payload;
      state.isLoading = false;
    },
    [fetchChats.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

// Export action creators and the reducer from the chatsSlice
export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;
