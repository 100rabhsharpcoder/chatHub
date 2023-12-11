// Import createSlice function from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the active user
const initialState = {
  id: '',
  email: '',
  profilePic: '',
  bio: '',
  name: '',
};

// Create a slice for managing the active user state
const activeUserSlice = createSlice({
  name: 'activeUser', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer to set the entire active user data
    setActiveUser: (state, { payload }) => {
      state.id = payload.id;
      state.email = payload.email;
      state.profilePic = payload.profilePic;
      state.bio = payload.bio;
      state.name = payload.name;
    },
    
    // Reducer to update the name and bio of the active user
    setUserNameAndBio: (state, { payload }) => {
      state.name = payload.name;
      state.bio = payload.bio;
    },
  },
});

// Export action creators and the reducer from the activeUserSlice
export const { setActiveUser, setUserNameAndBio } = activeUserSlice.actions;
export default activeUserSlice.reducer;
