import axios from "axios";
import axiosClient from "./axiosClient";

const module = "serithuebao";

const serithuebaoApi = {
  getAll: (params) => {
    const url = `/${module}/getall`;
    return axiosClient.get(url, { params });
  },

  getById: (id) => {
    const url = `/${module}/getbyid/${id}`;
    return axiosClient.get(url);
  },

  add: (data) => {
    const url = `/${module}/register`;
    return axiosClient.post(url, data);
  },

  update: (id, body) => {
    const url = `/${module}/updatebyid/${id}`;
    return axiosClient.put(url, body);
  },

  updateStatus: (id, body) => {
    const url = `/${module}/update-status/${id}`;
    return axiosClient.put(url, body);
  },

  getStatistic: () => {
    const url = `/${module}/statistics`;
    return axiosClient.get(url);
  },

  delete: (id) => {
    const url = `/${module}/delete/${id}`;
    return axiosClient.delete(url);
  },

  importExcel: (body) => {
    const url = `http://localhost:3009/api/${module}/upload-excel`;
    return axios({ method: "POST", url, data: body });
  },
};
export default serithuebaoApi;
