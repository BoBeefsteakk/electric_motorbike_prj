import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 1. Import useNavigation để chuyển màn hình
import { useNavigation } from '@react-navigation/native';

/* Định nghĩa kiểu dữ liệu cho từng mục Menu */
interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement?: React.ReactNode;
  isLogout?: boolean;
  onPress?: () => void; // Thêm onPress để có thể bấm chuyển trang
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>(); // Khởi tạo navigation
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Ảnh mặc định từ Pinterest bạn yêu cầu
  const [avatarUri, setAvatarUri] = useState(
    'https://i.pinimg.com/736x/21/6b/03/216b036577589d7010a30b696f839634.jpg'
  );

  // Hàm xử lý chọn ảnh từ máy cá nhân
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Thông báo', 
        'Bạn cần cho phép ứng dụng truy cập thư viện ảnh để đổi profile!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // Thành phần Menu Item viết gọn (đã thêm sự kiện onPress)
  const MenuItem = ({ icon, label, rightElement, isLogout, onPress }: MenuItemProps) => (
    <Pressable 
      style={({ pressed }) => [
        styles.menuItem,
        pressed && { opacity: 0.6 } // Thêm hiệu ứng mờ nhẹ khi bấm vào
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={isLogout ? '#F75555' : '#212121'}
        />
        <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.menuRight}>
        {rightElement ? (
          rightElement
        ) : (
          !isLogout && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#212121"
            />
          )
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <Ionicons 
          name="ellipsis-horizontal-circle" 
          size={24} 
          color="black" 
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              key={avatarUri} // Ép React render lại khi đổi ảnh
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
            {/* Nút bút chì đã được gán hàm pickImage */}
            <Pressable 
              style={styles.editAvatarBtn}
              onPress={pickImage}
            >
              <Ionicons 
                name="pencil" 
                size={12} 
                color="white" 
              />
            </Pressable>
          </View>
          <Text style={styles.userName}>Văn Thanh</Text>
          <Text style={styles.userPhone}>+84 123 456 789</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu List */}
        <View style={styles.menuSection}>

          {/* === MỤC MỚI THÊM: ĐƠN HÀNG CỦA TÔI === */}
          <MenuItem 
            icon="receipt-outline" 
            label="My Orders" 
            onPress={() => navigation.navigate('Order')} 
          />
          {/* ======================================== */}

          <MenuItem icon="person-outline" label="Edit Profile" />
          <MenuItem icon="location-outline" label="Address" />
          <MenuItem icon="notifications-outline" label="Notification" />
          <MenuItem icon="wallet-outline" label="Payment" />
          <MenuItem icon="shield-checkmark-outline" label="Security" />
          
          <MenuItem 
            icon="language-outline" 
            label="Language" 
            rightElement={
              <Text style={styles.rightText}>English (US)</Text>
            }
          />

          <MenuItem 
            icon="eye-outline" 
            label="Dark Mode" 
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#EEEEEE', true: '#000000' }}
                thumbColor={'#FFFFFF'}
              />
            }
          />

          <MenuItem icon="lock-closed-outline" label="Privacy Policy" />
          <MenuItem icon="help-circle-outline" label="Help Center" />
          <MenuItem icon="people-outline" label="Invite Friends" />
          
          <MenuItem 
            icon="log-out-outline" 
            label="Logout" 
            isLogout={true} 
            onPress={() => Alert.alert("Thông báo", "Bạn muốn đăng xuất?")}
          />
        </View>
      </ScrollView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F2',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#000',
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  userPhone: {
    fontSize: 14,
    color: '#616161',
    marginTop: 8,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 20,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  menuLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  logoutLabel: {
    color: '#F75555',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 16,
    color: '#424242',
    marginRight: 10,
    fontWeight: '500',
  },
});