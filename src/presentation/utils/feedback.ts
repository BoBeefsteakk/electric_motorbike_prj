import { Alert, Platform, ToastAndroid } from "react-native";
import { CartToastRef } from "../pages/cart";

type FeedbackType = "success" | "error" | "info";

type FeedbackOptions = {
  type?: FeedbackType;
  title?: string;
  message: string;
};

const DEFAULT_TITLE: Record<FeedbackType, string> = {
  success: "Thành công",
  error: "Lỗi",
  info: "Thông báo",
};

export function showFeedback({
  type = "info",
  title,
  message,
}: FeedbackOptions) {
  if (type === "success" && CartToastRef.current?.show) {
    CartToastRef.current.show(message);
    return;
  }

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert(title || DEFAULT_TITLE[type], message);
}
