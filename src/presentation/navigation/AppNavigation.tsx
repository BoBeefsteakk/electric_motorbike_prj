import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import ForgotPasswordScreen from "../pages/forgot";
import LoginScreen from "../pages/login";
import RegisterScreen from "../pages/register";

import DetailScreen from "../../screen/detailScreen";
import CartScreen from "../pages/cart";
import HomeScreen from "../pages/home";
import ProfileScreen from "../pages/profile";
import OrderScreen from "../pages/Order";
import HomeBannerDetail from "../pages/home_expand/home_banner_detail";

/* CATEGORY */
import CategoryCaoCap from "../pages/home_expand/categories_tab/CategoryCaoCap";
import CategoryOTo from "../pages/home_expand/categories_tab/CategoryOTo";
import CategoryPhoThong from "../pages/home_expand/categories_tab/CategoryPhoThong";
import CategoryPhuKien from "../pages/home_expand/categories_tab/CategoryPhuKien";
import CategorySpecial from "../pages/home_expand/categories_tab/CategorySpecial";
import CategoryTrungCap from "../pages/home_expand/categories_tab/CategoryTrungCap";

/* STORE */
import Store1Screen from "../pages/home_expand/detail_store_compoment/Store1Screen";
import Store2Screen from "../pages/home_expand/detail_store_compoment/Store2Screen";
import Store3Screen from "../pages/home_expand/detail_store_compoment/Store3Screen";
import Store4Screen from "../pages/home_expand/detail_store_compoment/Store4Screen";
import Store5Screen from "../pages/home_expand/detail_store_compoment/Store5Screen";
import HomeStoreList from "../pages/home_expand/home_store_list";

/* BEST PRICES */
import BestPriceDetailScreen from "../pages/home_expand/best_prices/BestPriceDetailScreen";


import News1 from "../pages/home_expand/news_details/news1";
import News2 from "../pages/home_expand/news_details/news2";
import News3 from "../pages/home_expand/news_details/news3";



import SearchScreen from "../../screen/searchScreen";
import BestPriceAllScreen from "../pages/home_expand/best_prices/BestPriceAllScreen";
import { HomeStackParamList, RootStackParamList, TabParamList } from "./types";

import CheckoutScreen from '../pages/checkout';
import PaymentSuccessScreen from '../pages/PaymentSuccess';

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/* ================= HOME STACK ================= */

function HomeNavigation() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="home_main" component={HomeScreen} />
      <HomeStack.Screen
        name="home_banner_detail"
        component={HomeBannerDetail}
      />

      {/* CATEGORY */}
      <HomeStack.Screen name="category_special" component={CategorySpecial} />
      <HomeStack.Screen name="category_pho_thong" component={CategoryPhoThong} />
      <HomeStack.Screen name="category_trung_cap" component={CategoryTrungCap} />
      <HomeStack.Screen name="category_cao_cap" component={CategoryCaoCap} />
      <HomeStack.Screen name="category_o_to" component={CategoryOTo} />
      <HomeStack.Screen name="category_phu_kien" component={CategoryPhuKien} />

      {/* STORE */}
      <HomeStack.Screen name="home_store_list" component={HomeStoreList} />
      <HomeStack.Screen name="store_1_detail" component={Store1Screen} />
      <HomeStack.Screen name="store_2_detail" component={Store2Screen} />
      <HomeStack.Screen name="store_3_detail" component={Store3Screen} />
      <HomeStack.Screen name="store_4_detail" component={Store4Screen} />
      <HomeStack.Screen name="store_5_detail" component={Store5Screen} />

      {/* BEST PRICES */}
      <HomeStack.Screen name="best_price_all" component={BestPriceAllScreen} />
      <HomeStack.Screen name="best_price_detail" component={BestPriceDetailScreen} />

      <HomeStack.Screen name="news1" component={News1} />
      <HomeStack.Screen name="news2" component={News2} />
      <HomeStack.Screen name="news3" component={News3} />
    </HomeStack.Navigator>
  );
}

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
        tabBarIcon: ({ color, size }) => {
          let icon = "home";
          if (route.name === "cart") icon = "shopping-cart";
          if (route.name === "search") icon = "search";
          if (route.name === "profile") icon = "user";
          return <Icon name={icon} size={size ?? 22} color={color} />;
        },
        tabBarActiveTintColor: "#39B78D",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          flex: 1,
        },
      })}
    >
      <Tab.Screen name="home" component={HomeNavigation} />
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
        <RootStack.Screen name="checkout" component={CheckoutScreen} />
        <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <RootStack.Screen name="DetailScreen" component={DetailScreen} />
        <RootStack.Screen name="Order" component={OrderScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
