import axiosClient from "./axiosClient";

const module = "sothuebao";

const soThueBaoApi = {
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
};
export default soThueBaoApi;
