import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type EmptyStateProps = {
  dark?: boolean;
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onPress?: () => void;
  onPressAction?: () => void;
};

export default function EmptyState({
  dark = false,
  icon = "cube-outline",
  title,
  description,
  actionLabel,
  onAction,
  onPress,
  onPressAction,
}: EmptyStateProps) {
  const actionHandler = onAction ?? onPressAction ?? onPress;

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={52}
        color={dark ? "#475569" : "#D6D3D1"}
      />

      <Text style={[styles.title, { color: dark ? "#E2E8F0" : "#44403C" }]}>
        {title}
      </Text>

      {description ? (
        <Text
          style={[
            styles.description,
            { color: dark ? "#94A3B8" : "#78716C" },
          ]}
        >
          {description}
        </Text>
      ) : null}

      {actionLabel && actionHandler ? (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: dark ? "#E5E7EB" : "#111827" },
          ]}
          activeOpacity={0.85}
          onPress={actionHandler}
        >
          <Text
            style={[
              styles.buttonText,
              { color: dark ? "#111827" : "#FFFFFF" },
            ]}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: SERIF_FONT,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: SERIF_FONT,
  },
  button: {
    marginTop: 18,
    minWidth: 132,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },
});
