import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { grayScale } from "@/constants/theme/base";
import { useI18n } from "@/hooks/use-i-18n";
import { tokenStore } from "@/utils/auth/tokenStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { getUserInfo } from "@/api/app/user";
import { GetUserInfoResponse } from "@/api/type/user";
import { API_CODE } from "@/constants/auth";
import { formatAddress } from "@/utils/system/lib";

/**
 * 个人资料头部组件
 * 展示用户头像、ID、用户名以及选中的标签。
 */
export function ProfileHeader() {
  const { t } = useI18n();
  const [userId, setUserId] = useState("");
  const getUserId = async () => {
    const userId = await tokenStore.getUserId();
    setUserId(userId || "");
  };

  useEffect(() => {
    getUserId();
  }, []);
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse | null>(null);
  const getUserInfoData = async () => {
    try {
      const res = await getUserInfo();
      console.log("res", res);
      if (res.code === API_CODE.SUCCESS) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error("getUserInfoData error", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserInfoData();
    }
  }, [userId]);
  console.log("userInfo----", userInfo);

  return (
    <TouchableOpacity style={styles.profileHeader} activeOpacity={0.7}>
      <ThemedView style={styles.profileInfo}>
        <LinearGradient colors={["#A855F7", "#7C3AED"]} style={styles.avatar}>
          <MaterialCommunityIcons name="wallet" size={32} color="#fff" />
        </LinearGradient>
        <ThemedView style={styles.nameContainer}>
          <ThemedText style={styles.idText}>
            ID: {userInfo?.addresses?.[0]?.chain_id || "--------"}
          </ThemedText>
          <ThemedText style={styles.userName}>
            {formatAddress(userInfo?.addresses?.[0]?.address || "") ||
              "账户未登录"}
          </ThemedText>
          <ThemedView style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {t("mine.auto_gas_enabled")}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={grayScale[100]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
    marginTop: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nameContainer: {
    justifyContent: "center",
  },
  idText: {
    color: grayScale[200],
    fontSize: 12,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: "rgba(64, 141, 118, 0.26)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#00A478",
    fontSize: 11,
    fontWeight: "600",
  },
});
