import axiosClient from './axios';

export const motorbikeApi = {
  getList: (params?: any) => {
    return axiosClient.get('/motorbikes', { params });
  },

  getDetail: (id: string) => {
    return axiosClient.get(`/motorbikes/${id}`);
  }
};