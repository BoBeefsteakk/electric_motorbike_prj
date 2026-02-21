import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height } = Dimensions.get("window");
const BOTTOM_HEIGHT = height * 0.62;

// ⚠️ ĐỔI IP THEO BACKEND CỦA PRI
const API_URL = "http://192.168.56.100:5000/api/auth";

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE LOGIN
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          account: username,
          password
        })
      });

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("DATA:", data);

      if (!response.ok) {
        Alert.alert(
          "Đăng nhập thất bại",
          data.message || "Sai tài khoản hoặc mật khẩu",
        );
        return;
      }

      // ✅ Lưu token
      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Thành công", "Đăng nhập thành công!");

      navigation.replace("inapp"); // dùng replace để không quay lại login
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <View style={styles.logoWrapper}>
        <Image
          source={require("../../../pic/login/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomBox}>
        <Text style={styles.title}>Sign In</Text>

        {/* USERNAME */}
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color="#999" />
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable onPress={() => navigation.navigate("forgot")} hitSlop={10}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Sign in</Text>
              <View style={styles.arrow}>
                <Ionicons name="arrow-forward" size={22} color="#fff" />
              </View>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.registerRow}>
          <Text style={{ color: "#777" }}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate("register")}>
            <Text style={styles.registerText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  background: {
    flex: 1,
    backgroundColor: "#D6EAF8",
  },

  logoWrapper: {
    position: "absolute",
    top: height * 0.05,
    alignSelf: "center",
  },

  logo: {
    width: 300,
    height: 300,
  },

  bottomBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: BOTTOM_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  forgot: {
    textAlign: "right",
    color: "#777",
    marginVertical: 15,
  },

  button: {
    backgroundColor: "#5DADE2",
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  arrow: {
    position: "absolute",
    right: 15,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerText: {
    fontWeight: "600",
  },
});

export default LoginScreen;
