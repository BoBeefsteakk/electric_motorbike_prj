import axiosClient from './axios'; // Đảm bảo đường dẫn import đúng với file của bạn nhé

export const cartApi = {
  // 1. Hàm lấy giỏ hàng của User
  getCart: async (userId: string) => {
    try {
      // baseURL đã có sẵn ".../api", nên ở đây chỉ cần nối thêm "/cart/..."
      const response = await axiosClient.get(`/cart/${userId}`);
      return response.data; 
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ API:", error);
      throw error;
    }
  },

  // 2. Hàm thêm sản phẩm vào giỏ hàng
  addToCart: async (userId: string, productId: string, quantity: number = 1) => {
    try {
      const response = await axiosClient.post(`/cart/add`, {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  },

  // 3. Hàm cập nhật số lượng (dựa theo router bạn gửi lúc đầu)
  updateQuantity: async (userId: string, productId: string, quantity: number) => {
    try {
      const response = await axiosClient.post(`/cart/update-quantity`, {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      throw error;
    }
  },

  // 4. Hàm xóa sản phẩm khỏi giỏ
  removeCartItem: async (userId: string, productId: string) => {
    try {
      const response = await axiosClient.post(`/cart/remove-item`, {
        userId,
        productId
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  }
};