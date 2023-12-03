import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "@const/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "global/styles";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Account</Text>
      <View>
        <TouchableOpacity
          style={styles.card}
          onPress={() => console.log("Logging out")}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.gray} />
          <Text style={styles.title}>Log out</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    padding: 16,
  },
  header: {
    ...globalStyles.fontSemiBold16,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    gap: 24,
    alignItems: "center",
  },
  title: {
    flex: 1,
    ...globalStyles.fontMedium16,
  },
});
