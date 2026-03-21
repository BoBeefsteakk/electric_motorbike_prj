import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../services/api/axios';

export default function DetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    // Hứng dữ liệu từ SearchScreen truyền sang
    const { item } = route.params || {};

    // Chuẩn hóa dữ liệu hiển thị (Lấy từ item thật nếu có)
    const vehicle = {
        id: item?._id || item?.id,
        name: item?.name || 'Tên sản phẩm',
        price: item?.price || 0,
        image: item?.image || 'https://via.placeholder.com/400',
        type: item?.category?.name || (item?.isCar ? 'Ô tô' : 'Xe máy'),
        status: item?.status === 1 ? 'Mới 100%' : 'Xe cũ',
        description: item?.description || 'Thông tin chi tiết về chiếc xe này đang được cập nhật...',
        specs: { 
            speed: item?.maxSpeed || '-- km/h', 
            range: item?.range || '-- km', 
            weight: item?.weight || '-- kg' 
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const [showAdd, setShowAdd] = useState(false);

    // --- LOGIC GỌI API THÊM VÀO GIỎ HÀNG ---
    const showAddToCartMessage = () => {
        setShowAdd(true);
        setTimeout(() => setShowAdd(false), 1500);
        if (Platform.OS === 'android') {
            ToastAndroid.show('Đã thêm vào giỏ hàng!', ToastAndroid.SHORT);
        }
        // Không Alert.alert nữa
    };

    const handleAddToCart = async (isBuyNow = false) => {
        if (!vehicle.id) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin sản phẩm");
            return;
        }

        try {
            const payload = {
                userId: "user_test_123", // Sau này thay bằng ID user thật khi có Login
                productId: vehicle.id, 
                productType: item?.isCar ? 'Car' : 'Motorbike', // Khớp với Backend Enum
                name: vehicle.name,
                price: vehicle.price,
                image: vehicle.image,
                quantity: 1
            };

            const response = await axiosClient.post('/cart/add', payload);

            if (response.data.success) {
                if (isBuyNow) {
                    navigation.navigate('checkout', {
                        cartItems: [{
                            productId: vehicle.id,
                            name: vehicle.name,
                            price: vehicle.price,
                            image: vehicle.image,
                            quantity: 1,
                            selected: true
                        }],
                        appliedVoucher: null
                    });
                } else {
                    showAddToCartMessage();
                }
            }
        } catch (error: any) {
            console.error("Lỗi kết nối BE:", error.response?.data || error.message);
            Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ giỏ hàng');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Ảnh bìa */}
                <View style={styles.imageSection}>
                    <Image source={{ uri: vehicle.image }} style={styles.mainImage} />
                    
                    <SafeAreaView style={styles.absoluteHeader} edges={['top']}>
                        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </Pressable>
                        <Pressable style={styles.iconBtn}>
                            <Ionicons name="heart-outline" size={24} color="#000" />
                        </Pressable>
                    </SafeAreaView>
                </View>

                {/* Thông tin chi tiết */}
                <View style={styles.infoSection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{vehicle.name}</Text>
                        <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>
                    </View>

                    <View style={styles.badgeRow}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{vehicle.type}</Text></View>
                        <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}><Text style={[styles.badgeText, { color: '#2E7D32' }]}>{vehicle.status}</Text></View>
                    </View>

                    <Text style={styles.sectionTitle}>Thông số nổi bật</Text>
                    <View style={styles.specsGrid}>
                        <View style={styles.specBox}>
                            <Ionicons name="speedometer-outline" size={24} color="#555" />
                            <Text style={styles.specValue}>{vehicle.specs.speed}</Text>
                            <Text style={styles.specLabel}>Tốc độ tối đa</Text>
                        </View>
                        <View style={styles.specBox}>
                            <Ionicons name="battery-charging-outline" size={24} color="#555" />
                            <Text style={styles.specValue}>{vehicle.specs.range}</Text>
                            <Text style={styles.specLabel}>Quãng đường</Text>
                        </View>
                        <View style={styles.specBox}>
                            <Ionicons name="scale-outline" size={24} color="#555" />
                            <Text style={styles.specValue}>{vehicle.specs.weight}</Text>
                            <Text style={styles.specLabel}>Trọng lượng</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                    <Text style={styles.description}>{vehicle.description}</Text>
                </View>
            </ScrollView>

            {/* Thanh điều hướng mua hàng */}
            <View style={styles.bottomBar}>
                <Pressable 
                    style={({ pressed }) => [styles.cartBtn, pressed && { opacity: 0.7 }]} 
                    onPress={async () => {
                        if (!vehicle.id) {
                            Alert.alert("Lỗi", "Không tìm thấy thông tin sản phẩm");
                            return;
                        }
                        try {
                            const payload = {
                                userId: "user_test_123",
                                productId: vehicle.id,
                                productType: item?.isCar ? 'Car' : 'Motorbike',
                                name: vehicle.name,
                                price: vehicle.price,
                                image: vehicle.image,
                                quantity: 1
                            };
                            const response = await axiosClient.post('/cart/add', payload);
                            if (response.data.success) {
                                showAddToCartMessage();
                                navigation.setParams?.({ reload: true }); // Truyền param reload cho Cart
                            } else {
                                showAddToCartMessage();
                            }
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ giỏ hàng');
                        }
                    }}
                >
                    <Ionicons name="cart-outline" size={24} color="#000" />
                </Pressable>

                <Pressable 
                    style={({ pressed }) => [styles.buyBtn, pressed && { opacity: 0.8 }]} 
                    onPress={() => handleAddToCart(true)}
                >
                    <Text style={styles.buyBtnText}>Mua ngay</Text>
                </Pressable>
            </View>
            {/* Thông báo nhỏ khi thêm vào giỏ hàng */}
            {showAdd && (
                <View style={styles.toastContainer}>
                    <View style={styles.toastBox}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đã thêm vào giỏ hàng!</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    imageSection: {
        width: '100%',
        height: 350,
        backgroundColor: '#F8F8F8',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        marginTop: 30,
    },
    absoluteHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        backgroundColor: '#FFF',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    infoSection: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    titleRow: {
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF4D4D',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 25,
    },
    badge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
    },
    specsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    specBox: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    specValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    specLabel: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
        textAlign: 'justify',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
        gap: 15,
    },
    cartBtn: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyBtn: {
        flex: 1,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toastContainer: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    toastBox: {
        backgroundColor: '#222',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
});