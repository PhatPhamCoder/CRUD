import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import roleApi from "../../api/roleApi";

const moduleName = "role";

// Create Role
export const createRole = createAsyncThunk(
  `${moduleName}/create`,
  async (data, rejectWithValue) => {
    try {
      return await roleApi.add(data);
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
      return await roleApi.delete(id);
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
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const publish = dataUpdate?.active;
    try {
      const data = {
        publish: publish,
      };
      const body = JSON.stringify(data);
      const response = await roleApi.updatePublish(id, body);
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
      .addCase(createRole.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
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
        state.data = action?.payload?.id;
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
      });
  },
});

export const selectRole = (state) => state?.role;

export default roleSlice.reducer;
