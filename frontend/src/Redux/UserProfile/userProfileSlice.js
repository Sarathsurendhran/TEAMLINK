import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileImage: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
  },
});

export const { setProfileImage } = userProfileSlice.actions;
export default userProfileSlice.reducer;
