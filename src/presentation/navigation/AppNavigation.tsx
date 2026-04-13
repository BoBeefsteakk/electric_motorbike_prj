import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Alert, BackHandler, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import ForgotPasswordScreen from "../pages/forgot";
import LoginScreen from "../pages/login";
import RegisterScreen from "../pages/register";
import ResetPasswordScreen from "../pages/resetPassword";

import DetailScreen from "../../screen/detailScreen";
import SearchScreen from "../../screen/searchScreen";

import CartScreen, { CartToast, CartToastRef } from "../pages/cart";
import CheckoutScreen from "../pages/checkout";
import HomeScreen from "../pages/home";
import OrderScreen from "../pages/Order";
import PaymentSuccessScreen from "../pages/PaymentSuccess";
import SettingScreen from "../pages/setting";
import WarrantyScreen from "../pages/WarrantyScreen";

import HomeBannerDetail from "../pages/home_expand/home_banner_detail";

/* CATEGORY */
import CategoryCaoCap from "../pages/home_expand/categories_tab/CategoryCaoCap";
import CategoryOTo from "../pages/home_expand/categories_tab/CategoryOTo";
import CategoryPhoThong from "../pages/home_expand/categories_tab/CategoryPhoThong";
import CategoryPhuKien from "../pages/home_expand/categories_tab/CategoryPhuKien";
import CategorySpecial from "../pages/home_expand/categories_tab/CategorySpecial";
import CategoryTrungCap from "../pages/home_expand/categories_tab/CategoryTrungCap";

/* STORE */
import HomeStoreList from "../pages/home_expand/detail_store_compoment/home_store_list";
import StoreDetailScreen from "../pages/home_expand/detail_store_compoment/StoreBaseScreen";

/* BEST PRICES */
import BestPriceAllScreen from "../pages/home_expand/best_prices/BestPriceAllScreen";
import BestPriceDetailScreen from "../pages/home_expand/best_prices/BestPriceDetailScreen";
import { makeBestPriceRedirect } from "../pages/home_expand/best_prices/Bestpriceredirect ";

/* NEWS */
import News1 from "../pages/home_expand/news_details/news1";
import News2 from "../pages/home_expand/news_details/news2";
import News3 from "../pages/home_expand/news_details/news3";

/* CAR & ACCESSORY DETAIL */
import AccessoryDetailScreen from "../pages/home_expand/AccessoryDetailScreen";
import CarDetailScreen from "../pages/home_expand/CarDetailScreen";

/* SETTING */
import PaymentMethodScreen from "../pages/paymentMethod";
import EditProfileScreen from "../pages/editProfile";
import AddressScreen from "../pages/address";

/* TYPES */
import {
  HomeStackParamList,
  RootStackParamList,
  TabParamList,
} from "./types";

/* THEME */
import { useTheme } from "../../context/themeContext";

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const BEST_PRICE_IDS = Array.from({ length: 21 }, (_, i) => i + 1);
const BestPriceRedirects = Object.fromEntries(
  BEST_PRICE_IDS.map((id) => [`best_prices_${id}`, makeBestPriceRedirect(id)])
);

const EXIT_ROUTES = new Set(["home_main", "search_main", "cart_main", "setting"]);

function getActiveRouteName(state: any): string {
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state);
  return route.name;
}

/* ================= HOME STACK ================= */

function HomeNavigation() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <HomeStack.Screen name="home_main" component={HomeScreen} />
      <HomeStack.Screen
        name="home_banner_detail"
        component={HomeBannerDetail}
      />

      {/* CATEGORY */}
      <HomeStack.Screen name="category_special" component={CategorySpecial} />
      <HomeStack.Screen
        name="category_pho_thong"
        component={CategoryPhoThong}
      />
      <HomeStack.Screen
        name="category_trung_cap"
        component={CategoryTrungCap}
      />
      <HomeStack.Screen name="category_cao_cap" component={CategoryCaoCap} />
      <HomeStack.Screen name="category_o_to" component={CategoryOTo} />
      <HomeStack.Screen name="category_phu_kien" component={CategoryPhuKien} />

      {/* STORE */}
      <HomeStack.Screen name="home_store_list" component={HomeStoreList} />
      <HomeStack.Screen name="store_detail" component={StoreDetailScreen} />

      {/* BEST PRICES */}
      <HomeStack.Screen name="best_price_all" component={BestPriceAllScreen} />
      <HomeStack.Screen
        name="best_price_detail"
        component={BestPriceDetailScreen}
      />

      {BEST_PRICE_IDS.map((id) => (
        <HomeStack.Screen
          key={`best_prices_${id}`}
          name={`best_prices_${id}` as any}
          component={BestPriceRedirects[`best_prices_${id}`]}
        />
      ))}

      {/* CAR & ACCESSORY DETAIL */}
      <HomeStack.Screen name="car_detail" component={CarDetailScreen} />
      <HomeStack.Screen
        name="accessory_detail"
        component={AccessoryDetailScreen}
      />

      {/* NEWS */}
      <HomeStack.Screen name="news1" component={News1} />
      <HomeStack.Screen name="news2" component={News2} />
      <HomeStack.Screen name="news3" component={News3} />
    </HomeStack.Navigator>
  );
}

/* ================= SEARCH STACK ================= */

function SearchNavigation() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <SearchStack.Screen name="search_main" component={SearchScreen} />
      <SearchStack.Screen
        name="best_price_detail"
        component={BestPriceDetailScreen}
      />
      <SearchStack.Screen name="car_detail" component={CarDetailScreen} />
      <SearchStack.Screen
        name="accessory_detail"
        component={AccessoryDetailScreen}
      />
    </SearchStack.Navigator>
  );
}

/* ================= CART STACK ================= */

function CartNavigation() {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <CartStack.Screen name="cart_main" component={CartScreen} />
      <CartStack.Screen
        name="best_price_detail"
        component={BestPriceDetailScreen}
      />
      <CartStack.Screen name="car_detail" component={CarDetailScreen} />
      <CartStack.Screen
        name="accessory_detail"
        component={AccessoryDetailScreen}
      />
    </CartStack.Navigator>
  );
}

/* ================= AUTH STACK ================= */

function AuthNavigation() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="login" component={LoginScreen} />
      <AuthStack.Screen name="register" component={RegisterScreen} />
      <AuthStack.Screen name="forgot" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="resetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

/* ================= TAB ================= */

function InappNavigation() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon = "home";

          if (route.name === "cart") icon = "shopping-cart";
          if (route.name === "search") icon = "search";
          if (route.name === "setting") icon = "cog";

          return <Icon name={icon} size={size ?? 22} color={color} />;
        },
        tabBarActiveTintColor: isDark ? "#60A5FA" : "#39B78D",
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "gray",
        tabBarStyle: {
          height: 60,
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderTopColor: isDark ? "#1F2937" : "#E5E7EB",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
        tabBarItemStyle: { flex: 1 },
        sceneContainerStyle: {
          backgroundColor: isDark ? "#020617" : "#FFFFFF",
        },
      })}
    >
      <Tab.Screen
        name="home"
        component={HomeNavigation}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="search"
        component={SearchNavigation}
        options={{ tabBarLabel: "Search" }}
      />
      <Tab.Screen
        name="cart"
        component={CartNavigation}
        options={{ tabBarLabel: "Cart" }}
      />
      <Tab.Screen
        name="setting"
        component={SettingScreen}
        options={{ tabBarLabel: "Setting" }}
      />
    </Tab.Navigator>
  );
}

/* ================= ROOT ================= */

export function AppNavigation() {
  useEffect(() => {
    const clearSession = async () => {
      await AsyncStorage.removeItem("token");
    };
    clearSession();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (!navigationRef.isReady()) return false;

      const rootState = navigationRef.getRootState();
      const activeRouteName = getActiveRouteName(rootState);

      if (EXIT_ROUTES.has(activeRouteName)) {
        Alert.alert("Thoát ứng dụng", "Bạn có muốn thoát không?", [
          { text: "Không", style: "cancel" },
          {
            text: "Có",
            onPress: async () => {
              await AsyncStorage.removeItem("token");
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator
          initialRouteName="auth"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <RootStack.Screen name="auth" component={AuthNavigation} />
          <RootStack.Screen name="inapp" component={InappNavigation} />
          <RootStack.Screen name="checkout" component={CheckoutScreen} />
          <RootStack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
          />
          <RootStack.Screen
            name="PaymentMethod"
            component={PaymentMethodScreen}
          />
          <RootStack.Screen name="DetailScreen" component={DetailScreen} />
          <RootStack.Screen name="Order" component={OrderScreen} />
          <RootStack.Screen name="Warranty" component={WarrantyScreen} />
          <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
          <RootStack.Screen name="Address" component={AddressScreen} />
        </RootStack.Navigator>
      </NavigationContainer>

      <CartToast ref={CartToastRef} />
    </View>
  );
}