import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  BackHandler,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS, SIZES } from "@const/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { DatabaseContext } from "@context/database";
import { TranscriptContext } from "@context/transcriptContext";
import { globalStyles } from "global/styles";
import CustomButton from "@/components/auth/CustomButton";
import SummaryOptions from "@/components/stack/SummaryOptions";
import { ActivityIndicator } from "react-native";
import { PlaybackContext } from "@context/playbackContext";
import { Audio } from "expo-av";
import { pause, play, resume } from "@utils/playbackFunc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RecordDataItem, TranscriptDataItem } from "types";

const Document = () => {
  const { id } = useLocalSearchParams();

  const { db, transcriptTable, recordingTable } = useContext(DatabaseContext);
  const { updateTranscript, transcripts } = useContext(TranscriptContext);
  const {
    sound,
    setSound,
    playbackStatus,
    setPlaybackStatus,
    currentURI,
    setCurrentURI,
  } = useContext(PlaybackContext);

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioId, setAudioId] = useState<string>("");
  const [audioUri, setAudioUri] = useState<string>("");

  const [selectedType, setSelectedType] = useState("Full Text");

  const textInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const contentType = ["Full Text", "Explanation"];

  useEffect(() => {
    db?.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${transcriptTable} WHERE id = ?`,
        [id.toString()],
        (_, resultSet) => {
          const transcript: TranscriptDataItem = resultSet.rows._array[0];
          setTitle(transcript.title);
          setContent(transcript.content);
          setSummary(transcript.summary);
          setAudioId(transcript.audioId);
          tx.executeSql(
            `SELECT * FROM ${recordingTable} WHERE id = ?`,
            [transcript.audioId],
            (_, resultSet) => {
              const record: RecordDataItem = resultSet.rows._array[0];
              setAudioUri(record.uri);
            },
            // @ts-ignore
            (_, resultSet) => {
              console.log("Error occured when getting recording", resultSet);
            }
          );
        },
        // @ts-expect-error
        (_, resultSet) => {
          console.log("Error occured when getting transcript", resultSet);
        }
      );
    });
  }, [id.toString(), transcripts, audioId, isEditable]);

  const handleOnBackPress = () => {
    Alert.alert("Warning", "Are you sure you want to discard changes?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Discard",
        onPress: () => {
          setIsEditable(false);
        },
      },
    ]);
  };

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitle: () => (
        <Text
          style={{
            ...globalStyles.fontBold20,
            width: wp(50),
            textAlign: "center",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      ),
      headerStyle: {
        backgroundColor: isEditable ? COLORS.lightBrown : COLORS.light,
      },
      headerShadowVisible: false,
      headerTitleStyle: {
        ...globalStyles.fontBold20,
      },
      headerBackVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (isEditable) {
              // Do something specific when in editable mode
              console.log("Custom back function for editable mode");
              // Alert.alert("Warning", "Do you/ want to discard changes");
              handleOnBackPress();
            } else {
              // Default behavior for non-editable mode
              navigation.goBack();
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
      ),
      headerRight: () =>
        !isEditable ? (
          <TouchableOpacity
            onPress={() => {
              setIsEditable(true);
            }}
          >
            <MaterialIcons name="edit" size={24} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              updateTranscript(id.toString(), content, summary);
              setIsEditable(false);
              console.log(selectedType);
            }}
            style={styles.saveView}
          >
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        ),
    });
    // Focus the input and set the selection to the end when the component mounts
    focusOnTextInput();
  }, [content, summary, isEditable]);

  useEffect(() => {
    const handleBackPress = () => {
      if (isEditable) {
        // Do something specific when in editable mode
        handleOnBackPress();
        return true; // Consume the back press event
      } else {
        // Default behavior for non-editable mode
        return false; // Allow the default back press behavior
      }
    };

    // Subscribe to the hardware back button event
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    // Cleanup when the component is unmounted
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [isEditable]);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const handleSummary = useCallback((summary: string) => {
    setSummary(summary);
  }, []);

  const handleSelectedContent = useCallback((type: string) => {
    setSelectedType(type);
  }, []);

  const handleEdit = useCallback((editable: boolean) => {
    setIsEditable(editable);
  }, []);

  const handleIsLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const focusOnTextInput = () => {
    textInputRef.current?.focus();
  };

  const handleAudio = useCallback(async () => {
    setCurrentURI(audioUri);
    try {
      if (sound === null || currentURI !== audioUri) {
        currentURI !== audioUri && (await sound?.unloadAsync());
        const playbackObj = new Audio.Sound();
        const status = await play(playbackObj, audioUri);
        setSound(playbackObj);
        setPlaybackStatus(status);
      } else if (
        playbackStatus.isLoaded &&
        playbackStatus.isPlaying &&
        currentURI === audioUri
      ) {
        const status = await pause(sound);
        setPlaybackStatus(status);
      } else if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
        const status = await resume(sound);
        setPlaybackStatus(status);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [playbackStatus, sound, audioUri]);

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => {
        focusOnTextInput();
      }}
      disabled={!isEditable}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: isEditable ? COLORS.lightBrown : COLORS.light },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              zIndex: 1,
              paddingVertical: 5,
              gap: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isEditable && (
              <>
                <TouchableOpacity
                  style={[
                    styles.contentTypeBtn,
                    {
                      backgroundColor:
                        selectedType === contentType[0]
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => setSelectedType(contentType[0])}
                >
                  <Text
                    style={[
                      styles.contentTypeText,
                      {
                        color:
                          selectedType === contentType[0]
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  >
                    {contentType[0]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contentTypeBtn,
                    {
                      backgroundColor:
                        selectedType === contentType[1]
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => setSelectedType(contentType[1])}
                >
                  <Text
                    style={[
                      styles.contentTypeText,
                      {
                        color:
                          selectedType === contentType[1]
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  >
                    {contentType[1]}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={[
              styles.content,
              { paddingTop: isEditable ? 10 : 50 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {isEditable ? (
              <TextInput
                value={selectedType === "Full Text" ? content : summary}
                style={{
                  ...globalStyles.fontMedium16,
                  paddingHorizontal: 20,
                  lineHeight: 25,
                  marginBottom: hp(30),
                }}
                onChangeText={(text) => {
                  if (selectedType === "Full Text") {
                    setContent(text);
                  } else {
                    setSummary(text);
                  }
                }}
                multiline
                ref={textInputRef}
              />
            ) : (
              <Text
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: hp(30),
                  lineHeight: 25,
                  ...globalStyles.fontSemiBold16,
                }}
              >
                {selectedType === "Full Text" ? content : summary}
              </Text>
            )}
          </ScrollView>
          <View
            style={{
              paddingHorizontal: wp(SIZES.medium),
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
            }}
          >
            <TouchableOpacity onPress={handleAudio} style={styles.audioPlayer}>
              <Ionicons
                name={
                  playbackStatus?.isLoaded && playbackStatus?.isPlaying
                    ? "pause"
                    : "play"
                }
                size={30}
                color={COLORS.primary}
                style={{ left: 1 }}
              />
            </TouchableOpacity>
            {!(selectedType === "Explanation") && !isEditable && (
              <CustomButton title="Get Explanation" onPress={showModal} />
            )}
          </View>
          <SummaryOptions
            content={content}
            isVisible={isVisible}
            setIsLoading={handleIsLoading}
            hideModal={hideModal}
            setIsEditable={handleEdit}
            setSelectedContent={handleSelectedContent}
            setSummary={handleSummary}
          />
        </View>
        <Modal visible={isLoading} transparent statusBarTranslucent>
          <View
            style={{
              flex: 1,
              zIndex: 4,
              backgroundColor: COLORS.seeThrough,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingTop: 10,
  },
  content: {
    minHeight: hp(80),
  },
  contentTypeBtn: {
    paddingVertical: 8,
    minWidth: wp(22),
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 1,
  },
  contentTypeText: {
    ...globalStyles.fontBold14,
    color: COLORS.primary,
    paddingHorizontal: 5,
  },
  saveView: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
  },
  saveButton: {
    ...globalStyles.fontBold16,
  },
  audioPlayer: {
    borderWidth: 4,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 20,
  },
});
