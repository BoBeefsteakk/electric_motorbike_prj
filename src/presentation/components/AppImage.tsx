import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Image, ImageResizeMode, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type AppImageProps = {
  uri?: string | null;
  resizeMode?: ImageResizeMode;
  style?: any;
  dark?: boolean;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackEmoji?: string;
  fallbackLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function AppImage({
  uri,
  resizeMode = "cover",
  style,
  dark = false,
  fallbackIcon = "image-outline",
  fallbackEmoji,
  fallbackLabel = "Không có ảnh",
  containerStyle,
}: AppImageProps) {
  const [failed, setFailed] = useState(false);

  const shouldShowFallback = useMemo(() => {
    return failed || !uri || !String(uri).trim();
  }, [failed, uri]);

  if (shouldShowFallback) {
    return (
      <View
        style={[
          styles.fallback,
          {
            backgroundColor: dark ? "#1F2937" : "#F0ECE8",
            borderColor: dark ? "#334155" : "#E4D7CC",
          },
          style,
          containerStyle,
        ]}
      >
        {fallbackEmoji ? (
          <Text style={styles.emoji}>{fallbackEmoji}</Text>
        ) : (
          <Ionicons
            name={fallbackIcon}
            size={42}
            color={dark ? "#94A3B8" : "#B08968"}
          />
        )}
        <Text
          style={[
            styles.label,
            { color: dark ? "#94A3B8" : "#8A786A" },
          ]}
        >
          {fallbackLabel}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: String(uri) }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: SERIF_FONT,
  },
});
