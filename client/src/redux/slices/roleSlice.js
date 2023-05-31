import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import roleApi from "../../api/roleApi";

const moduleName = "role";

// Create Role
export const createRole = createAsyncThunk(
  `${moduleName}/create`,
  async (data, rejectWithValue) => {
    try {
      const response = await roleApi.add(data);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          data: newData,
          msg: response.data.msg,
        };
        return results;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Delete Role
export const deleteRole = createAsyncThunk(
  `${moduleName}/delete`,
  async (id, rejectWithValue) => {
    try {
      const response = await roleApi.delete(id);
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

// getAll
export const getAllRole = createAsyncThunk(
  `${moduleName}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await roleApi.getAll(params);
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

// get by ID
export const getByIdRole = createAsyncThunk(
  `${moduleName}/getById`,
  async (id, rejectWithValue) => {
    try {
      const response = await roleApi.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// update status
export const updatePublish = createAsyncThunk(
  `${moduleName}/status`,
  async (dataUpdate, { rejectWithValue }) => {
    const id = dataUpdate?.id;
    const publish = dataUpdate?.publish;
    try {
      const data = {
        publish: publish,
      };
      // const body = JSON.stringify(data);
      const response = await roleApi.updatePublish(id, data);
      if (response.result) {
        const result = {
          id: id,
          publish: publish,
          msg: response.data.msg,
        };
        toast.success(response.data.msg);
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
  `${moduleName}/updateById`,
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const body = dataUpdate?.data;
    try {
      const response = await roleApi.update(id, body);
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
  role: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
};

export const roleSlice = createSlice({
  name: "role",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const { data } = action.payload;
        state.data = state.data.length > 0 ? state.data : [];
        state.data = [data, ...state.data];
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = state.data.filter(
          (arrow) => arrow.id !== action.payload.id,
        );
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getByIdRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByIdRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataUpdate = action?.payload;
      })
      .addCase(getByIdRole.rejected, (state, action) => {
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
        // Kiểm tra dữ liệu theo hàng bắt đầu từ 0 truyền dữ liệu cho ID tại nó
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

export const selectRole = (state) => state?.role;

export default roleSlice.reducer;
