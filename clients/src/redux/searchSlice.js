// Import createSlice and createAsyncThunk functions from "@reduxjs/toolkit"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Import toast from 'react-toastify' for displaying error messages
import { toast } from 'react-toastify';

// Import searchUsers function from the '../apis/auth' file
import { searchUsers } from '../apis/auth';

// Initial state for the search slice
const initialState = {
  searchResults: [], // Holds the results of the search
  isLoading: false,  // Indicates if a search request is in progress
  isError: false,    // Indicates if there was an error during the search request
};

// Create an asynchronous thunk for searching users
export const searchUserThunk = createAsyncThunk(
  'redux/searchUser', // Action type string
  async (search) => {
    try {
      // Call the searchUsers function from the API with the provided search parameter
      const { data } = await searchUsers(search);
      return data; // Return the data (search results)
    } catch (error) {
      // Handle errors by displaying an error toast
      toast.error('Something Went Wrong. Try Again!');
      // Throw the error so that it can be caught by the rejected action
      throw error;
    }
  }
);

// Create a slice for managing the search state
const searchSlice = createSlice({
  name: 'search', // Slice name
  initialState,   // Initial state
  reducers: {},    // No additional reducers defined for now
  extraReducers: {
    // Handle pending state for the searchUserThunk
    [searchUserThunk.pending]: (state) => {
      state.isLoading = true; // Set isLoading to true when the search request is pending
    },
    // Handle fulfilled state for the searchUserThunk
    [searchUserThunk.fulfilled]: (state, { payload }) => {
      state.searchResults = payload; // Set searchResults to the payload (search results)
      state.isLoading = false;       // Set isLoading to false when the search request is fulfilled
    },
    // Handle rejected state for the searchUserThunk
    [searchUserThunk.rejected]: (state) => {
      state.isError = true; // Set isError to true when there is an error during the search request
    },
  },
});

// Export the reducer from the searchSlice
export default searchSlice.reducer;
