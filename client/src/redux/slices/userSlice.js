import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

const modulename = "user";

//getall
export const getAllAction = createAsyncThunk(
  `${modulename}/getall`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await userApi.getAll(params);
      //   console.log("response", response);
      if (response.result) {
        const result = {
          data: response?.data,
          totalPage: response?.totalPage,
        };
        return result;
      } else {
        return rejectWithValue(response?.error[0]);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  user: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  data: [],
  dataUpdate: [],
  totalPage: 0,
};

export const userSlice = createSlice({
  name: "user",
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
      });
  },
});

export const selectUser = (state) => state?.user;

export default userSlice.reducer;
