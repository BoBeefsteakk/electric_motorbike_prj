import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { lightTheme, darkTheme } from "../../theme/colors";

const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1D4ED8";
const PRIMARY_SOFT = "#DBEAFE";
const PROFILE_KEY = "PROFILE_DATA";

type GenderType = "Nam" | "Nữ" | "Khác";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/21/6b/03/216b036577589d7010a30b696f839634.jpg";
const DEFAULT_NAME = "Văn Thanh";
const DEFAULT_EMAIL = "thanhvan@example.com";
const DEFAULT_PHONE = "0987654321";
const DEFAULT_BIRTHDAY = "12/10/2003";
const DEFAULT_GENDER: GenderType = "Nam";
const DEFAULT_ADDRESS = "Hà Nội, Việt Nam";

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState(DEFAULT_AVATAR);
  const [fullName, setFullName] = useState(DEFAULT_NAME);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [birthday, setBirthday] = useState(DEFAULT_BIRTHDAY);
  const [gender, setGender] = useState<GenderType>(DEFAULT_GENDER);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const phoneValid = useMemo(() => /^[0-9]{9,11}$/.test(phone.trim()), [phone]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        setAvatarUri(data.avatarUri ?? DEFAULT_AVATAR);
        setFullName(data.fullName ?? DEFAULT_NAME);
        setEmail(data.email ?? DEFAULT_EMAIL);
        setPhone(data.phone ?? DEFAULT_PHONE);
        setBirthday(data.birthday ?? DEFAULT_BIRTHDAY);
        setGender(data.gender ?? DEFAULT_GENDER);
        setAddress(data.address ?? DEFAULT_ADDRESS);
      } catch (error) {
        console.log("Load profile error:", error);
      }
    };

    loadProfile();
  }, []);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần quyền truy cập thư viện ảnh.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh đại diện.");
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên.");
      return;
    }

    if (!emailValid) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    if (!phoneValid) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
      return;
    }

    if (!birthday.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày sinh.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          avatarUri,
          fullName,
          email,
          phone,
          birthday,
          gender,
          address,
        })
      );

      Alert.alert("Thành công", "Cập nhật hồ sơ thành công.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu hồ sơ.");
    }
  };

  const GenderChip = ({
    label,
    active,
    onPress,
  }: {
    label: GenderType;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.genderChip,
        {
          borderColor: active
            ? PRIMARY
            : theme === "dark"
            ? "#334155"
            : "#E5E7EB",
          backgroundColor: active
            ? PRIMARY_SOFT
            : theme === "dark"
            ? colors.card
            : "#F9FAFB",
        },
      ]}
    >
      <Text
        style={[
          styles.genderChipText,
          {
            color: active
              ? PRIMARY_DARK
              : theme === "dark"
              ? "#CBD5E1"
              : "#6B7280",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PRIMARY}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={[styles.topHeader, { paddingTop: insets.top + 4 }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#FFF" />
            </Pressable>

            <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <Pressable style={styles.editAvatarBtn} onPress={pickImage}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </Pressable>
            </View>
            <Text
              style={[
                styles.avatarHint,
                { color: theme === "dark" ? "#94A3B8" : "#6B7280" },
              ]}
            >
              Nhấn vào biểu tượng máy ảnh để đổi ảnh
            </Text>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                shadowOpacity: theme === "dark" ? 0 : 0.06,
                elevation: theme === "dark" ? 0 : 4,
                borderWidth: theme === "dark" ? 1 : 0,
                borderColor: theme === "dark" ? "#334155" : "transparent",
              },
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Họ và tên
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor:
                      email.length > 0 && !emailValid
                        ? "#EF4444"
                        : theme === "dark"
                        ? "#334155"
                        : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
              {email.length > 0 && !emailValid && (
                <Text style={styles.errorText}>
                  Email không đúng định dạng.
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Số điện thoại
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor:
                      phone.length > 0 && !phoneValid
                        ? "#EF4444"
                        : theme === "dark"
                        ? "#334155"
                        : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
              {phone.length > 0 && !phoneValid && (
                <Text style={styles.errorText}>
                  Số điện thoại phải từ 9 đến 11 chữ số.
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Ngày sinh
              </Text>
              <TextInput
                value={birthday}
                onChangeText={setBirthday}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Giới tính
              </Text>
              <View style={styles.genderRow}>
                <GenderChip
                  label="Nam"
                  active={gender === "Nam"}
                  onPress={() => setGender("Nam")}
                />
                <GenderChip
                  label="Nữ"
                  active={gender === "Nữ"}
                  onPress={() => setGender("Nữ")}
                />
                <GenderChip
                  label="Khác"
                  active={gender === "Khác"}
                  onPress={() => setGender("Khác")}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Địa chỉ
              </Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                multiline
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#FFF" />
            <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 18,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 4,
    borderColor: "#FFF",
    backgroundColor: "#E5E7EB",
  },

  editAvatarBtn: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  avatarHint: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
  },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },

  textArea: {
    height: 92,
    textAlignVertical: "top",
    paddingTop: 14,
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#EF4444",
  },

  genderRow: {
    flexDirection: "row",
    gap: 10,
  },

  genderChip: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  genderChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  saveBtn: {
    marginTop: 20,
    height: 54,
    borderRadius: 18,
    backgroundColor: PRIMARY_DARK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});