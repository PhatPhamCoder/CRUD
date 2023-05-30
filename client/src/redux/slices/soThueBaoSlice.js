import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import soThueBaoApi from "../../api/soThueBaoApi";

const module = "sothuebao";

// Create
export const createSoThueBao = createAsyncThunk(
  `${module}/create`,
  async (data, rejectWithValue) => {
    try {
      return await soThueBaoApi.add(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// GetAll
export const getAllThueBao = createAsyncThunk(
  `${module}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await soThueBaoApi.getAll(params);
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

// update Status
export const updateStatus = createAsyncThunk(
  `${module}/updateStatus`,
  async (dataUpdate, rejectWithValue) => {
    const id = dataUpdate?.id;
    const status = dataUpdate?.status;
    try {
      const data = {
        status: status,
      };
      const response = await soThueBaoApi.updateStatus(id, data);
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
      return rejectWithValue(error);
    }
  },
);

// delete
export const deleteSoThueBao = createAsyncThunk(
  `${module}/delete`,
  async (id, rejectWithValue) => {
    try {
      const response = await soThueBaoApi.delete(id);
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
      return rejectWithValue(error);
    }
  },
);

// getbyID
export const getById = createAsyncThunk(
  `${module}/getById`,
  async (id, rejectWithValue) => {
    try {
      const response = await soThueBaoApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// updateById
export const updateById = createAsyncThunk(
  `${module}/update`,
  async (datas, rejectWithValue) => {
    const id = datas?.id;
    const data = datas?.data;
    try {
      const response = await soThueBaoApi.update(id, data);
      if (response.result) {
        const newData = response.data.newData;
        const results = {
          id: id,
          status: data.status,
          newData: newData,
          msg: response.data.msg,
        };
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return results;
      } else {
        return rejectWithValue(response.errors[0]);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  sothuebao: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  totalPage: 0,
  message: "",
  data: [],
  dataUpdate: [],
};

export const soThueBaoSlice = createSlice({
  name: "sothuebao",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSoThueBao.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSoThueBao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        if (state.isSuccess) {
          toast.success(action.payload.data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      })
      .addCase(createSoThueBao.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllThueBao.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllThueBao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllThueBao.rejected, (state, action) => {
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
        state.dataUpdate = action?.payload;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteSoThueBao.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSoThueBao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteSoThueBao.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dataUpdate = action.payload;
      })
      .addCase(getById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const selectSoThueBao = (state) => state?.soThueBao;

export default soThueBaoSlice.reducer;
