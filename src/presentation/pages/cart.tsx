import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    Alert as RNAlert,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../../services/api/axios'; // Đảm bảo đường dẫn này đúng

interface CartItem {
    productId: string; // Khớp với Backend
    name: string;
    price: number;
    image: string;
    quantity: number;
    selected: boolean;
    color?: string; // Có thể không có từ DB, mình sẽ xử lý sau
}

interface Voucher {
    id: string;
    code: string;
    discount: number;
    minSpend: number;
    description: string;
}

const VOUCHERS_MOCK: Voucher[] = [
    { id: '1', code: 'GIAM100K', discount: 100000, minSpend: 0, description: 'Giảm 100K cho mọi đơn hàng' },
    { id: '2', code: 'DATBIKE500', discount: 500000, minSpend: 50000000, description: 'Giảm 500K cho đơn từ 50 Triệu' },
];

export default function CartScreen() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigation = useNavigation<any>(); // Sửa để tránh lỗi type khi navigate
    const route = useRoute<any>();
    const userId = route.params?.userId || 'user_test_123'; // Tạm hardcode userId, sau này sẽ lấy từ auth context hoặc params
    // --- 1. LẤY DỮ LIỆU THẬT TỪ DATABASE ---
    const fetchCart = async () => {
        if (!userId) {
            console.log("Không có userId, không thể tải giỏ hàng");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axiosClient.get(`/cart/${userId}`); // Sửa endpoint nếu cần, đảm bảo đúng với API của bạn

            // Xử lý linh hoạt dữ liệu trả về
            let cartData = null;
            if (response.data && response.data.success && response.data.data) {
                cartData = response.data.data; 
            } else if (response.data && response.data.items) {
                cartData = response.data; 
            }

            // Cập nhật state
            if (cartData && Array.isArray(cartData.items)) {
                const itemsFromDB = cartData.items.map((item: any) => ({
                    ...item,
                    selected: false, // Mặc định bỏ chọn để user tự tick chọn cái muốn mua
                }));
                setCartItems(itemsFromDB);
            } else {
                setCartItems([]);
            }
        } catch (error) { 
            // Chỉ log ngầm để debug, không văng Popup lên màn hình user
            console.error("Lỗi fetch giỏ hàng:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCart();
    }, []);

    // Reload cart nếu có param reload từ navigation
    useEffect(() => {
        if (route?.params?.reload) {
            fetchCart();
        }
    }, [route?.params?.reload]);

    useFocusEffect(
        React.useCallback(() => {
            fetchCart();
        }, [])
    );

    // --- 2. LOGIC SẢN PHẨM (Sửa id -> productId) ---
    // Hàm xoá sản phẩm KHÔNG hiện Alert, chỉ thực hiện xoá thật sự
    const removeItemDirect = async (productId: string) => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        try {
            await axiosClient.post('/cart/remove-item', {
                userId: userId,
                productId
            });
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm trên server.');
        }
    };

    // Hàm xác nhận xoá khi bấm nút thùng rác
    const removeItem = (productId: string) => {
        Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn bỏ sản phẩm này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: () => removeItemDirect(productId),
            },
        ]);
    };

    const updateQuantity = async (productId: string, delta: number) => {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (item.quantity === 1 && delta === -1) {
            Alert.alert(
                'Xác nhận xoá',
                'Bạn có muốn xoá sản phẩm này không?',
                [
                    { text: 'Không', style: 'cancel' },
                    {
                        text: 'Có',
                        style: 'destructive',
                        onPress: () => removeItemDirect(productId),
                    },
                ]
            );
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.productId === productId) {
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
        // Gọi API update số lượng lên server để đồng bộ
        try {
            await axiosClient.post('/cart/update-quantity', {
                userId: userId,
                productId,
                quantity: newQty
            });
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể cập nhật số lượng trên server.');
        }
    };

    const toggleSelect = (productId: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const isAllSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);
    const toggleSelectAll = () => {
        const newValue = !isAllSelected;
        setCartItems((prev) => prev.map((item) => ({ ...item, selected: newValue })));
    };

    // --- 3. TÍNH TOÁN TIỀN ---
    const subTotal = useMemo(() => {
        return cartItems
            .filter((item) => item.selected)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const finalPrice = Math.max(0, subTotal - (appliedVoucher?.discount || 0));

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm hiển thị thông báo thêm vào giỏ hàng
    const showAddToCartMessage = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Đã thêm vào giỏ hàng!', ToastAndroid.SHORT);
        } else {
            RNAlert.alert('Thông báo', 'Đã thêm vào giỏ hàng!');
        }
    };

    // Hàm xử lý khi bấm nút "Thêm vào giỏ hàng"
    const handleAddToCart = async (item: CartItem) => {
        try {
            await axiosClient.post('/cart/add', {
                userId: userId,
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
            showAddToCartMessage();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng.');
        }
    };

    // Hàm xử lý khi bấm nút "Mua ngay"
    const handleBuyNow = async (item: CartItem) => {
        // Đảm bảo sản phẩm đã có trong giỏ hàng trước khi chuyển sang checkout
        try {
            await axiosClient.post('/cart/add', {
                userId: userId,
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
            navigation.navigate('checkout');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể mua ngay.');
        }
    };

    if (loading) return (
        <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#000" /></View>
    );

    // --- RENDER ---
    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.card}>
            <Pressable style={styles.checkboxWrapper} onPress={() => toggleSelect(item.productId)}>
                <Ionicons name={item.selected ? "checkbox" : "square-outline"} size={24} color={item.selected ? "#000" : "#CCC"} />
            </Pressable>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Pressable onPress={() => removeItem(item.productId)}>
                        <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
                    </Pressable>
                </View>
                <Text style={styles.variantText}>Sản phẩm xe điện</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                    <View style={styles.quantityControl}>
                        <Pressable style={styles.qtyBtn} onPress={() => updateQuantity(item.productId, -1)}>
                            <Ionicons name="remove" size={16} color="black" />
                        </Pressable>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <Pressable style={styles.qtyBtn} onPress={() => updateQuantity(item.productId, 1)}>
                            <Ionicons name="add" size={16} color="black" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giỏ hàng</Text>
                {cartItems.length > 0 && (
                    <Pressable onPress={() => setIsEditMode((prev) => !prev)}>
                        <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 16 }}>
                            {isEditMode ? 'Xong' : 'Sửa'}
                        </Text>
                    </Pressable>
                )}
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.productId}
                renderItem={renderCartItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContent}>
                        <Ionicons name="cart-outline" size={80} color="#EEE" />
                        <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
                    </View>
                }
            />

            {cartItems.length > 0 && (
                <View style={styles.footerContainer}>
                    <Pressable style={styles.voucherSection} onPress={() => setVoucherModalVisible(true)}>
                        <View style={styles.voucherLeft}>
                            <Ionicons name="ticket-outline" size={22} color="#000" />
                            <Text style={styles.voucherTitle}>Voucher</Text>
                        </View>
                        <Text style={[styles.voucherPlaceholder, appliedVoucher && {color: '#00B14F'}]}>
                            {appliedVoucher ? appliedVoucher.code : 'Chọn mã giảm giá'}
                        </Text>
                    </Pressable>

                    <View style={styles.actionSection}>
                        <Pressable style={styles.selectAllContainer} onPress={toggleSelectAll}>
                            <Ionicons name={isAllSelected ? "checkbox" : "square-outline"} size={24} color={isAllSelected ? "#000" : "#CCC"} />
                            <Text style={styles.selectAllText}>Tất cả</Text>
                        </Pressable>
                        <View style={styles.checkoutGroup}>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={styles.totalLabel}>Tổng cộng</Text>
                                <Text style={styles.totalAmount}>{formatCurrency(finalPrice)}</Text>
                            </View>
                            <Pressable
                                style={[styles.finalCheckoutBtn, cartItems.filter(item => item.selected).length === 0 && { opacity: 0.5 }, isEditMode && { backgroundColor: '#FF4D4D' }]}
                                disabled={cartItems.filter(item => item.selected).length === 0}
                                onPress={async () => {
                                    if (isEditMode) {
                                        // Xoá các sản phẩm đã chọn
                                        const selectedIds = cartItems.filter(i => i.selected).map(i => i.productId);
                                        setCartItems(prev => prev.filter(i => !selectedIds.includes(i.productId)));
                                        for (const id of selectedIds) {
                                            try {
                                                await axiosClient.post('/cart/remove-item', {
                                                    userId: userId,
                                                    productId: id
                                                });
                                            } catch (e) {}
                                        }
                                    } else {
                                        // THANH TOÁN
                                        const selectedItems = cartItems.filter(item => item.selected);

                                        if (selectedItems.length === 0) return; // Đề phòng user chưa chọn gì

                                        navigation.navigate('checkout', {
                                            cartItems: selectedItems,
                                            appliedVoucher
                                        });
                                    }
                                }}
                            >
                                <Text style={styles.finalCheckoutText}>{isEditMode ? 'Xoá' : 'Thanh toán'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}

            {/* Modal Voucher giữ nguyên như của bạn nhưng sửa logic chọn */}
            <Modal visible={isVoucherModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn Voucher</Text>
                            <Pressable onPress={() => setVoucherModalVisible(false)}><Ionicons name="close" size={24}/></Pressable>
                        </View>
                        {VOUCHERS_MOCK.map(v => (
                            <Pressable key={v.id} style={styles.voucherItem} onPress={() => { setAppliedVoucher(v); setVoucherModalVisible(false); }}>
                                <Text style={{fontWeight: 'bold'}}>{v.code}</Text>
                                <Text>{v.description}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Giữ nguyên các styles cũ của bạn dưới đây...
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
    listContent: {
        padding: 20,
        paddingBottom: 160,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    checkboxWrapper: {
        marginRight: 10,
        padding: 4,
    },
    imageContainer: {
        width: 85,
        height: 85,
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '85%',
        height: '85%',
        resizeMode: 'contain',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        height: 85,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        paddingRight: 10,
    },
    variantText: {
        fontSize: 13,
        color: '#888',
        marginTop: -5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
    },
    qtyBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        paddingHorizontal: 8,
        fontWeight: 'bold',
        fontSize: 14,
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
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 15,
        paddingBottom: 35,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 20,
    },
    voucherSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    voucherLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    voucherTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    voucherPlaceholder: {
        fontSize: 14,
        color: '#999',
    },
    actionSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectAllText: {
        fontSize: 14,
        color: '#666',
    },
    checkoutGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    totalLabel: {
        fontSize: 12,
        color: '#888',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    finalCheckoutBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
    },
    finalCheckoutText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        minHeight: '40%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    voucherItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
});