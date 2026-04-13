import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppNotificationType = "login" | "order" | "profile";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  createdAt: string;
};

const NOTIFICATION_KEY = "APP_NOTIFICATIONS";

export const getNotifications = async (): Promise<AppNotification[]> => {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log("getNotifications error:", error);
    return [];
  }
};

export const addNotification = async ({
  type,
  title,
  message,
}: Omit<AppNotification, "id" | "createdAt">) => {
  try {
    const current = await getNotifications();

    const nextItem: AppNotification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
    };

    const next = [nextItem, ...current];
    await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(next));
    return next;
  } catch (error) {
    console.log("addNotification error:", error);
    return [];
  }
};

export const clearNotifications = async () => {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_KEY);
  } catch (error) {
    console.log("clearNotifications error:", error);
  }
};
