import {
  StyleSheet,
  FlatList,
  View,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import TranscriptItem from "@/components/tabs/TranscriptItem";
import { recordData } from "@assets/dummyData";
import { COLORS } from "@const/index";
import { DatabaseContext } from "@context/database";
import { TranscriptContext } from "@context/transcriptContext";
import {
  MenuProps,
  PositionProps,
  RecordCardProps,
  TranscriptDataItem,
} from "types";
import { shareAsync } from "expo-sharing";
import { shareFile } from "@utils/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import OptionsMenu from "@/components/tabs/OptionsMenu";
import { ActivityIndicator } from "react-native";
import { AuthUserContext } from "@context/authContext";

const Transcript = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { db, transcriptTable } = useContext(DatabaseContext);

  const { transcripts, setTranscripts, deleteTranscript, renameTranscript } =
    useContext(TranscriptContext);

  const { currentUser } = useContext(AuthUserContext);

  const [selectedTranscript, setSelectedTranscript] =
    useState<TranscriptDataItem>();

  const [menuPosition, setMenuPosition] = useState<PositionProps | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [title, setTitle] = useState<string>("");

  const textInputRef = useRef<TextInput>(null);

  const handleMenuPosition = (data: PositionProps) => {
    setMenuPosition(data);
  };

  const handleMenuVisibility = (value: boolean) => {
    setIsMenuVisible(value);
  };

  const hideMenu = () => {
    setIsMenuVisible(false);
  };

  const hideRenameModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete",
      "This audio will be deleted",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: () => deleteTranscript(selectedTranscript.id),
        },
      ],
      { userInterfaceStyle: "dark" }
    );
    hideMenu();
  };

  const handleRename = () => {
    setIsModalVisible(false);
    renameTranscript(selectedTranscript.id, title);
    setSelectedTranscript(null);
  };

  const handleSelectedDoc = (recordData: TranscriptDataItem) => {
    setSelectedTranscript(recordData);
  };

  const showRenameModal = () => {
    hideMenu();
    setTitle(selectedTranscript.title);
    setIsModalVisible(true);
  };

  // To be added
  // const shareAudio = async () => {
  //   shareFile(selectedTranscript.);
  // };

  const menuData: MenuProps[] = [
    { title: "Rename", handleMenuPress: showRenameModal },
    { title: "Delete", handleMenuPress: handleDelete },
  ];

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "DROP TABLE IF EXISTS transcripts",
  //       [],
  //       (_, result) => {
  //         console.log("Table deleted successfully");
  //       },
  //       (_, error) => {
  //         console.error("Error deleting table:", error);
  //         return true;
  //       }
  //     );
  //   });
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    // Focus the input and set the selection to the end when the component mounts
    textInputRef.current?.focus();
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${transcriptTable} (id TEXT PRIMARY KEY, title TEXT, createdAt DATETIME, content TEXT, summary TEXT, audioId TEXT)`,
        null,
        (_, resultSet) => {},
        (_, error) => {
          console.log(error);
          return true;
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${transcriptTable} ORDER BY createdAt DESC`,
        null,
        (_, resultSet) => {
          setTranscripts(resultSet.rows._array);
        },
        (_, error) => {
          console.warn(error);
          return null;
        }
      );
    });
    setIsLoading(false);
  }, [selectedTranscript]);

  return (
    <View style={styles.container}>
      {isLoading && transcripts === null ? (
        <View style={styles.altContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : transcripts?.length === 0 ? (
        <View style={styles.altContent}>
          <Text style={styles.noRecordingText}>
            There is no transcripts yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={transcripts}
          contentContainerStyle={{
            paddingTop: 15,
            gap: 15,
            paddingBottom: 150,
          }}
          renderItem={({ item }) => (
            <TranscriptItem
              transcript={item}
              setMenuPosition={handleMenuPosition}
              setIsVisible={handleMenuVisibility}
              setSelectedDoc={handleSelectedDoc}
            />
          )}
        />
      )}
      {/* Options Menu */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={hideMenu}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPressIn={hideMenu}>
          <View style={styles.modal}>
            <View style={[styles.optionsMenu, menuPosition && menuPosition]}>
              <OptionsMenu data={menuData} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideRenameModal}
      >
        <TouchableWithoutFeedback onPressIn={() => Keyboard.dismiss()}>
          <View style={[styles.modal, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
            <View style={styles.confirmView}>
              <Text style={styles.rename}>Rename</Text>
              <View style={styles.textInputView}>
                <TextInput
                  ref={textInputRef}
                  value={title}
                  onChangeText={setTitle}
                  cursorColor={COLORS.primary}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={hideRenameModal}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={handleRename}
                >
                  <Text style={styles.okText}>Rename</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Transcript;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  altContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordingText: {
    textAlign: "center",
    ...globalStyles.fontBold20,
  },
  modal: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    backgroundColor: COLORS.white,
    elevation: 10,
    borderRadius: 8,
  },
  confirmView: {
    width: wp(80),
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    alignItems: "center",
  },
  rename: {
    ...globalStyles.fontBold20,
    marginBottom: 15,
  },
  textInputView: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    width: "90%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 30,
  },
  textInput: {
    ...globalStyles.fontRegular16,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    // width: "50%",
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelText: {
    ...globalStyles.fontMedium16,
    color: COLORS.primary,
  },
  okButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
  },
  okText: {
    ...globalStyles.fontMedium16,
    color: COLORS.white,
  },
});
