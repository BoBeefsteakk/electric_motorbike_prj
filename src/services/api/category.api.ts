import axiosClient from "./axios";

export const categoryApi = {
  // Sửa dòng này: thêm dấu ? vào sau chữ type
  // Từ (type: string) -> thành (type?: string)
  getList: (type?: string) => {
    return axiosClient.get('/categories', { params: { type } });
  },

};
