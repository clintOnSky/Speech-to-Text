import { StyleSheet } from "react-native";
import React, { useState, createContext, useContext, memo } from "react";
import { DatabaseContext } from "./database";
import { PlaybackContext } from "./playbackContext";
import { PermissionResponse, Recording } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { getCurrentISOString } from "@utils/index";
import * as FileSystem from "expo-file-system";
import { RecordDataItem, RecordingContextProps } from "types";
import uuid from "react-native-uuid";
import { getAudioDuration } from "@utils/playbackFunc";

export const RecordingContext = createContext<RecordingContextProps>(null);

const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { db, recordingTable } = useContext(DatabaseContext);

  // Stores actual recorded audio
  const [recording, setRecording] = useState<Recording | undefined>();
  const [recordings, setRecordings] = useState<RecordDataItem[]>(null);
  const [isRecording, setIsRecording] = useState(true);

  // The playback time of recorded audio
  const [timer, setTimer] = useState<number>(0);

  // State of audio recorder
  const [isRecorderVisible, setIsRecorderVisible] = useState(false);

  // State of transcribe modal
  const [isTransModalVisible, setIsTransModalVisible] = useState(false);

  // State of stored audio preview
  const [recordPreview, setRecordPreview] = useState<RecordDataItem>(null);

  const { setSound } = useContext(PlaybackContext);

  const showRecorder = () => {
    setIsRecorderVisible(true);
  };
  const hideRecorder = () => {
    setIsRecorderVisible(false);
  };

  const showTransModal = () => {
    setIsTransModalVisible(true);
  };

  const hideTransModal = () => {
    setRecordPreview(null);
    setIsTransModalVisible(false);
  };

  async function clearStates() {
    console.log("Unloading recording");
    setSound(undefined);
    setRecording(undefined);
    setIsRecording(true);
    setTimer(0);
    setRecording(undefined);
    if (recording) {
      console.log("Stopping recording..");

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
  }

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

        const { recording: currentRecording } =
          await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY,
            (status) => {
              setTimer(status.durationMillis);
            }
          );
        setRecording(currentRecording);
        setIsRecording(true);
      } else {
        alert("Microphone permission access was denied");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const { sound } = await recording.createNewLoadedSoundAsync();

    setSound(sound);

    const uri = recording.getURI();

    await saveAudio(uri);
  }

  async function pauseRecording() {
    console.log("Pausing recording..");
    const status = await recording.pauseAsync();

    setIsRecording(status.isRecording);
  }

  async function resumeRecording() {
    console.log("Resuming recording..");
    const record = await recording.startAsync();
    setIsRecording(record.isRecording);
  }

  const saveAudio = async (uri: string) => {
    const fileName = "AUD" + getCurrentISOString().replace(/[-T:Z.]/g, "");
    const fileExtension = uri.split(".").pop();

    try {
      const internalDir = FileSystem.documentDirectory + "audio/";

      const fileDirInfo = await FileSystem.getInfoAsync(internalDir);

      if (!fileDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(internalDir, {
          intermediates: true,
        });
      }

      // Define the destination URI in internal storage
      const internalFileUri = `${internalDir}${fileName}.${fileExtension}`;

      await FileSystem.copyAsync({
        from: uri,
        to: internalFileUri,
      });

      console.log("Audio file saved to internal storage successfully");

      addRecording(fileName, internalFileUri);
      hideRecorder();
      showTransModal();
    } catch (e) {
      console.log("Error occured while saving file to internal storage", e);
    }
  };

  const addRecording = async (title: string, uri: string) => {
    const createdAt = getCurrentISOString();
    const duration = await getAudioDuration(uri);
    const id = uuid.v4().toString();

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${recordingTable} (id, title, duration, createdAt, uri) VALUES (?, ?, ?, ?, ?)`,
        [id, title, duration, createdAt, uri],
        (_, resultSet) => {
          console.log("Added new recording successfully");
          const recordInfo = {
            id,
            title,
            createdAt,
            duration,
            uri,
          };
          setRecordings((prevRecs) => [recordInfo, ...prevRecs]);
          setRecordPreview(recordInfo);
        },
        (_, error) => {
          console.error("Error while inserting", error);
          return true;
        }
      );
    });
  };

  const deleteAudio = (id: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${recordingTable} WHERE id = ?`,
        [id],
        (_, resultSet) => {
          console.log("Successfully deleted recording", id);
          if (resultSet.rowsAffected > 0) {
            setRecordings((prevRecs) =>
              [...prevRecs].filter((recording) => recording.id !== id)
            );
          }
        },
        (_, error) => {
          console.log("Error while deleting", error);
          return true;
        }
      );
    });
  };

  const renameAudio = (id: string, newTitle: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${recordingTable} SET title = ? WHERE id = ?`,
        [newTitle, id],
        (_, resultSet) => {
          console.log("Successfully deleted recording", id);
          if (resultSet.rowsAffected > 0) {
            let existingArr = [...recordings];
            const index = existingArr.findIndex(
              (recording) => recording.id === id
            );
            existingArr[index].title = newTitle;
            setRecordings(existingArr);
          }
        }
      );
    });
  };

  return (
    <RecordingContext.Provider
      value={{
        recording,
        setRecording,
        isRecording,
        setIsRecording,
        timer,
        setTimer,
        recordings,
        setRecordings,
        isRecorderVisible,
        setIsRecorderVisible,
        recordPreview,
        setRecordPreview,
        isTransModalVisible,
        showTransModal,
        hideTransModal,
        showRecorder,
        hideRecorder,
        clearStates,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        deleteAudio,
        renameAudio,
        saveAudio,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;
