// Import createSlice function from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the profile slice
const initialState = {
  showProfile: false,
  showNotifications: false,
};

// Create a slice for managing the profile state
const profileSlice = createSlice({
  name: "profile", // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer to set the showProfile state
    setShowProfile: (state, { payload }) => {
      state.showProfile = payload;
    },
    
    // Reducer to set the showNotifications state
    setShowNotifications: (state, { payload }) => {
      state.showNotifications = payload;
    },
  },
});

// Export action creators and the reducer from the profileSlice
export const { setShowProfile, setShowNotifications } = profileSlice.actions;
export default profileSlice.reducer;
