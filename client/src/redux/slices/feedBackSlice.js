import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import feedBackApi from "../../api/feedBackApi";
import { toast } from "react-toastify";

const module = "feedBack";

// Create feedback
export const createFeedBack = createAsyncThunk(
  `${module}/create`,
  async (data, rejectWithValue) => {
    try {
      await feedBackApi.add(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// getAll
export const getAllFeedBack = createAsyncThunk(
  `${module}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await feedBackApi.getAll(params);
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

// delete
export const deleteFeedback = createAsyncThunk(
  `${module}/delete`,
  async (id, rejectWithValue) => {
    try {
      return feedBackApi.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  feedBack: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
};

export const feedBackSlice = createSlice({
  name: "feedBack",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFeedBack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFeedBack.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        if (state.isSuccess) {
          toast.success("Thêm FeedBack Thành công");
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      })
      .addCase(createFeedBack.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllFeedBack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFeedBack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllFeedBack.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeedback.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const selectFeedBack = (state) => state?.feedBack;

export default feedBackSlice.reducer;
