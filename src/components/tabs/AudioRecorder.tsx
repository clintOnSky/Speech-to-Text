import { Text, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface AudioRecorderProps {
  isVisible: boolean;
  hideRecorder: () => void;
}

const AudioRecorder = ({ isVisible, hideRecorder }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(false);
  }, [isVisible]);

  function startRecording() {
    setIsRecording(true);
    setIsPaused(false);
    setIsStopped(false);
  }

  function pauseRecording() {
    setIsPaused(true);
  }

  function stopRecording() {
    setIsRecording(false);
    setIsStopped(true);
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        setIsPaused(false);
        setIsRecording(false);
        hideRecorder();
      }}
      animationType="slide"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Record</Text>
        <View style={styles.timerView}>
          <Text style={styles.timer}>0:0:01:000</Text>
        </View>
        <View style={styles.buttonView}>
          {isRecording === isPaused ? (
            <TouchableOpacity onPress={startRecording}>
              <MaterialCommunityIcons
                name="record-circle-outline"
                size={wp(25)}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          ) : !isPaused ? (
            <TouchableOpacity onPress={pauseRecording}>
              <MaterialCommunityIcons
                name="pause-circle-outline"
                size={wp(25)}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseRecording}>
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={wp(25)}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}

          {/* Add play and pause UI for this button */}
          <TouchableOpacity
            onPress={!isStopped ? stopRecording : () => console.log("Play")}
          >
            <Ionicons
              name={!isStopped ? "stop-circle-outline" : "play-circle-outline"}
              size={wp(25)}
              color={isStopped ? COLORS.primary : COLORS.red}
            />
          </TouchableOpacity>
        </View>
      </View>
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
