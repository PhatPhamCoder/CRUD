import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import groupDeviceApi from "../../api/groupDeviceApi";

const module = "groupDevice";

// Create Account
export const createGroupDevice = createAsyncThunk(
  `${module}/create`,
  async (data, rejectWithValue) => {
    try {
      return await groupDeviceApi.add(data);
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
      return await groupDeviceApi.delete(id);
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
        toast.success(response.data.msg);
        window.location.reload();
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
      .addCase(createGroupDevice.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        if (state.isSuccess) {
          toast.success("Thêm thành công");
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      })
      .addCase(createGroupDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
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
        state.data = action?.payload?.id;
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

export const selectGroupDevice = (state) => state?.groupDevice;

export default groupDeviceSlice.reducer;
