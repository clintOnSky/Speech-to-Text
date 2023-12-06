import { StyleSheet } from "react-native";
import React, { useState, createContext, useContext } from "react";
import { DatabaseContext } from "./database";
import { PlaybackContext } from "./playbackContext";
import { PermissionResponse, Recording } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { getCurrentISOString } from "@utils/index";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { RecordDataItem, RecordingContextProps } from "types";
import uuid from "react-native-uuid";

export const RecordingContext = createContext<RecordingContextProps>(null);

const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { db } = useContext(DatabaseContext);

  // Stores actual recorded audio
  const [recording, setRecording] = useState<Recording | undefined>();
  const [isRecording, setIsRecording] = useState(true);
  const [timer, setTimer] = useState<number>(0);

  const [recordings, setRecordings] = useState<RecordDataItem[]>(null);

  const [isVisible, setIsVisible] = useState(false);

  const { sound, setSound } = useContext(PlaybackContext);

  const showRecorder = () => {
    setIsVisible(true);
  };
  const hideRecorder = () => {
    setIsVisible(false);
  };

  function clearStates() {
    console.log("Unloading recording");
    setSound(undefined);
    setRecording(undefined);
    setIsRecording(true);
    setTimer(0);
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

        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          (status) => {
            console.log("updating milliseconds");
            setTimer(status.durationMillis);
          }
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

  async function resumeRecording() {
    console.log("Resuming recording..");
    const record = await recording.startAsync();
    setIsRecording(record.isRecording);
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const { sound, status } = await recording.createNewLoadedSoundAsync();
    console.log(
      "🚀 ~ file: AudioRecorder.tsx:141 ~ stopRecording ~ status:",
      status
    );

    setSound(sound);

    const fileName = "AUD" + getCurrentISOString().replace(/[-T:Z.]/g, "");

    // setTimer(status?.isLoaded && status.durationMillis)

    const uri = recording.getURI();

    saveAudio(uri, fileName, "audio/mp4");
  }

  const saveAudio = async (uri: string, fileName: string, mimeType: string) => {
    //Requests permission to access folders on android
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permission.granted) {
      // Creates a new copy of the file at the uri provided as a base64 string
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      // Creates an empty file at selected folder directory
      FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        `${fileName}.m4a`,
        mimeType
      )
        .then(async (uri) => {
          console.log(uri);
          // Then copies the value
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: "base64",
          });
          addRecording(fileName, uri);
          hideRecorder();
        })
        .catch((e) => {
          console.warn(e);
        });
    } else {
      shareAsync(uri);
    }
  };

  const addRecording = (title: string, uri: string) => {
    const createdAt = getCurrentISOString();
    const duration = timer;
    const id = uuid.v4().toString();

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO recordings (id, title, duration, createdAt, uri) VALUES (?, ?, ?, ?, ?)",
        [id, title, duration, createdAt, uri],
        (_, resultSet) => {
          console.log("Added new recording successfully");
          setRecordings((prevRecs) => [
            {
              id,
              title,
              createdAt,
              duration,
              uri,
            },
            ...prevRecs,
          ]);
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
        "DELETE FROM recordings WHERE id = ?",
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
      tx.executeSql("UPDATE recordings SET title = ? WHERE id = ?", [
        newTitle,
        id,
      ]);
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
        isVisible,
        setIsVisible,
        showRecorder,
        hideRecorder,
        clearStates,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        deleteAudio,
        renameAudio,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;

const styles = StyleSheet.create({});
