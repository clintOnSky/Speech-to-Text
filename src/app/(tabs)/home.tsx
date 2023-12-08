import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { globalStyles } from "global/styles";
import { COLORS, SIZES } from "@const/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Tabs } from "expo-router";

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Tabs.Screen
          options={{
            header: () => (
              <View style={styles.header}>
                <Text style={styles.welcome}>
                  Welcome <Text style={styles.firstName}>Clinton</Text>
                </Text>
                <Text style={styles.remainingText}>
                  Remaining Minutes:{" "}
                  <Text style={{ color: COLORS.primary }}>89</Text>
                </Text>
              </View>
            ),
          }}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button}>
            <View style={styles.icon}>
              <Ionicons name="mic-outline" size={30} color={COLORS.primary} />
            </View>
            <View style={{ gap: 5 }}>
              <Text style={styles.buttonTitle}>Record</Text>
              <Text style={styles.buttonDesc}>and Transcribe audio files</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <View style={styles.icon}>
              <Ionicons
                name="musical-note-outline"
                size={30}
                color={COLORS.primary}
              />
            </View>
            <View style={{ gap: 5 }}>
              <Text style={styles.buttonTitle}>Pick an audio file</Text>
              <Text style={styles.buttonDesc}>and Transcribe</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingHorizontal: wp(SIZES.medium),
  },
  header: {
    backgroundColor: COLORS.light,
    paddingTop: 40,
    paddingHorizontal: wp(SIZES.small),
    gap: 15,
    paddingBottom: 15,
  },
  welcome: {
    ...globalStyles.fontSemiBold20,
  },
  firstName: {
    ...globalStyles.fontBold20,
    color: COLORS.primary,
  },
  remainingText: {
    ...globalStyles.fontSemiBold16,
  },
  buttonView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    gap: 15,
    justifyContent: "center",
    paddingHorizontal: wp(SIZES.medium),
    elevation: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: wp(SIZES.medium2),
    alignItems: "center",
    gap: 15,
    borderRadius: 15,
    elevation: 1,
  },
  icon: {
    padding: 10,
    backgroundColor: COLORS.lightBrown,
    borderRadius: 30,
  },
  buttonTitle: {
    ...globalStyles.fontBold16,
  },
  buttonDesc: {
    ...globalStyles.fontSemiBold14,
    color: COLORS.primary,
  },
});
