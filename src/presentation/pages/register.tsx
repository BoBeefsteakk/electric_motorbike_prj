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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');
const BOTTOM_HEIGHT = height * 0.68;

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.background} />

        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../pic/login/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomBox}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#999" />
            <TextInput placeholder="Username" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color="#999" />
            <TextInput placeholder="Email" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#777' }}>Already have an account? </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.goBack()}
            >
              Sign in
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
    backgroundColor: '#D6EAF8',
  },

  logoWrapper: {
    position: 'absolute',
    top: height * 0.03,
    alignSelf: 'center',
  },

  logo: {
    width: 270,
    height: 270,
  },

  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: BOTTOM_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    paddingTop: 45,
    elevation: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  desc: {
    color: '#777',
    marginBottom: 20,
    lineHeight: 20,
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

  button: {
    backgroundColor: '#5DADE2',
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
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

  bottomText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  link: {
    fontWeight: '600',
    color: '#333',
  },
});


export default RegisterScreen;
