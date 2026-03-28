import axiosClient from './axios';

export const carApi = {
  // params sẽ chứa: { maxPrice, rating, category... }
  getList: (params?: any) => {
    return axiosClient.get('/car', { params });
  },
  
  getDetail: (id: string) => {
    return axiosClient.get(`/car/${id}`);
  }
};