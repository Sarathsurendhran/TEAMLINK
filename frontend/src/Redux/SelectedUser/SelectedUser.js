import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  selectedUserName: null
};

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setselectedUserName: (state, action) => {
      state.selectedUserName = action.payload
    }
  },
});

export const { setSelectedUser, setselectedUserName } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;
