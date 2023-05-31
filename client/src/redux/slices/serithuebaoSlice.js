import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import serithuebaoApi from "../../api/serithuebaoApi";

const module = "serithuebao";

// Create Seri
export const createSeriThueBao = createAsyncThunk(
  `${module}/create`,
  async (data, rejectWithValue) => {
    try {
      const response = await serithuebaoApi.add(data);
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

// getAll
export const getAllSeri = createAsyncThunk(
  `${module}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await serithuebaoApi.getAll(params);
      // console.log(response);
      if (response.result) {
        const result = {
          data: response.data,
          totalPage: response.totalPage,
        };
        // console.log(result);
        return result;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// getStatistics
export const getStatistics = createAsyncThunk(
  `${module}/getStatistics`,
  async (rejectWithValue) => {
    try {
      const response = await serithuebaoApi.getStatistic();
      if (response.result) {
        const result = {
          data: response.data,
        };
        // console.log(result);
        return result;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Delete Seri
export const deleteSeri = createAsyncThunk(
  `${module}/delete`,
  async (id, rejectWithValue) => {
    try {
      const response = await serithuebaoApi.delete(id);
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
export const getByIdSeri = createAsyncThunk(
  `${module}/getById`,
  async (id, rejectWithValue) => {
    try {
      const response = await serithuebaoApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// update status
export const updateStatus = createAsyncThunk(
  `${module}/status`,
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const status = dataUpdate?.status;
    try {
      const data = {
        status: status,
      };
      const response = await serithuebaoApi.updateStatus(id, data);
      if (response.result) {
        const result = {
          id: id,
          data: response.data,
          msg: response.data.msg,
        };
        return result;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      if (!error.response) {
        throw error;
      }
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
      const response = await serithuebaoApi.update(id, body);
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
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  serithuebao: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  totalPage: 0,
  message: "",
  data: [],
  dataUpdate: [],
};

export const serithuebaoSlice = createSlice({
  name: "serithuebao",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSeriThueBao.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSeriThueBao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        if (state.isSuccess) {
          toast.success(action.payload.data.msg);
        }
        const { data } = action.payload;
        state.data = state.data.length > 0 ? state.data : [];
        state.data = [data, ...state.data];
      })
      .addCase(createSeriThueBao.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllSeri.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSeri.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllSeri.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getStatistics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataStatic = action?.payload?.data;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteSeri.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSeri.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = state.data.filter(
          (arrow) => arrow.id !== action.payload.id,
        );
      })
      .addCase(deleteSeri.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getByIdSeri.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getByIdSeri.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataUpdate = action?.payload;
      })
      .addCase(getByIdSeri.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateByID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const checkIndex = state.data.findIndex(
          (row) => row.id.toString() === action?.payload?.id.toString(),
        );
        if (checkIndex >= 0) {
          state.data[checkIndex]["serithuebao"] =
            action?.payload?.newData?.serithuebao;
          state.data[checkIndex]["status"] = action?.payload?.newData?.status;
          state.data[checkIndex]["updated_at"] =
            action?.payload?.newData?.updated_at;
          state.data[checkIndex]["created_at"] =
            action?.payload?.newData?.created_at;
        }
      })
      .addCase(updateByID.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const selectSeri = (state) => state?.serithuebao;

export default serithuebaoSlice.reducer;
