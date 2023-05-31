import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import groupDeviceApi from "../../api/groupDeviceApi";
import deviceApi from "../../api/deviceApi";

const module = "device";

// Create Device
export const createDevice = createAsyncThunk(
  `${module}/create`,
  async (data, rejectWithValue) => {
    try {
      // console.log(data);
      // call Api
      const response = await deviceApi.add(data);
      // console.log(response);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          data: newData,
          msg: response.data.msg,
        };
        return results;
      } else {
        toast.error(response.error);
        return rejectWithValue(response.error);
      }
    } catch (error) {
      // console.log("Failed to fetch data list: ", error);
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response);
    }
  },
);

// getAll
export const getAllDevice = createAsyncThunk(
  `${module}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await deviceApi.getAll(params);
      if (response.result) {
        const result = {
          data: response.data,
          totalPage: response.totalPage,
        };
        return result;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Delete Account
export const deleteDevice = createAsyncThunk(
  `${module}/delete`,
  async (id, rejectWithValue) => {
    try {
      const response = await deviceApi.delete(id);
      if (response.result) {
        const results = {
          id: id,
          msg: response.data.msg,
        };
        return results;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// get by ID
export const getByIdDevice = createAsyncThunk(
  `${module}/getById`,
  async (id, rejectWithValue) => {
    try {
      const response = await deviceApi.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// update status
export const updatePublish = createAsyncThunk(
  `${module}/publish`,
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const publish = dataUpdate?.publish;
    try {
      const data = {
        publish: publish,
      };
      const body = JSON.stringify(data);
      const response = await groupDeviceApi.updatePublish(id, body);
      if (response.result) {
        const result = {
          data: response.data,
          msg: response.data.msg,
        };
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return result;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// updateById
export const updateByID = createAsyncThunk(
  `${module}/updateById`,
  async (dataUpdate, { rejectWithValue }) => {
    const id = dataUpdate?.id;
    const data = dataUpdate?.data;
    try {
      const response = await deviceApi.update(id, data);
      console.log(response);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          id: id,
          newData: newData,
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
      return rejectWithValue(error?.response?.error[0].msg);
    }
  },
);

const initialState = {
  device: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
};

export const deviceSlice = createSlice({
  name: "device",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // cập nhật data vừa add và hiển thị lên listItem
        const { data } = action?.payload;
        state.data = state.data?.length > 0 ? state.data : [];
        state.data = [data, ...state.data];
        // state.msgSuccess = action?.payload?.msg;
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = state.data.filter(
          (arrow) => arrow.id !== action.payload.id,
        );
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getByIdDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByIdDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataUpdate = action?.payload;
      })
      .addCase(getByIdDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateByID.pending, (state) => {
        state.isLoading = true;
        state.msgSuccess = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = action?.payload?.msg;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateByID.rejected, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectDevice = (state) => state?.device;

export default deviceSlice.reducer;
