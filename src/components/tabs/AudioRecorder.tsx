import { Text, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useContext } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RecordingContext } from "@context/recordingContext";
import { getDuration } from "@utils/recordingFunc";

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
  },
  timer: {
    marginTop: 30,
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
