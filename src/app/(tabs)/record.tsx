import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import RecordItem from "@comp/tabs/RecordItem";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@comp/auth/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AudioRecorder from "@comp/tabs/AudioRecorder";
import { DatabaseContext } from "@context/database";
import { RecordingContext } from "@context/recordingContext";
import { globalStyles } from "global/styles";
import {
  MenuProps,
  PositionProps,
  RecordCardProps,
  RecordDataItem,
} from "types";
import OptionsMenu from "@/components/tabs/OptionsMenu";
import { shareAsync } from "expo-sharing";

const Record = () => {
  const { db } = useContext(DatabaseContext);

  const { recordings, setRecordings, showRecorder, deleteAudio, renameAudio } =
    useContext(RecordingContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [menuPosition, setMenuPosition] = useState<PositionProps | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<RecordCardProps>();

  const [title, setTitle] = useState<string>("");

  const textInputRef = useRef<TextInput>(null);

  const handleMenuPosition = (data: PositionProps) => {
    setMenuPosition(data);
  };

  const handleMenuVisibility = (value) => {
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
        { text: "Delete", onPress: () => deleteAudio(selectedRecord.id) },
      ],
      { userInterfaceStyle: "dark" }
    );
    hideMenu();
  };

  const handleRename = () => {
    setIsModalVisible(false);
    renameAudio(selectedRecord.id, title);
  };

  const handleSelectedRecord = (recordData: RecordDataItem) => {
    setSelectedRecord(recordData);
  };

  const showRenameModal = () => {
    hideMenu();
    setTitle(selectedRecord.title);
    setIsModalVisible(true);
  };

  const shareAudio = async () => {
    try {
      await shareAsync(selectedRecord.uri);
    } catch (e) {
      console.log("Error occured while sharing", e);
    }
  };

  const menuData: MenuProps[] = [
    { title: "Rename", handleMenuPress: showRenameModal },
    { title: "Share", handleMenuPress: shareAudio },
    { title: "Delete", handleMenuPress: handleDelete },
  ];

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS recordings (id TEXT PRIMARY KEY, title TEXT, createdAt DATETIME, duration INTEGER, uri TEXT)",
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
        "SELECT * FROM recordings",
        null,
        (_, resultSet) => {
          setRecordings(resultSet.rows._array);
        },
        (_, error) => {
          console.warn(error);
          return null;
        }
      );
    });

    setIsLoading(false);
  }, [recordings]);

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "DROP TABLE IF EXISTS recordings",
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

    // Select all text when the component mounts
    textInputRef.current?.setNativeProps({ start: 0, end: -1 });
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && recordings === null ? (
        <View style={styles.altContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : recordings?.length === 0 ? (
        <View style={styles.altContent}>
          <Text style={styles.noRecordingText}>
            There is no recording yet{"\n"}Press the "Start Recording" Button
          </Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          contentContainerStyle={{
            paddingTop: 15,
            gap: 15,
            paddingBottom: 150,
          }}
          renderItem={({ item }) => (
            <RecordItem
              recordData={item}
              setMenuPosition={handleMenuPosition}
              setIsVisible={handleMenuVisibility}
              setSelectedRecord={handleSelectedRecord}
            />
          )}
        />
      )}
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
        <CustomButton title="Start Recording" onPress={showRecorder}>
          <Ionicons name="mic-outline" size={24} color={COLORS.white} />
        </CustomButton>
      </View>
      <AudioRecorder />
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
      {/* Rename Confirm */}
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

export default Record;

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
    padding: 8,
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
    padding: 8,
  },
  okText: {
    ...globalStyles.fontMedium16,
    color: COLORS.white,
  },
});
