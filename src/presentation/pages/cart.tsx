import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
// Sửa lỗi Warning bằng cách dùng thư viện này
import { SafeAreaView } from 'react-native-safe-area-context';

/* 1. Định nghĩa khuôn mẫu dữ liệu (Interface) để xóa lỗi đỏ TypeScript */
interface OrderItem {
  id: string;
  name: string;
  color: string;
  colorCode: string;
  status: string;
  price: number;
  image: string;
}

/* 2. Dữ liệu mẫu (Data) */
const ACTIVE_ORDERS: OrderItem[] = [
  {
    id: '1',
    name: 'VinFast Feliz S',
    color: 'Silver',
    colorCode: '#C0C0C0',
    status: 'In Delivery',
    price: 29900000,
    image: 'https://vinfastauto.com/themes/custom/vinfast/images/feliz.png',
  },
  {
    id: '2',
    name: 'DatBike Weaver++',
    color: 'Orange',
    colorCode: '#FFA500',
    status: 'In Delivery',
    price: 65000000,
    image: 'https://datbike.vn/wp-content/uploads/2023/07/weaver.png',
  },
];

// Khai báo kiểu OrderItem[]"
const COMPLETED_ORDERS: OrderItem[] = []; 

/* 3. Helper format tiền */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');

  /* --- RENDER: Từng thẻ đơn hàng --- */
  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <View>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <View style={styles.variantRow}>
                <View style={[styles.colorDot, { backgroundColor: item.colorCode }]} />
                <Text style={styles.variantText}>{item.color}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
        </View>

        <View style={styles.cardFooter}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            <Pressable style={styles.trackButton}>
                <Text style={styles.trackButtonText}>Đặt hàng</Text>
            </Pressable>
        </View>
      </View>
    </View>
  );

  /* --- RENDER: Giao diện khi trống --- */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
         <Ionicons name="clipboard-outline" size={80} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>Bạn chưa có đơn đặt hàng nào</Text>
      <Text style={styles.emptySub}>Hiện tại bạn không có đơn đặt hàng nào đang thực hiện.</Text>
    </View>
  );

  const dataToShow = activeTab === 'Active' ? ACTIVE_ORDERS : COMPLETED_ORDERS;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            
            <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.headerIcons}>
            <Ionicons name="search-outline" size={24} color="black" />
            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="black" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable 
            style={[styles.tabItem, activeTab === 'Active' && styles.tabActive]}
            onPress={() => setActiveTab('Active')}
        >
            <Text style={[styles.tabText, activeTab === 'Active' && styles.tabTextActive]}>Active</Text>
        </Pressable>
        <Pressable 
            style={[styles.tabItem, activeTab === 'Completed' && styles.tabActive]}
            onPress={() => setActiveTab('Completed')}
        >
            <Text style={[styles.tabText, activeTab === 'Completed' && styles.tabTextActive]}>Completed</Text>
        </Pressable>
      </View>

      {/* List Content */}
      <View style={{ flex: 1 }}>
        {dataToShow.length > 0 ? (
            <FlatList
                data={dataToShow}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            />
        ) : (
            renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', gap: 15 },

  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 15, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#000000' },
  tabText: { fontSize: 16, color: '#9E9E9E', fontWeight: '600' },
  tabTextActive: { color: '#000000' },

  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 15, marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  imageContainer: { width: 110, height: 110, backgroundColor: '#F5F5F5', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  image: { width: '90%', height: '90%', resizeMode: 'contain' },
  
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  variantRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  variantText: { fontSize: 13, color: '#757575' },
  statusBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 5 },
  statusText: { fontSize: 10, color: '#616161', fontWeight: 'bold' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 17, fontWeight: 'bold' },
  trackButton: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  trackButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconContainer: { marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  emptySub: { fontSize: 14, color: '#9E9E9E', textAlign: 'center', marginTop: 10 },
});