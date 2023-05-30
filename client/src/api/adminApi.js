import axios from "axios";
import axiosClient from "./axiosClient";

const module = "admin";

const adminApi = {
  getall: (params) => {
    return axiosClient.get(`/${module}/getall`, { params });
  },

  getById: async (id) => {
    const url = `/${module}/getbyid/${id}`;
    return await axiosClient.get(url);
  },

  login: async (body) => {
    const url = `${process.env.REACT_APP_API_URL}/${module}/login`;
    return await axios({
      method: "POST",
      url,
      data: body,
    });
  },

  forgotPassWord: async (body) => {
    const url = `${process.env.REACT_APP_API_URL}/${module}/forgot-password`;
    return await axios({ method: "POST", url, data: body });
  },

  changePassWord: async (id, data) => {
    const url = `/${module}/change-password/${id}`;
    return await axiosClient({ method: "PUT", url, data });
  },

  add: (data) => {
    return axiosClient.post(`/${module}/register`, data);
  },

  delete: (id) => {
    const url = `/${module}/delete/${id}`;
    return axiosClient.delete(url);
  },
  update: (id, body) => {
    const url = `/${module}/updatebyid/${id}`;
    return axiosClient({ method: "PUT", url, data: body });
  },
  status: (id, body) => {
    const url = `/${module}/update-active/${id}`;
    return axiosClient.put(url, body);
  },
};

export default adminApi;
