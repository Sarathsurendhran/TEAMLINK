import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaceId: null,
}


const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers:{
    setWorkspaceId:(state, action)=>{
      state.workspaceId = action.payload
    }
  }
})

export const {setWorkspaceId} = workspaceSlice.actions

export default workspaceSlice.reducer