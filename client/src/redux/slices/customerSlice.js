import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customerApi from "../../api/customerApi";
import { toast } from "react-toastify";

const modulename = "customer";

//getall
export const getAllAction = createAsyncThunk(
  `${modulename}/getall`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerApi.getall(params);
      if (response.result) {
        const result = {
          data: response?.data,
          totalPage: response?.totalPage,
        };
        return result;
      } else {
        return rejectWithValue(response?.error[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Create Customer
export const createCustomer = createAsyncThunk(
  `${modulename}/create`,
  async (data, { rejectWithValue }) => {
    try {
      await customerApi.add(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Update Status by ID
export const updateStatusAction = createAsyncThunk(
  `${modulename}/status`,
  async (dataUpdate, { rejectWithValue }) => {
    try {
      const id = dataUpdate?.id;
      const active = dataUpdate?.active;
      const data = {
        active: active,
      };
      const body = JSON.stringify(data);
      const response = await customerApi.status(id, body);
      if (response.result) {
        toast.success(response?.data?.msg);
        const results = {
          msg: response?.data?.msg,
          active: active,
          id: id,
        };
        return results;
      } else {
        toast.error(response?.data?.msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Delete
export const deleteCustomer = createAsyncThunk(
  `${modulename}/delete`,
  async (id, { rejectWithValue }) => {
    try {
      const res = await customerApi.delete(id);
      if (res.result) {
        const results = {
          id: id,
          msg: res.data.msg,
        };
        return results;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// get By Id
export const getByIdCustomer = createAsyncThunk(
  `${modulename}/getByID`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerApi.getById(id);
      // console.log("Check Response get by ID", response);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error);
    }
  },
);

// update by ID
export const updateCustomerById = createAsyncThunk(
  `${modulename}/update`,
  async (dataUpdate, { rejectWithValue }) => {
    const id = dataUpdate.id;
    const data = dataUpdate.data;
    try {
      const response = await customerApi.updateById(id, data);
      if (response.result) {
        const newData = response.data.newData;
        // console.log(newData);
        const results = {
          id: id,
          newData: newData,
          dataOld: data,
          msg: response.data.msg,
        };
        return results;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error?.response?.data?.data?.msg);
    }
  },
);

const initialState = {
  customer: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
  totalPage: 0,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAction.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(getAllAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(getAllAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.ServerError = action?.error?.message;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.createdCustomer = action.payload;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.ServerError = action?.error?.message;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appError = undefined;
        state.ServerError = undefined;
        state.data = state.data.filter(
          (arrow) => arrow.id !== action.payload.id,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.ServerError = action?.error?.message;
      })
      .addCase(getByIdCustomer.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(getByIdCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataUpdate = action?.payload;
        state.appError = undefined;
        state.ServerError = undefined;
      })
      .addCase(getByIdCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.ServerError = action?.error?.message;
      })
      .addCase(updateCustomerById.pending, (state) => {
        state.isLoading = true;
        state.msgSuccess = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = action?.payload?.msg;
        state.appError = undefined;
        state.serverError = undefined;
        state.dataUpdate = action?.payload?.newData;
      })
      .addCase(updateCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectCustomer = (state) => state?.customer;

export default customerSlice.reducer;
