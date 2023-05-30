import axiosClient from "./axiosClient";

const module = "device";

const deviceApi = {
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

  updatePublish: (id, body) => {
    const url = `/${module}/update-publish/${id}`;
    return axiosClient.put(url, body);
  },

  delete: (id) => {
    const url = `/${module}/delete/${id}`;
    return axiosClient.delete(url);
  },
};
export default deviceApi;
