import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from 'react-hot-toast'


export const signUpUser = createAsyncThunk('user/signUpUser',
  async (signUpData, { rejectWithValue }) => {
    try {

        console.log("signUpData in thunk:", signUpData);
        const response = await axiosInstance.post('/user/signUp', signUpData); // backend endpoint
        console.log("signUpUser response in thunk:", response?.data);
        return response?.data?.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to Sign Up');
    }   
});
export const loginUser = createAsyncThunk('user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/login', loginData); // backend endpoint
      console.log("loginUser response in thunk:", response?.data); 
      return response?.data?.user; 
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);


export const loginAdmin = createAsyncThunk('admin/loginAdmin',
  async (loginData, { rejectWithValue }) => {
    try {
       const adminData = {
        adminEmail: loginData.email,
        password: loginData.password
       }        

       console.log("loginAdmin thunk adminData", adminData);
      const response = await axiosInstance.post('/admin/login', adminData); // backend endpoint
      console.log("loginAdmin response thunk", response?.data) 
      return response?.data; 
    } catch (error) {
        console.log("loginAdmin error thunk: ", error.response?.data?.message);
        toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);

export const adminLogoutThunk = createAsyncThunk('admin/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
               const response = await axiosInstance.post("/admin/logout")
               return response.data
  }  catch (error) {
        console.log("loginAdmin error thunk: ", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);



export const checkAuth = createAsyncThunk('checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/check-auth'); // backend endpoint
      console.log("checkAuth response thunk", response?.data) 
      return response?.data.user; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);

export const userLogoutThunk = createAsyncThunk('user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/logout'); // backend endpoint
       
      return response?.data; 
    } catch (error) {  
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);