import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import groupDeviceApi from "../../api/groupDeviceApi";

const module = "groupDevice";

// Create Account
export const createGroupDevice = createAsyncThunk(
  `${module}/create`,
  async (data, { rejectWithValue }) => {
    try {
      const response = await groupDeviceApi.add(data);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          data: newData,
          msg: response.data.msg,
        };
        return results;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// getAll
export const getAllGroupDevice = createAsyncThunk(
  `${module}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await groupDeviceApi.getAll(params);
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
export const deleteGroupDevice = createAsyncThunk(
  `${module}/delete`,
  async (id, rejectWithValue) => {
    try {
      const response = await groupDeviceApi.delete(id);
      if (response.result) {
        const results = {
          id: id,
          msg: response.data.msg,
        };
        return results;
      } else {
        return rejectWithValue(response.errors?.[0]?.msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// get by ID
export const getByIdGroupDevice = createAsyncThunk(
  `${module}/getById`,
  async (id, rejectWithValue) => {
    try {
      const response = await groupDeviceApi.getById(id);
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
      // const body = JSON.stringify(data);
      const response = await groupDeviceApi.updatePublish(id, data);
      if (response.result) {
        const results = {
          id: id,
          publish: publish,
          msg: response.data.msg,
        };
        toast.success(response.data.msg);
        return results;
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
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const body = dataUpdate?.data;
    try {
      const response = await groupDeviceApi.update(id, body);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          id: id,
          newData: newData,
          msg: response.data.msg,
        };
        // console.log(results);
        return results;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  groupDevice: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
};

export const groupDeviceSlice = createSlice({
  name: "groupDevice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroupDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroupDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const { data } = action.payload;
        state.data = state.data.length > 0 ? state.data : [];
        state.data = [data, ...state.data];
      })
      .addCase(createGroupDevice.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAllGroupDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGroupDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllGroupDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteGroupDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGroupDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = state.data.filter(
          (arrow) => arrow.id !== action.payload.id,
        );
      })
      .addCase(deleteGroupDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getByIdGroupDevice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByIdGroupDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataUpdate = action?.payload;
      })
      .addCase(getByIdGroupDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateByID.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appError = undefined;
        state.serverError = undefined;
        const checkIndex = state.data.findIndex(
          (row) => row.id.toString() === action.payload.id.toString(),
        );
        if (checkIndex >= 0) {
          state.data[checkIndex]["name"] = action?.payload?.newData?.name;
          state.data[checkIndex]["publish"] = action?.payload?.newData?.publish;
          state.data[checkIndex]["updated_at"] =
            action?.payload?.newData?.updated_at;
          state.data[checkIndex]["created_at"] =
            action?.payload?.newData?.created_at;
        }
      })
      .addCase(updateByID.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(updatePublish.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updatePublish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appError = undefined;
        state.serverError = undefined;
        const checkIndex = state.data.findIndex(
          (row) => row.id.toString() === action?.payload?.id.toString(),
        );
        if (checkIndex >= 0) {
          state.data[checkIndex].publish = action?.payload?.publish;
        }
      })
      .addCase(updatePublish.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectGroupDevice = (state) => state?.groupDevice;

export default groupDeviceSlice.reducer;
