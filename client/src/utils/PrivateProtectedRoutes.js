import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import configs from "../configs";

const useAuth = () => {
  // const userToken = localStorage.getItem('userInfo');
  const arrCookies = document.cookie.split(";");
  let userid = false;
  arrCookies.forEach((arrCookie) => {
    if (arrCookie.indexOf("userId=") !== -1) {
      userid = true;
    }
  });
  // console.log(userid);

  return userid;
};

const PrivateProtectedRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={configs.routes.login} />;
};

export default PrivateProtectedRoute;
