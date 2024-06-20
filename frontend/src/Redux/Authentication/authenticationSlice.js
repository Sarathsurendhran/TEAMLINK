import {createSlice} from "@reduxjs/toolkit"

export const  authenticationSlice = createSlice({
  name:'authentication_user',
  initialState:{
    id:null,
    username:null,
    isAuthenticated:false,
    isAdmin:false,

 },

 reducers:{
    setAuthentication:(state, action)=>{
      state.id = action.payload.id
      state.username = action.payload.username
      state.isAuthenticated = action.payload.isAuthenticated
      state.isAdmin = action.payload.isAdmin
    }
 }
}) 

export const {setAuthentication} = authenticationSlice.actions
export default authenticationSlice.reducer