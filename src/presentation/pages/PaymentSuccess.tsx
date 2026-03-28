import { Feather } from '@expo/vector-icons'; // Sử dụng icon vector thay vì emoji
import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentSuccessScreen({ navigation, route }: any) {
  const scaleAnim = new Animated.Value(0);
  // Lấy orderId từ params
  const orderId = route?.params?.orderId || 'RE123456';

  useEffect(() => {
    // Hiệu ứng bung icon khi vào màn hình
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Vùng icon thành công */}
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.innerCircle}>
             <Feather name="check" size={60} color="#fff" />
          </View>
        </Animated.View>

        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.desc}>
          Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đã được xác nhận và sẽ sớm được giao đến bạn.
        </Text>

        {/* Card thông tin phụ (tùy chọn) */}
        <View style={styles.infoCard}>
           <Text style={styles.infoText}>Mã giao dịch: <Text style={{fontWeight: '700'}}>#{orderId}</Text></Text>
        </View>

        {/* Nút bấm chính */}
        <Pressable 
          style={({ pressed }) => [
            styles.btn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
          ]} 
          onPress={() => navigation.navigate('inapp', { screen: 'home' })}
        >
          <Text style={styles.btnText}>Tiếp tục mua sắm</Text>
        </Pressable>

        <Pressable 
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('Order', { orderId })}
        >
          <Text style={styles.outlineBtnText}>Xem chi tiết đơn hàng</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Màu nền hơi xám nhẹ cho hiện đại
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 177, 79, 0.1)', // Màu xanh nhạt bên ngoài
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#00B14F', // Xanh chủ đạo
    alignItems: 'center',
    justifyContent: 'center',
    // Đổ bóng cho icon
    elevation: 8,
    shadowColor: '#00B14F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1E293B', // Màu chữ đậm navy
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    color: '#64748B',
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#00B14F',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#00B14F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  outlineBtn: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});