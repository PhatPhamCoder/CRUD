import axiosClient from "./axiosClient";

const module = "user";

const userApi = {
  getAll: (params) => {
    const url = `/${module}/getall`;
    return axiosClient.get(url, { params });
  },
};
export default userApi;
