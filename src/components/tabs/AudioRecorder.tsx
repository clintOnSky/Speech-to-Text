import {
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useContext } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RecordingContext } from "@context/recordingContext";
import { getDuration } from "@utils/recordingFunc";
import { getInfoAsync } from "expo-file-system";

const AudioRecorder = () => {
  const {
    timer,
    hideRecorder,
    isRecorderVisible,
    startRecording,
    stopRecording,
    resumeRecording,
    pauseRecording,
    recording,
    isRecording,
    clearStates,
  } = useContext(RecordingContext);

  useEffect(() => {
    clearStates();
  }, [isRecorderVisible]);

  useEffect(() => {
    const checkRecordingSize = async () => {
      let recordingSize: number;
      try {
        if (recording) {
          const fileInfo = await getInfoAsync(recording?.getURI());
          if (fileInfo.exists) {
            recordingSize = fileInfo.size;
            console.log(
              "🚀 ~ file: AudioRecorder.tsx:37 ~ checkRecordingSize ~ recordingSize:",
              recordingSize
            );
          }

          if (recordingSize >= 24999000) {
            stopRecording();
            Alert.alert(
              "File size limit reached",
              "The audio file has reached the 25MB size limit"
            );
          }
        }
      } catch (error) {
        console.error("Error checking recording size", error);
      }
    };
    checkRecordingSize();
  }, [timer]);

  return (
    <Modal
      visible={isRecorderVisible}
      onRequestClose={() => {
        hideRecorder();
      }}
      animationType="slide"
    >
      {isRecorderVisible && (
        <View style={styles.container}>
          <Text style={styles.title}>Record</Text>
          <View style={styles.timerView}>
            <Text style={styles.warningText}>
              Please do not turn off your display while recording
            </Text>
            <Text style={styles.timer}>{getDuration(timer)}</Text>
          </View>
          <View style={styles.buttonView}>
            <>
              <TouchableOpacity
                onPress={
                  isRecording && !recording
                    ? startRecording
                    : isRecording && recording
                    ? pauseRecording
                    : resumeRecording
                }
              >
                <MaterialCommunityIcons
                  name={
                    !recording || isRecording === false
                      ? "record-circle-outline"
                      : "pause-circle-outline"
                  }
                  size={wp(25)}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              {recording && (
                <TouchableOpacity onPress={stopRecording}>
                  <MaterialCommunityIcons
                    name="stop-circle-outline"
                    size={wp(25)}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              )}
            </>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  title: {
    marginLeft: wp(SIZES.medium2),
    marginTop: wp(SIZES.medium2),
    ...globalStyles.fontBold20,
  },
  timerView: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  warningText: {
    ...globalStyles.fontSemiBold16,
    width: "90%",
    textAlign: "center",
  },
  timer: {
    ...globalStyles.fontSemiBold36,
  },
  buttonView: {
    flexDirection: "row",
    flex: 0.4,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 15,
  },
});
