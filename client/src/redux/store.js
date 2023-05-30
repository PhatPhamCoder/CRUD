import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import customerReducer from "./slices/customerSlice";
import roleReducer from "./slices/roleSlice";
import feedBackReducer from "./slices/feedBackSlice";
import serithuebaoReducer from "./slices/serithuebaoSlice";
import groupDeviceStateReducer from "./slices/groupDevice";
import deviceReducer from "./slices/deviceSlice";
import userReducer from "./slices/userSlice";
import soThueBaoReducer from "./slices/soThueBaoSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    customer: customerReducer,
    role: roleReducer,
    feedBack: feedBackReducer,
    serithuebao: serithuebaoReducer,
    groupDevice: groupDeviceStateReducer,
    device: deviceReducer,
    user: userReducer,
    soThueBao: soThueBaoReducer,
  },
});

export default store;
