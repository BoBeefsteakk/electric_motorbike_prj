import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from '../../services/api/axios'; // Đường dẫn axios của bạn

export default function WarrantyScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  // Giả sử lấy userId từ Auth Context hoặc truyền qua params
  const userId = "user_test_123"; 

  useEffect(() => {
    fetchWarrantyData();
  }, []);

  const fetchWarrantyData = async () => {
    try {
      // Gọi API lấy đơn hàng bạn đã viết ở backend
      const response = await axiosClient.get(`/orders/user/${userId}`);
      if (response.data.success) {
        // Lọc những đơn hàng đã thanh toán/thành công để hiện bảo hành
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu bảo hành:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderWarrantyItem = (order: any) => {
    // Logic tính toán ngày bảo hành (Giả sử bảo hành 3 năm = 1095 ngày)
    const startDate = new Date(order.createdAt);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + 3);

    return (
      <View key={order._id} style={styles.ticketCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderIdText}>Mã đơn: {order.orderId}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Chính hãng</Text>
          </View>
        </View>

        {/* Danh sách sản phẩm trong đơn hàng này */}
        {order.items.map((item: any, index: number) => (
          <View key={index} style={styles.productRow}>
            
            <Text style={styles.productName}>{item.name}</Text>
          </View>
        ))}

        <View style={styles.divider}>
          <View style={[styles.cutout, { left: -25 }]} />
          <View style={styles.dashLine} />
          <View style={[styles.cutout, { right: -25 }]} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Ngày mua</Text>
            <Text style={styles.dateValue}>{startDate.toLocaleDateString('vi-VN')}</Text>
          </View>
          <View style={[styles.dateBox, { alignItems: 'flex-end' }]}>
            <Text style={styles.dateLabel}>Hết hạn bảo hành</Text>
            <Text style={[styles.dateValue, { color: '#FF4D4F' }]}>
              {expiryDate.toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Bảo hành của tôi</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00B14F" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>Bạn chưa có sản phẩm nào được bảo hành.</Text>
          ) : (
            orders.map(order => renderWarrantyItem(order))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  scrollContent: { padding: 20 },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFAFA'
  },
  orderIdText: { fontSize: 13, color: '#8C8C8C', fontWeight: '600' },
  statusBadge: { backgroundColor: '#E6F7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#00B14F', fontSize: 11, fontWeight: '700' },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 12, gap: 10 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  divider: { height: 30, justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  cutout: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#F5F7FA' },
  dashLine: { width: '90%', height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 0 },
  dateBox: { flex: 1 },
  dateLabel: { fontSize: 11, color: '#8C8C8C', marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: '700', color: '#434343' },
  emptyText: { textAlign: 'center', marginTop: 100, color: '#8C8C8C' }
});