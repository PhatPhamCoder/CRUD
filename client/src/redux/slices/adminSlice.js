import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

const modulename = "admin";

// Create Account
export const createAdmin = createAsyncThunk(
  `${modulename}/create`,
  async (data, rejectWithValue) => {
    try {
      return await adminApi.add(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Login Admin
export const loginAdmin = createAsyncThunk(
  `${modulename}/login`,
  async (data, rejectWithValue) => {
    try {
      const response = await adminApi.login(data);
      // console.log(response);
      if (response.data.result) {
        const result = {
          token: response?.data?.data?.accessToken,
          id: response?.data?.data?.id,
        };

        const expired = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        document.cookie = `refreshToken = ${
          response?.data?.data?.refreshToken
        };expires = ${new Date(expired)}`;
        document.cookie = `userInfo = ${
          response?.data?.data?.accessToken
        };expires = ${new Date(expired)}`;
        document.cookie = `userId = ${
          response?.data?.data?.id
        };expires = ${new Date(expired)}`;
        return result;
      } else {
        return rejectWithValue({
          msg: response?.data?.error[0].msg,
          param: response?.data?.error[0].param,
        });
      }
    } catch (error) {
      //lỗi server xập hoặc lỗi
      return rejectWithValue(error);
    }
  },
);

//logout
export const logoutAction = createAsyncThunk(
  `${modulename}/logout`,
  async (payload, { rejectWithValue }) => {
    try {
      document.cookie =
        "refreshToken = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "userInfo = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "userId = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// getAll
export const getAllAdmin = createAsyncThunk(
  `${modulename}/getAll`,
  async (params, rejectWithValue) => {
    try {
      const response = await adminApi.getall(params);
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
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error);
    }
  },
);

//delete data by id
export const deleteAction = createAsyncThunk(
  `${modulename}/delete`,
  async (id, { rejectWithValue }) => {
    try {
      // call api
      const response = await adminApi.delete(id);
      if (response.result) {
        const result = {
          id,
          msg: response.data.msg,
        };
        return result;
      } else {
        return rejectWithValue(response.errors.msg);
      }
    } catch (error) {
      // console.log('Failed to fetch data list: ', error);
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  },
);

//update status by id
export const statusPublishAction = createAsyncThunk(
  `${modulename}/status`,
  async (dataUpdate, { rejectWithValue }) => {
    const id = dataUpdate?.id;
    const active = dataUpdate?.active;
    try {
      const data = {
        active: active,
      };
      const body = JSON.stringify(data); //Chuyển về dạng String
      const response = await adminApi.status(id, body);
      if (response.result) {
        const results = {
          msg: response.data.msg,
          active: active,
          id: id,
        };
        return results;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      // console.log('Failed to fetch data list: ', error);
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  },
);

//get data by id
export const getByIdAction = createAsyncThunk(
  `${modulename}/getById`,
  async (id, { rejectWithValue }) => {
    try {
      // call Api
      const response = await adminApi.getById(id);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  },
);

//update data by ID
export const updateDataAction = createAsyncThunk(
  `${modulename}/update`,
  async (dataUpdate, { rejectWithValue }) => {
    const id = dataUpdate.id;
    const data = dataUpdate.data;
    try {
      // call Api
      const response = await adminApi.update(id, data);

      if (response.result) {
        const newData = response.data.newData;
        const results = {
          id: id,
          newData: newData,
          msg: response.data.msg,
        };
        return results;
      } else {
        // console.log('response.errors[0].msg', response.errors);
        return rejectWithValue(response.error);
      }
    } catch (error) {
      // console.log('Failed to fetch data list: ', error);
      if (!error.response) {
        throw error;
      }
      // console.log('error?.response?.data', error?.response?.data?.data?.msg);

      return rejectWithValue(error?.response?.data?.data?.msg);
    }
  },
);

//forgot password
export const forgotPasssWordAction = createAsyncThunk(
  `${modulename}/forgotPassWord`,
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminApi.forgotPassWord(data);
      if (!response?.data?.result) {
        return rejectWithValue(response?.data?.error[0]);
      }
      const result = {
        msg: response?.data?.data?.msg,
      };
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//change password
export const changePassWordAction = createAsyncThunk(
  `${modulename}/changePassword`,
  async (changePass, { rejectWithValue }) => {
    try {
      const id = changePass.id;
      const body = {
        password: changePass.data.password,
        passwordNew: changePass.data.passwordNew,
      };
      const response = await adminApi.changePassWord(id, body);
      if (!response.result) {
        return rejectWithValue(response.error);
      }
      const result = {
        msg: response?.data?.msg,
      };
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const arrCookies = document.cookie.split(";");
let idLogin = null;
let userLogin = null;
arrCookies.forEach((arrCookie) => {
  if (arrCookie.indexOf("userId=") !== -1) {
    idLogin = arrCookie.slice(
      arrCookie.indexOf("userId=") + 7,
      arrCookie.length,
    );
  }
  if (arrCookie.indexOf("userInfo=") !== -1) {
    userLogin = arrCookie.slice(
      arrCookie.indexOf("userInfo=") + 9,
      arrCookie.length,
    );
  }
});

const initialState = {
  admin: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  userAuth: {
    token: userLogin,
    id: idLogin,
  },
  data: [],
  dataUpdate: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdAdmin = action.payload;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.data = action?.payload?.data;
        state.totalPage = action?.payload?.totalPage;
      })
      .addCase(getAllAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAuth.token = action?.payload?.token;
        state.userAuth.id = action?.payload?.id;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(logoutAction.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(logoutAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appError = undefined;
        state.userAuth = undefined;
        state.serverError = undefined;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(deleteAction.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.id;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(statusPublishAction.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(statusPublishAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataUpdate = action.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(statusPublishAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(getByIdAction.pending, (state) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataUpdate = action.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(updateDataAction.pending, (state, action) => {
        state.isLoading = true;
        state.msgSuccess = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = action?.payload?.msg;
        if (state.msgSuccess) {
          toast.success(action?.payload?.msg);
        }
        state.appError = undefined;
        state.serverError = undefined;
        state.userAuth.info = action.payload.newData;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
        state.isLoading = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(forgotPasssWordAction.pending, (state, action) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(forgotPasssWordAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.msg = action?.payload?.msg;
        if (state.msg) {
          toast.success(action?.payload?.msg);
        }
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(forgotPasssWordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      })
      .addCase(changePassWordAction.pending, (state, action) => {
        state.isLoading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(changePassWordAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.msg = action?.payload?.msg;
        if (state.msg) {
          toast.success(action?.payload?.msg);
        }
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(changePassWordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectAdmin = (state) => state?.admin;

export default adminSlice.reducer;
