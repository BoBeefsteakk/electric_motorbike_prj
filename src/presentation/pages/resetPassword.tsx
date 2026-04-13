import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import API_URL from "../../data/api/apis";

const { height } = Dimensions.get("window");
const BOTTOM_HEIGHT = height * 0.58;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { account } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const acc = String(account || "").trim();

    if (!acc) {
      Alert.alert("Error", "Missing account");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: acc,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "Password reset successful", [
          {
            text: "OK",
            onPress: () => navigation.navigate("login"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Reset password failed");
      }
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.background} />

        <View style={styles.logoWrapper}>
          <Image
            source={require("../../../pic/login/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomBox}>
          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.desc}>
            Account: <Text style={{ fontWeight: "700" }}>{account}</Text>
          </Text>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Reset Password</Text>
                <View style={styles.arrow}>
                  <Ionicons name="arrow-forward" size={22} color="#fff" />
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={styles.link} onPress={() => navigation.goBack()}>
              Back
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    top: height * 0.08,
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
    paddingTop: 45,
    elevation: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  desc: {
    color: "#777",
    marginBottom: 20,
    lineHeight: 20,
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

  button: {
    backgroundColor: "#5DADE2",
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
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

  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  link: {
    fontWeight: "600",
    color: "#333",
  },
});

export default ResetPasswordScreen;