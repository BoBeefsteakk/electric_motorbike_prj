import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";

import ForgotPasswordScreen from "../pages/forgot";
import LoginScreen from "../pages/login";
import RegisterScreen from "../pages/register";

import { CartScreen } from "../pages/cart";
import HomeScreen from "../pages/home";
import { ProfileScreen } from "../pages/profile";
import SearchScreen from "../pages/search";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ================= AUTH STACK ================= */

function AuthNavigation() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="login" component={LoginScreen} />
      <AuthStack.Screen name="register" component={RegisterScreen} />
      <AuthStack.Screen name="forgot" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

/* ================= TAB ================= */

function InappNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let icon = "home";
          if (route.name === "cart") icon = "shopping-cart";
          if (route.name === "search") icon = "search";
          if (route.name === "profile") icon = "user";
          return <Icon name={icon} size={20} color={color} />;
        },
        tabBarActiveTintColor: "#39B78D",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="search" component={SearchScreen} />
      <Tab.Screen name="cart" component={CartScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* ================= ROOT ================= */

export function AppNavigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="auth" component={AuthNavigation} />
        <RootStack.Screen name="inapp" component={InappNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
