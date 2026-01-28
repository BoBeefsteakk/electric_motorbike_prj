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
import { SafeAreaView } from 'react-native-safe-area-context';

/* 1. Interface cho Đơn hàng */
interface OrderItem {
  id: string;
  name: string;
  color: string;
  status: string;
  price: number;
  image: string;
  date: string;
}

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');

  /* 2. Dữ liệu mẫu */
  const ACTIVE_ORDERS: OrderItem[] = [
    {
      id: 'ORD001',
      name: 'VinFast Feliz S',
      color: 'Bạc',
      status: 'Đang giao hàng',
      price: 29900000,
      image: 'https://vinfastauto.com/themes/custom/vinfast/images/feliz.png',
      date: '24 Tháng 5, 2024',
    },
  ];

  const COMPLETED_ORDERS: OrderItem[] = [
    {
      id: 'ORD002',
      name: 'DatBike Weaver++',
      color: 'Cam',
      status: 'Đã hoàn thành',
      price: 65000000,
      image: 'https://datbike.vn/wp-content/uploads/2023/07/weaver.png',
      date: '10 Tháng 1, 2024',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const dataToShow = activeTab === 'Active' ? ACTIVE_ORDERS : COMPLETED_ORDERS;

  /* 3. Render Item đơn hàng */
  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.variantText}>Màu: {item.color}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
        </View>
        <Pressable style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>
            {activeTab === 'Active' ? 'Theo dõi' : 'Mua lại'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <Ionicons
          name="receipt-outline"
          size={24}
          color="black"
        />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabItem, activeTab === 'Active' && styles.tabActive]}
          onPress={() => setActiveTab('Active')}
        >
          <Text
            style={[styles.tabText, activeTab === 'Active' && styles.tabTextActive]}
          >
            Đang thực hiện
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, activeTab === 'Completed' && styles.tabActive]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text
            style={[styles.tabText, activeTab === 'Completed' && styles.tabTextActive]}
          >
            Đã hoàn thành
          </Text>
        </Pressable>
      </View>

      {/* List đơn hàng */}
      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Ionicons
              name="document-text-outline"
              size={80}
              color="#EEE"
            />
            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000000',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  variantText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#AAA',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContent: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#AAA',
    fontSize: 16,
  },
});