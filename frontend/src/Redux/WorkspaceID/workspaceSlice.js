import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaceId: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaceId: (state, action) => {
      state.workspaceId = action.payload;
    },
    setWorkspaceName: (state, action) => {
      state.workspaceName = action.payload;
    },
  },
});

export const { setWorkspaceId, setWorkspaceName } = workspaceSlice.actions;

export default workspaceSlice.reducer;
