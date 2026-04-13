import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
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

  const navigation = useNavigation<any>();

  const [avatarUri, setAvatarUri] = useState(DEFAULT_AVATAR);
  const [fullName, setFullName] = useState(DEFAULT_NAME);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  const loadProfileData = async () => {
    try {
      const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
      const rawAuth = await AsyncStorage.getItem(AUTH_USER_KEY);

      const profile = rawProfile ? JSON.parse(rawProfile) : {};
      const auth = rawAuth ? JSON.parse(rawAuth) : {};

      const isSameUser = profile.email === auth.account;

      const mergedName = isSameUser
        ? profile.fullName || auth.account
        : auth.account || DEFAULT_NAME;

      const mergedEmail = auth.account || DEFAULT_EMAIL;
      const mergedAvatar = profile.avatarUri || DEFAULT_AVATAR;

      setAvatarUri(mergedAvatar);
      setFullName(mergedName);
      setEmail(mergedEmail);

      if (!rawProfile) {
        await AsyncStorage.setItem(
          PROFILE_KEY,
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

        setAvatarUri(newAvatar);

        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        const oldData = raw ? JSON.parse(raw) : {};

        await AsyncStorage.setItem(
          PROFILE_KEY,
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
            await AsyncStorage.multiRemove(["token", AUTH_USER_KEY, PROFILE_KEY]);

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
  }: MenuItemProps) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && {
          backgroundColor: theme === "dark" ? "#2A3342" : "#F5F5F5",
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isLogout
                ? theme === "dark"
                  ? "#3A1F24"
                  : "#FFF5F5"
                : theme === "dark"
                  ? "#1F2937"
                  : "#F8F9FA",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={
              isLogout ? "#F75555" : theme === "dark" ? "#FFFFFF" : "#212121"
            }
          />
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
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme === "dark" ? "#94A3B8" : "#BDBDBD"}
          />
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
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
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#64748B" : "#BDBDBD" },
            ]}
          >
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

          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#64748B" : "#BDBDBD" },
            ]}
          >
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

          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? "#64748B" : "#BDBDBD" },
            ]}
          >
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
    backgroundColor: "#FFFFFF",
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
    marginTop: 12,
    color: "#1A1A1A",
  },

  userPhone: {
    fontSize: 14,
    color: "#8C8C8C",
    marginTop: 4,
  },

  menuSection: { paddingHorizontal: 20 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
