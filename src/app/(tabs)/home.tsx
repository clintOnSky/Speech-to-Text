import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useContext, useState } from "react";
import { globalStyles } from "global/styles";
import { COLORS, SIZES } from "@const/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Link, Tabs } from "expo-router";
import { RecordingContext } from "@context/recordingContext";
import * as DocumentPicker from "expo-document-picker";
import { AuthUserContext } from "@context/authContext";

const Home = () => {
  const { showRecorder, saveAudio } = useContext(RecordingContext);
  const { currentUser } = useContext(AuthUserContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const getAudioFromStorage = async () => {
  //   try {
  //     setIsLoading(true);
  //     let result = await DocumentPicker.getDocumentAsync({
  //       copyToCacheDirectory: true,
  //       type: "audio/*",
  //     });
  //     if (!result.canceled) {
  //       const file = result.assets[0];
  //       if (file.size < 25000000) {
  //         await saveAudio(file.uri);
  //       } else {
  //         Alert.alert(
  //           "File size exceeded limits",
  //           "Make sure the file is less than 10MB"
  //         );
  //       }
  //     } else {
  //       Alert.alert("Something went wrong");
  //     }
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Tabs.Screen
          options={{
            header: () => (
              <View style={styles.header}>
                <Text
                  style={styles.welcome}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Welcome <Text style={styles.email}>{currentUser?.email}</Text>
                </Text>
              </View>
            ),
          }}
        />
        <View style={styles.buttonView}>
          <Link href="/record" asChild>
            <TouchableOpacity style={styles.button} onPress={showRecorder}>
              <View style={styles.icon}>
                <Ionicons name="mic-outline" size={30} color={COLORS.primary} />
              </View>
              <View style={{ gap: 5 }}>
                <Text style={styles.buttonTitle}>Record</Text>
                <Text style={styles.buttonDesc}>
                  and Transcribe audio files
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
          {/* <TouchableOpacity style={styles.button} onPress={getAudioFromStorage}>
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
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      {/* <Modal visible={isLoading} transparent statusBarTranslucent>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Modal> */}
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
  email: {
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
    backgroundColor: COLORS.lightGreen,
    borderRadius: 30,
  },
  buttonTitle: {
    ...globalStyles.fontBold16,
  },
  buttonDesc: {
    ...globalStyles.fontSemiBold14,
    color: COLORS.primary,
  },
  loadingView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: COLORS.seeThrough,
    alignItems: "center",
    justifyContent: "center",
  },
});
