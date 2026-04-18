import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { darkTheme, lightTheme } from "../../theme/colors";

const AUTH_USER_KEY = "AUTH_USER";
const PROFILE_KEY = "PROFILE_DATA";
const ACCENT = "#C47A4A";
const ACCENT_DARK = "#9F633B";
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement?: React.ReactNode;
  isLogout?: boolean;
  onPress?: () => void;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/21/6b/03/216b036577589d7010a30b696f839634.jpg";
const DEFAULT_NAME = "Văn Thanh";
const DEFAULT_EMAIL = "thanhvan@example.com";

export default function SettingScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();

  const [avatarUri, setAvatarUri] = useState(DEFAULT_AVATAR);
  const [fullName, setFullName] = useState(DEFAULT_NAME);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  const getProfileKey = async () => {
    const rawAuth = await AsyncStorage.getItem(AUTH_USER_KEY);
    const auth = rawAuth ? JSON.parse(rawAuth) : null;
    const account = auth?.account;

    return account ? `PROFILE_DATA_${account}` : PROFILE_KEY;
  };

  const loadProfileData = async () => {
    try {
      const profileKey = await getProfileKey();
      const rawProfile = await AsyncStorage.getItem(profileKey);
      const rawAuth = await AsyncStorage.getItem(AUTH_USER_KEY);

      const profile = rawProfile ? JSON.parse(rawProfile) : {};
      const auth = rawAuth ? JSON.parse(rawAuth) : {};

      const mergedName = profile.fullName || auth.account || DEFAULT_NAME;
      const mergedEmail = profile.email || auth.account || DEFAULT_EMAIL;
      const mergedAvatar = profile.avatarUri || DEFAULT_AVATAR;

      setAvatarUri(mergedAvatar);
      setFullName(mergedName);
      setEmail(mergedEmail);

      if (!rawProfile) {
        await AsyncStorage.setItem(
          profileKey,
          JSON.stringify({
            avatarUri: mergedAvatar,
            fullName: mergedName,
            email: mergedEmail,
            phone: "",
            birthday: "",
            gender: "Nam",
            address: "",
          }),
        );
      }
    } catch (error) {
      console.log("Load profile setting error:", error);
      setAvatarUri(DEFAULT_AVATAR);
      setFullName(DEFAULT_NAME);
      setEmail(DEFAULT_EMAIL);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, []),
  );

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần quyền truy cập ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatar = result.assets[0].uri;
        const profileKey = await getProfileKey();

        setAvatarUri(newAvatar);

        const raw = await AsyncStorage.getItem(profileKey);
        const oldData = raw ? JSON.parse(raw) : {};

        await AsyncStorage.setItem(
          profileKey,
          JSON.stringify({
            avatarUri: newAvatar,
            fullName: oldData.fullName || fullName || DEFAULT_NAME,
            email: oldData.email || email || DEFAULT_EMAIL,
            phone: oldData.phone || "",
            birthday: oldData.birthday || "",
            gender: oldData.gender || "Nam",
            address: oldData.address || "",
          }),
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh đại diện.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có muốn đăng xuất không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              "token",
              AUTH_USER_KEY,
              PROFILE_KEY,
            ]);

            navigation.reset({
              index: 0,
              routes: [{ name: "auth" }],
            });
          } catch (error) {
            Alert.alert("Lỗi", "Không thể đăng xuất");
          }
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    rightElement,
    isLogout,
    onPress,
  }: MenuItemProps) => {
    const itemBg = isLogout
      ? theme === "dark"
        ? "#2A1717"
        : "#FFF7F7"
      : theme === "dark"
        ? "#1D1814"
        : "#FFF8F2";
    const itemBorder = isLogout
      ? theme === "dark"
        ? "#5B2C2C"
        : "#F3D1D1"
      : theme === "dark"
        ? "#3C2D22"
        : "#E7D5C8";
    const iconBg = isLogout ? "#D84E4E" : ACCENT;
    const chevronColor = isLogout
      ? theme === "dark"
        ? "#FCA5A5"
        : "#E57373"
      : theme === "dark"
        ? "#D6B8A4"
        : ACCENT_DARK;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.menuItem,
          {
            backgroundColor: pressed
              ? theme === "dark"
                ? isLogout
                  ? "#341C1C"
                  : "#261F1A"
                : isLogout
                  ? "#FFF0F0"
                  : "#FFF2E8"
              : itemBg,
            borderColor: itemBorder,
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.menuLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: iconBg,
                borderColor: isLogout
                  ? theme === "dark"
                    ? "#7A3333"
                    : "#F1B4B4"
                  : theme === "dark"
                    ? "#C99268"
                    : "#E4B694",
              },
            ]}
          >
            <Ionicons name={icon} size={20} color="#FFFFFF" />
          </View>

          <Text
            style={[
              styles.menuLabel,
              { color: isLogout ? "#F75555" : colors.text },
            ]}
          >
            {label}
          </Text>
        </View>

        <View style={styles.menuRight}>
          {rightElement ? (
            rightElement
          ) : !isLogout ? (
            <Ionicons name="chevron-forward" size={20} color={chevronColor} />
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: pageBg }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: pageBg,
            borderBottomColor: theme === "dark" ? "#243041" : "#F0F0F0",
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Cài đặt
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <Pressable style={styles.editAvatarBtn} onPress={pickImage}>
              <Ionicons name="camera" size={16} color="white" />
            </Pressable>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            {fullName}
          </Text>

          <Text
            style={[
              styles.userPhone,
              { color: theme === "dark" ? "#94A3B8" : "#8C8C8C" },
            ]}
          >
            {email}
          </Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quản lý giao dịch
          </Text>

          <MenuItem
            icon="receipt-outline"
            label="Đơn hàng của tôi"
            onPress={() => navigation.navigate("Order")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            label="Thông tin bảo hành"
            onPress={() => navigation.navigate("Warranty")}
          />

          <MenuItem
            icon="wallet-outline"
            label="Phương thức thanh toán"
            onPress={() => navigation.navigate("PaymentMethod")}
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Cài đặt hệ thống
          </Text>

          <MenuItem
            icon="person-outline"
            label="Chỉnh sửa hồ sơ"
            onPress={() => navigation.navigate("EditProfile")}
          />

          <MenuItem
            icon="location-outline"
            label="Địa chỉ nhận hàng"
            onPress={() => navigation.navigate("Address")}
          />

          <MenuItem
            icon="contrast-outline"
            label="Chế độ tối"
            rightElement={
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{
                  false: "#EEEEEE",
                  true: "#334155",
                }}
                thumbColor="#FFF"
              />
            }
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Hỗ trợ
          </Text>

          <MenuItem
            icon="help-circle-outline"
            label="Trung tâm trợ giúp"
            onPress={() =>
              Alert.alert("Thông báo", "Chưa có nội dung trợ giúp")
            }
          />

          <MenuItem
            icon="information-circle-outline"
            label="Chính sách bảo mật"
            onPress={() =>
              Alert.alert("Thông báo", "Chưa có nội dung chính sách")
            }
          />

          <View style={{ marginTop: 10 }}>
            <MenuItem
              icon="log-out-outline"
              label="Đăng xuất"
              isLogout={true}
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4ECE4",
  },

  header: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: SERIF_FONT,
    textAlign: "left",
  },

  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatarContainer: { position: "relative" },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
  },

  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00B14F",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFF",
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
    marginTop: 12,
    color: "#1A1A1A",
  },

  userPhone: {
    fontSize: 14,
    fontFamily: SERIF_FONT,
    color: "#8C8C8C",
    marginTop: 4,
  },

  menuSection: { paddingHorizontal: 20 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
    color: "#BDBDBD",
    marginTop: 25,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  iconWrapper: {
    width: 42,
    height: 42,
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: SERIF_FONT,
    color: "#333",
  },

  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
