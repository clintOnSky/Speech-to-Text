import { Text, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Audio } from "expo-av";
import { PermissionResponse, Recording, Sound } from "expo-av/build/Audio";
import { useFocusEffect } from "expo-router";

interface AudioRecorderProps {
  isVisible: boolean;
  hideRecorder: () => void;
}

const AudioRecorder = ({ isVisible, hideRecorder }: AudioRecorderProps) => {
  // Stores actual recorded audio
  const [recording, setRecording] = useState<Recording | undefined>();
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(true);
  const [sound, setSound] = useState<Sound | undefined>();
  const [timer, setTimer] = useState<number>(0);

  function clearStates() {
    console.log("Unloading recording");
    setSound(undefined);
    setRecording(undefined);
    setIsRecording(true);
    setIsStopped(false);
    setTimer(0);
  }

  useEffect(() => {
    clearStates();
  }, [isVisible]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording === true && recording) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
        // Stop recording if timer exceeds time limit
        if (timer === 10 * 60 * 60 - 1) {
          stopRecording();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  });

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      const permission: PermissionResponse =
        await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        console.log("Granted audio recording");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
        console.log("Recording started");
      } else {
        alert("Microphone permission access was denied");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function pauseRecording() {
    console.log("Pausing recording..");
    const record = await recording.pauseAsync();

    setIsRecording(record.isRecording);
  }

  async function playRecording() {
    console.log("Playing recording..");
    sound.playAsync();
  }

  async function resumeRecording() {
    console.log("Resuming recording..");
    const record = await recording.startAsync();
    setIsRecording(record.isRecording);
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    setIsStopped(true);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const { sound, status } = await recording.createNewLoadedSoundAsync();

    setSound(sound);

    const uri = recording.getURI();

    console.log("Recording stopped and stored at", uri);
  }

  const getDuration = () => {
    // Convert seconds to hours
    const hours = timer / 60 / 60;

    const floorHours = Math.floor(hours);
    const displayHours = hours < 10 ? `0${floorHours}` : floorHours;

    // Get minutes from the difference between floored hours and hours with decimal
    const minutes = (hours - floorHours) * 60;

    const floorMinutes = Math.floor(minutes);
    const displayMinutes = minutes < 10 ? `0${floorMinutes}` : floorMinutes;

    // Get seconds from the difference between floored minutes and minutes with decimal
    const seconds = Math.round((minutes - floorMinutes) * 60);

    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

    return floorHours
      ? `${displayHours}:${displayMinutes}:${displaySeconds}`
      : `${displayMinutes}:${displaySeconds}`;
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        hideRecorder();
      }}
      animationType="slide"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Record</Text>
        <View style={styles.timerView}>
          <Text style={styles.timer}>{getDuration()}</Text>
        </View>
        <View style={styles.buttonView}>
          {!isStopped ? (
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
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity onPress={playRecording}>
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={wp(25)}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
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
