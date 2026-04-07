import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1D4ED8";
const PRIMARY_SOFT = "#DBEAFE";
const ADDRESS_KEY = "ADDRESS_DATA";

export default function AddressScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [receiverName, setReceiverName] = useState("Văn Thanh");
  const [phone, setPhone] = useState("0987654321");
  const [province, setProvince] = useState("Hà Nội");
  const [district, setDistrict] = useState("Nam Từ Liêm");
  const [ward, setWard] = useState("Mỹ Đình 1");
  const [street, setStreet] = useState("12 Trần Hữu Dực");
  const [note, setNote] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const raw = await AsyncStorage.getItem(ADDRESS_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        setReceiverName(data.receiverName ?? "Văn Thanh");
        setPhone(data.phone ?? "0987654321");
        setProvince(data.province ?? "Hà Nội");
        setDistrict(data.district ?? "Nam Từ Liêm");
        setWard(data.ward ?? "Mỹ Đình 1");
        setStreet(data.street ?? "12 Trần Hữu Dực");
        setNote(data.note ?? "");
        setIsDefault(data.isDefault ?? true);
      } catch (e) {
        console.log("load address error", e);
      }
    };

    loadAddress();
  }, []);

  const phoneValid = useMemo(
    () => /^[0-9]{9,11}$/.test(phone.trim()),
    [phone]
  );

  const fullAddress = useMemo(() => {
    return [street, ward, district, province].filter(Boolean).join(", ");
  }, [street, ward, district, province]);

  const handleSave = async () => {
    if (!receiverName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người nhận.");
      return;
    }

    if (!phoneValid) {
      Alert.alert("Lỗi", "Số điện thoại phải từ 9 đến 11 chữ số.");
      return;
    }

    if (!province.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tỉnh / thành phố.");
      return;
    }

    if (!district.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập quận / huyện.");
      return;
    }

    if (!ward.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập phường / xã.");
      return;
    }

    if (!street.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ cụ thể.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        ADDRESS_KEY,
        JSON.stringify({
          receiverName,
          phone,
          province,
          district,
          ward,
          street,
          note,
          isDefault,
        })
      );

      Alert.alert("Thành công", "Đã lưu địa chỉ nhận hàng.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể lưu địa chỉ.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={[styles.topHeader, { paddingTop: insets.top + 4 }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color="#FFF" />
            </Pressable>

            <Text style={styles.headerTitle}>Địa chỉ nhận hàng</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.previewCard}>
            <View style={styles.previewTop}>
              <Ionicons name="location" size={18} color={PRIMARY_DARK} />
              <Text style={styles.previewTitle}>Địa chỉ hiện tại</Text>
            </View>

            <Text style={styles.previewName}>
              {receiverName || "Người nhận"} · {phone || "Số điện thoại"}
            </Text>

            <Text style={styles.previewAddress}>
              {fullAddress || "Chưa có địa chỉ hoàn chỉnh"}
            </Text>

            {note.trim() ? (
              <Text style={styles.previewNote}>Ghi chú: {note}</Text>
            ) : null}
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên người nhận</Text>
              <TextInput
                value={receiverName}
                onChangeText={setReceiverName}
                placeholder="Nhập tên người nhận"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                style={[styles.input, phone.length > 0 && !phoneValid && styles.inputError]}
              />
              {phone.length > 0 && !phoneValid ? (
                <Text style={styles.errorText}>
                  Số điện thoại phải từ 9 đến 11 chữ số.
                </Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tỉnh / Thành phố</Text>
              <TextInput
                value={province}
                onChangeText={setProvince}
                placeholder="Ví dụ: Hà Nội"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Quận / Huyện</Text>
                <TextInput
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="Ví dụ: Nam Từ Liêm"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Phường / Xã</Text>
                <TextInput
                  value={ward}
                  onChangeText={setWard}
                  placeholder="Ví dụ: Mỹ Đình 1"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Địa chỉ cụ thể</Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="Số nhà, tên đường..."
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ghi chú giao hàng</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Ví dụ: Giao giờ hành chính"
                placeholderTextColor="#9CA3AF"
                multiline
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View style={styles.defaultRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.defaultTitle}>Đặt làm địa chỉ mặc định</Text>
                <Text style={styles.defaultSubtitle}>
                  Địa chỉ này sẽ được ưu tiên khi thanh toán
                </Text>
              </View>

              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: "#E5E7EB", true: PRIMARY_SOFT }}
                thumbColor={isDefault ? PRIMARY : "#FFF"}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#FFF" />
            <Text style={styles.saveBtnText}>Lưu địa chỉ</Text>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  previewCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  previewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  previewTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY_DARK,
  },

  previewName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },

  previewAddress: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },

  previewNote: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
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

  inputError: {
    borderColor: "#EF4444",
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#EF4444",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  defaultRow: {
    marginTop: 6,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  defaultTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },

  defaultSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
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