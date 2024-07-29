import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupId: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },

    setGroupName:(state, action)=>{
      state.groupName = action.payload
    },
  },
});

export const { setGroupId, setGroupName } = groupSlice.actions;
export default groupSlice.reducer;
