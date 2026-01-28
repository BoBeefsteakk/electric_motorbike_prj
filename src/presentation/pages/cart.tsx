import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

    interface CartItem {
    id: string;
    name: string;
    color: string;
    price: number;
    image: string;
    quantity: number;
    }
export default function CartScreen() {
    const [selectAll, setSelectAll] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'VinFast Feliz S',
            color: 'Bạc',
            price: 29900000,
            image: 'https://vinfastauto.com/themes/custom/vinfast/images/feliz.png',
            quantity: 1,
        },
        {
            id: '2',
            name: 'DatBike Weaver++',
            color: 'Cam',
            price: 65000000,
            image: 'https://datbike.vn/wp-content/uploads/2023/07/weaver.png',
            quantity: 1,
        },
    ]);

    const updateQuantity = (id: string, delta: number) => {
     setCartItems((prev) =>
        prev.map((item) => {
            if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
            })
        );
    };

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        }).format(value);
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.card}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
            <View style={styles.cardHeader}>
            <Text style={styles.name} numberOfLines={1}>
                {item.name}
            </Text>
            <Pressable onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
            </Pressable>
            </View>

            <Text style={styles.variantText}>Màu: {item.color}</Text>

            <View style={styles.cardFooter}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>

            <View style={styles.quantityControl}>
                <Pressable
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, -1)}
                >
                <Ionicons name="remove" size={16} color="black" />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, 1)}
                >
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
            <Ionicons name="search-outline" size={24} color="black" />
        </View>

        <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
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
        {/* --- Phần 1: Dòng Voucher --- */}
        <Pressable style={styles.voucherSection}>
        <View style={styles.voucherLeft}>
            <Ionicons
            name="ticket-outline"
            size={22}
            color="#000"
            />
            <Text style={styles.voucherTitle}>Voucher</Text>
        </View>
        <View style={styles.voucherRight}>
            <Text style={styles.voucherPlaceholder}>Chọn hoặc nhập mã</Text>
            <Ionicons
            name="chevron-forward"
            size={18}
            color="#AAA"
            />
        </View>
        </Pressable>

        {/* Đường kẻ mờ phân cách */}
        <View style={styles.footerDivider} />

        {/* --- Phần 2: Thanh toán & Chọn tất cả --- */}
        <View style={styles.actionSection}>
        {/* Bên trái: Chọn tất cả */}
        <Pressable
            style={styles.selectAllContainer}
            onPress={() => setSelectAll(!selectAll)}
        >
            <Ionicons
            name={selectAll ? "checkbox" : "square-outline"}
            size={24}
            color={selectAll ? "#000" : "#CCC"}
            />
            <Text style={styles.selectAllText}>Tất cả</Text>
        </Pressable>

        {/* Bên phải: Tổng cộng + Nút Thanh toán gộp lại */}
        <View style={styles.checkoutGroup}>
            <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>
                {formatCurrency(totalPrice)}
            </Text>
            </View>
            <Pressable style={styles.finalCheckoutBtn}>
            <Text style={styles.finalCheckoutText}>Thanh toán</Text>
            </Pressable>
        </View>
        </View>
    </View>
    )}
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
    listContent: {
        padding: 20,
        paddingBottom: 150,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
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
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    variantText: {
        fontSize: 13,
        color: '#888',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: -10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        color: '#888',
        fontSize: 16,
    },
    summaryPrice: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    checkoutBtn: {
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 20,
        gap: 10,
    },
    checkoutText: {
        color: '#FFF',
        fontSize: 16,
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
    footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingBottom: 30, // Chừa khoảng trống cho thanh điều hướng điện thoại
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 20,
  },
  /* Style cho Voucher */
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
    fontSize: 16,
    fontWeight: '600',
  },
  voucherRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  voucherPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  /* Style cho Thanh toán */
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
    fontWeight: '500',
  },
  checkoutGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  totalInfo: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#888',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  finalCheckoutBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  finalCheckoutText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});