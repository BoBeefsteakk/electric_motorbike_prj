import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from '../../services/api/axios'; 

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const cartItems = route.params?.cartItems || [];
  const appliedVoucher = route.params?.appliedVoucher || null;

  const subTotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const finalPrice = Math.max(0, subTotal - (appliedVoucher?.discount || 0));
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const handlePayment = async () => {
    try {
        const orderData = {
            userId: "user_test_123", 
            cartItems: cartItems,
            subTotal: subTotal,
            discount: appliedVoucher?.discount || 0,
            finalPrice: finalPrice
        };

        const response = await axiosClient.post('/orders/create', orderData);

        if (response.data.success) {
            navigation.navigate('PaymentSuccess', { 
                orderId: response.data.orderId 
            });
        }
    } catch (error: any) {
        console.error("Lỗi thanh toán:", error);
        const errorMsg = error.response?.data?.message || "Không thể tạo đơn hàng. Hãy kiểm tra kết nối!";
        Alert.alert("Lỗi thanh toán", errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Pressable style={styles.iconBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* --- DANH SÁCH SẢN PHẨM --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
          ) : (
            cartItems.map((item: any) => (
              <View key={item.productId} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQty}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* --- CHI TIẾT THANH TOÁN --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>{formatCurrency(subTotal)}</Text>
          </View>

          {appliedVoucher && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giảm giá (Voucher)</Text>
              <Text style={[styles.priceValue, styles.discountText]}>
                -{formatCurrency(appliedVoucher.discount)}
              </Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalPrice)}</Text>
          </View>
        </View>

        <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#8C8C8C" />
            <Text style={styles.securityText}>Thanh toán an toàn và bảo mật</Text>
        </View>
      </ScrollView>

      {/* --- FOOTER FIXED --- */}
      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.payBtn, 
            (pressed || cartItems.length === 0) && styles.payBtnDisabled
          ]} 
          onPress={handlePayment}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.payText}>Thanh toán ngay</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout chính
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    padding: 16,
  },

  // Components (Cards)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Shadow cho Android
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },

  // Item Row
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    color: '#434343',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 13,
    color: '#8C8C8C',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Price Rows
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#8C8C8C',
  },
  priceValue: {
    fontSize: 14,
    color: '#434343',
    fontWeight: '500',
  },
  discountText: {
    color: '#FF4D4F',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00B14F',
  },

  // Button & Footer
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  payBtn: {
    backgroundColor: '#00B14F',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#00B14F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  payBtnDisabled: {
    opacity: 0.6,
    backgroundColor: '#CCCCCC',
  },
  payText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Others
  iconBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8C8C8C',
    marginVertical: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  securityText: {
    fontSize: 12,
    color: '#8C8C8C',
    marginLeft: 6,
  },
});