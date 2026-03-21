import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from '../../services/api/axios';

interface Order {
    _id: string;
    orderId: string;
    finalPrice: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function OrderScreen() {
    const navigation = useNavigation<any>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // API này bạn cần tạo ở Backend: GET /api/orders/user/:userId
            const response = await axiosClient.get('/orders/user/user_test_123');
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const renderOrderItem = ({ item }: { item: Order }) => (
        <Pressable 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.orderId })}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderIdText}>Mã: #{item.orderId}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Hiển thị sản phẩm đầu tiên đại diện */}
            <View style={styles.productBrief}>
                <Image source={{ uri: item.items[0]?.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{item.items[0]?.name}</Text>
                    <Text style={styles.itemCount}>và {item.items.length} sản phẩm khác</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
                <View style={styles.totalGroup}>
                    <Text style={styles.totalLabel}>Tổng thanh toán: </Text>
                    <Text style={styles.totalValue}>{formatCurrency(item.finalPrice)}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                </Pressable>
                <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
                <Pressable onPress={fetchOrders}>
                    <Ionicons name="refresh" size={24} color="#1A1A1A" />
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00B14F" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={80} color="#DDD" />
                            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderIdText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    statusBadge: {
        backgroundColor: '#E8F8F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: '#00B14F',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    productBrief: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F7F8FA',
    },
    productInfo: {
        marginLeft: 12,
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#434343',
    },
    itemCount: {
        fontSize: 12,
        color: '#8C8C8C',
        marginTop: 2,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    dateText: {
        fontSize: 12,
        color: '#8C8C8C',
    },
    totalGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        color: '#434343',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF4D4F',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: '#8C8C8C',
    }
});