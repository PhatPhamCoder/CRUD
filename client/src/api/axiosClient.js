import axios from "axios";
import jwtDecode from "jwt-decode";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const arrCookies = document.cookie.split(";");
  let refreshToken;
  let token;
  let userId;
  arrCookies.forEach((arrCookie) => {
    if (arrCookie.indexOf("refreshToken=") !== -1) {
      refreshToken = arrCookie.slice(
        arrCookie.indexOf("refreshToken=") + 13,
        arrCookie.length,
      );
    }
    if (arrCookie.indexOf("userInfo=") !== -1) {
      token = arrCookie.slice(
        arrCookie.indexOf("userInfo=") + 9,
        arrCookie.length,
      );
    }
    if (arrCookie.indexOf("userId=") !== -1) {
      userId = arrCookie.slice(
        arrCookie.indexOf("userId=") + 7,
        arrCookie.length,
      );
    }
  });

  const decodeToken = jwtDecode(token.slice(0, token.length - 1));
  if (decodeToken.exp < new Date().getTime() / 1000) {
    try {
      const res = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/admin/refresh-token`,
        data: { userId, refreshToken },
      });
      console.log(res);
      if (!res?.data?.result) {
        if (res?.data?.error[0]?.msg === "dangerous") {
          document.cookie =
            "refreshToken = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
          document.cookie =
            "userInfo = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
          document.cookie = "userId = ;expires = Thu, 01 Jan 1970 00:00:00 UTC";
          // window.location.reload();
          return;
        }
      }
      const expired = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      // console.log(new Date(expired));
      document.cookie = `refreshToken = ${
        res?.data?.data[0]?.refreshToken
      };expires = ${new Date(expired)}`;
      document.cookie = `userInfo = ${
        res?.data?.data[0]?.accessToken
      };expires = ${new Date(expired)}`;
      config.headers.Authorization = `Bearer ${res?.data?.data[0]?.accessToken}`;
    } catch (error) {
      console.log("refreshToken", error);
    }
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const axiosUpload = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosClient.interceptors.response.use(
  (response) => {
    // console.log('response', response);
    if (response && response.data) {
      // console.log('response.data.result', response.data.result);

      return response.data;
    }

    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  },
);

export default axiosClient;
