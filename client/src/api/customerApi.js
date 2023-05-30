import axiosClient from "./axiosClient";

const module = "customer";

const customerApi = {
  getall: (params) => {
    const url = `/${module}/getall`;
    return axiosClient({ method: "GET", url, params });
  },

  add: (data) => {
    return axiosClient.post(`/${module}/register`, { data });
  },

  delete: (id) => {
    return axiosClient.delete(`/${module}/delete/${id}`);
  },

  getById: async (id) => {
    return await axiosClient.get(`/${module}/getbyid/${id}`);
  },

  updateById: (id, body) => {
    const url = `/${module}/updatebyid/${id}`;
    return axiosClient({ method: "PUT", url, data: body });
  },

  status: (id, body) => {
    return axiosClient.put(`/${module}/update-active/${id}`, body);
  },
};
export default customerApi;
