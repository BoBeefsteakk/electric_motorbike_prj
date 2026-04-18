import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type ApiSkeletonProps = {
  dark?: boolean;
  variant?: "list" | "detail";
  count?: number;
};

type ApiErrorStateProps = {
  dark?: boolean;
  title?: string;
  description?: string;
  onRetry: () => void;
};

export function ApiSkeleton({
  dark = false,
  variant = "list",
  count = 3,
}: ApiSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  const baseColor = dark ? "#2A221C" : "#EADFD5";
  const softColor = dark ? "#3B3027" : "#F3EAE2";

  if (variant === "detail") {
    return (
      <View style={styles.detailWrap}>
        {[0, 1].map((block) => (
          <Animated.View
            key={`detail-skeleton-${block}`}
            style={[
              styles.detailCard,
              {
                opacity,
                backgroundColor: dark ? "#1D1814" : "#FFFFFF",
                borderColor: dark ? "#3C2D22" : "#E7D5C8",
              },
            ]}
          >
            <View
              style={[
                styles.lineLg,
                { backgroundColor: baseColor, marginBottom: 18 },
              ]}
            />
            <View
              style={[styles.lineMd, { backgroundColor: softColor }]}
            />
            <View
              style={[styles.lineMd, { backgroundColor: softColor }]}
            />
            <View
              style={[styles.lineSm, { backgroundColor: baseColor }]}
            />
          </Animated.View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.listWrap}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`list-skeleton-${index}`}
          style={[
            styles.listCard,
            {
              opacity,
              backgroundColor: dark ? "#1D1814" : "#FFFFFF",
              borderColor: dark ? "#3C2D22" : "#E7D5C8",
            },
          ]}
        >
          <View style={styles.listRow}>
            <View>
              <View
                style={[
                  styles.lineMd,
                  { backgroundColor: baseColor, marginBottom: 8 },
                ]}
              />
              <View
                style={[styles.lineSm, { backgroundColor: softColor }]}
              />
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: dark ? "#3B3027" : "#F3EAE2" },
              ]}
            />
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: dark ? "#3B3027" : "#F3EAE2" },
            ]}
          />

          <View style={styles.listRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: dark ? "#3B3027" : "#F3EAE2" },
              ]}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View
                style={[
                  styles.lineMd,
                  { backgroundColor: baseColor, marginBottom: 8 },
                ]}
              />
              <View
                style={[styles.lineSm, { backgroundColor: softColor }]}
              />
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: dark ? "#3B3027" : "#F3EAE2", marginTop: 14 },
            ]}
          />

          <View style={[styles.listRow, { marginTop: 12 }]}>
            <View
              style={[styles.lineSm, { backgroundColor: softColor, width: 86 }]}
            />
            <View
              style={[styles.lineSm, { backgroundColor: baseColor, width: 110 }]}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

export function ApiErrorState({
  dark = false,
  title = "Không tải được dữ liệu",
  description = "Kết nối hiện tại chưa ổn định. Vui lòng thử lại.",
  onRetry,
}: ApiErrorStateProps) {
  return (
    <View style={styles.errorWrap}>
      <View
        style={[
          styles.errorCard,
          {
            backgroundColor: dark ? "#1D1814" : "#FFFFFF",
            borderColor: dark ? "#3C2D22" : "#E7D5C8",
          },
        ]}
      >
        <Text style={[styles.errorTitle, { color: dark ? "#F5EDE5" : "#111111" }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.errorDesc,
            { color: dark ? "#BFAE9F" : "#6B5B4D" },
          ]}
        >
          {description}
        </Text>
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    padding: 16,
  },
  detailWrap: {
    padding: 16,
  },
  listCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    borderRadius: 999,
    marginTop: 12,
  },
  badge: {
    width: 88,
    height: 28,
    borderRadius: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  lineLg: {
    width: "62%",
    height: 18,
    borderRadius: 10,
  },
  lineMd: {
    width: "48%",
    height: 14,
    borderRadius: 8,
  },
  lineSm: {
    width: "34%",
    height: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
    textAlign: "center",
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 14,
    fontFamily: SERIF_FONT,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  retryBtn: {
    backgroundColor: "#C47A4A",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },
});
