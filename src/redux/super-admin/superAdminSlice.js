import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet, privatePost, privatePut } from '../../services/apiCaller';

export const fetchSuperAdmins = createAsyncThunk(
  "superAdmin/fetchSuperAdmins",
  async ({ page, limit, phone, token }, { rejectWithValue }) => {
    try {
      const endpoint = `/admin/adminlist?page=${page}&limit=${limit}&phone=${phone}`;
      const response = await privateGet(endpoint, token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const fetchSuperadminCounts = createAsyncThunk(
  "superAdmin/fetchCounts",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet('/admin/counts', token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const updateSuperAdminStatus = createAsyncThunk(
  "superAdmin/updateStatus",
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      const endpoint = `/admin/super-admins/${id}/status`;
      const response = await privatePut(endpoint, token, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const fetchAdminTransactions = createAsyncThunk(
  "admin/fetchTransactions",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet('/admin/transactions', token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const addCalltoDealer = createAsyncThunk(
  "admin/addCalltoDealer",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await privatePost('/admin/sell', token, data);
      return response;
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    data: [],
    counts: null,
    meta: {
      page: 1,
      limit: 5,
      totalItems: 0,
      totalPages: 0
    },
    isLoading: false,
    error: false,
    errorMessage: "",
    transactions: null,
    iscallAddingToDealer: false,
    isAddingCall: false,
  },
  reducers: {
    clearSuperAdminError: (state) => {
      state.error = false;
      state.errorMessage = "";
    },
    resetSuperAdminState: (state) => {
      state.data = [];
      state.meta = {
        page: 1,
        limit: 5,
        totalItems: 0,
        totalPages: 0
      };
      state.error = false;
      state.errorMessage = "";
    },
    resetAdminCallAddition: (state) => {
      state.iscallAddingToDealer = false;
      state.isAddingCall = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchSuperAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
        state.errorMessage = "";
      })
      .addCase(fetchSuperAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload?.data?.message || "Failed to fetch super admins";
      })
      .addCase(fetchSuperadminCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuperadminCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.counts = action.payload;
      })
      .addCase(fetchSuperadminCounts.rejected, (state) => {
        state.isLoading = false;
        state.counts = null;
      })
      .addCase(updateSuperAdminStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSuperAdminStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        const updatedSuperAdmin = action.payload;
        state.data = state.data.map(superAdmin =>
          superAdmin.id === updatedSuperAdmin.id ? updatedSuperAdmin : superAdmin
        );
      })
      .addCase(updateSuperAdminStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload?.data?.message || "Failed to update super admin status";
      })
      .addCase(fetchAdminTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAdminTransactions.rejected, (state) => {
        state.transactions = null;
      })
      .addCase(addCalltoDealer.pending, (state) => {
        state.isAddingCall = true;
        state.iscallAddingToDealer = false;
        state.error = null;
      })
      .addCase(addCalltoDealer.fulfilled, (state) => {
        state.isAddingCall = false;
        state.iscallAddingToDealer = true;
        state.error = null;
      })
      .addCase(addCalltoDealer.rejected, (state, action) => {
        state.isAddingCall = false;
        state.iscallAddingToDealer = false;
        state.error = action.payload?.data?.message || "Failed to add call to agent";
      })
  },
});

export const { clearSuperAdminError, resetSuperAdminState, resetAdminCallAddition } = superAdminSlice.actions;
export default superAdminSlice.reducer;