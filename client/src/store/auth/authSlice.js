import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  loginAdmin,
  checkAuth,
  signUpUser,
  userLogoutThunk,
  adminLogoutThunk,
} from "./authThunk";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  admin: null,
  role: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // USER LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = "user";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN LOGIN
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        // console.log("admin logged in:", action.payload);
        state.role = "admin";
      })

      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = "user";
      })

      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REFRESH
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (action.payload.role === "admin") {
          state.admin = action.payload;
        } else {
          state.user = action.payload;
          console.log(state.user)
        }
        state.role = action.payload.role;
      })

      // USER LOGOUT
      .addCase(userLogoutThunk.pending, (state) => {})
      .addCase(userLogoutThunk.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.role = null;
        state.user = null;
      })
      .addCase(userLogoutThunk.rejected, (state, action) => {
        
      })
      .addCase(adminLogoutThunk.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.role = null;
        state.admin = null;
      })
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
