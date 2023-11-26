import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

const AudioCard = ({ index, recording, uploadAudio }) => {
  const playSound = () => {
    recording.sound.playAsync();
    console.log(
      "🚀 ~ file: AudioCard.tsx:13 ~ getSoundFile ~ recording.file:",
      recording.file
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => uploadAudio(recording.file)}
    >
      <Text>
        Recording #{index + 1} | {recording.duration}{" "}
      </Text>
    </TouchableOpacity>
  );
};

export default AudioCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    marginVertical: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
