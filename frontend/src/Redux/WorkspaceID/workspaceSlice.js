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
    setWorkspaceAdmin: (state, action) => {
      state.workspaceAdmin = action.payload;
    },
  },
});

export const { setWorkspaceId, setWorkspaceName, setWorkspaceAdmin } = workspaceSlice.actions;

export default workspaceSlice.reducer;
