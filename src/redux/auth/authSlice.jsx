import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicPost } from './../../services/apiCaller';

export const createAdminLogin = createAsyncThunk(
    "admin/login",
    async (data, { rejectWithValue }) => {
      try {
        console.log("data",data)
        const response = await publicPost("/login", data);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response);
      }
    }
  );

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    isLoading: false,
    user: {},
    error: false,
    errorMessage: "",
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {};
      state.token = "";
      state.error = false;
      state.errorMessage = "";
    },
    errorClean: (state) => {
      state.error = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createAdminLogin.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(createAdminLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.user = {role: "superadmin"};
      state.errorMessage = "";
      state.token = "action.payload.token";
    });
    builder.addCase(createAdminLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
      state.errorMessage = action.payload.data.message;
    });
  },
});

export const { login, logout, errorClean } = authSlice.actions;
export default authSlice.reducer;

