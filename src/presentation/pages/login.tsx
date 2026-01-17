import React from 'react';
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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const BOTTOM_HEIGHT = height * 0.62;

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* ✅ CHỈ dismiss keyboard khi bấm nền */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../../pic/login/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomBox}>
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color="#999" />
          <TextInput placeholder="Username" style={styles.input} />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* ✅ FIX CHUẨN: dùng Pressable */}
        <Pressable
          onPress={() => navigation.navigate('forgot')}
          hitSlop={10}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </Pressable>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('inapp')}>
          <Text style={styles.buttonText}>Sign in</Text>
          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={{ color: '#777' }}>
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('register')}>
            <Text style={styles.registerText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    backgroundColor: '#D6EAF8',
  },

  logoWrapper: {
    position: 'absolute',
    top: height * 0.05,
    alignSelf: 'center',
  },

  logo: {
    width: 300,
    height: 300,
  },

  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: BOTTOM_HEIGHT, // ⭐ CỐ ĐỊNH → KHÔNG BUG
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
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
    textAlign: 'right',
    color: '#777',
    marginVertical: 15,
  },

  button: {
    backgroundColor: '#5DADE2',
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  arrow: {
    position: 'absolute',
    right: 15,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  registerText: {
    fontWeight: '600',
  },
});


export default LoginScreen;
