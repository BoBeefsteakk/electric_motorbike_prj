// File: hooks/useResetOnLeave.ts
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * Hook này sẽ tự động chạy hàm callback được truyền vào
 * mỗi khi người dùng RỜI KHỎI màn hình (Blur).
 * * @param onLeave Hàm cần thực thi khi thoát trang
 */
export const useResetOnLeave = (onLeave: () => void) => {
  useFocusEffect(
    useCallback(() => {
      // Khi màn hình được Focus: Không làm gì cả (hoặc có thể thêm logic nếu cần)
      
      return () => {
        // Khi màn hình bị Blur (Rời đi): Chạy hàm onLeave
        if (onLeave) {
          onLeave();
        }
      };
    }, [onLeave]) // Dependencies
  );
};