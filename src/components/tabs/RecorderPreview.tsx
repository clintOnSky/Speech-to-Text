import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { COLORS, SIZES } from "@const/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import { getDateTime, getDuration } from "@utils/recordingFunc";
import { RecordingContext } from "@context/recordingContext";
import { RecordDataItem } from "types";
import { transcribeAudio } from "@utils/transcribeFunc";
import { TranscriptContext } from "@context/transcriptContext";
import { router } from "expo-router";

interface RecordPreviewProps {
  recordPreview: RecordDataItem;
}

const RecorderPreview = ({ recordPreview }: RecordPreviewProps) => {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Context variables
  const { setRecordPreview, isTransModalVisible, hideTransModal } =
    useContext(RecordingContext);
  const { handleTranscribe } = useContext(TranscriptContext);

  const duration = getDuration(recordPreview.duration);

  const handleCancel = () => {
    setRecordPreview(null);
    hideTransModal();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await handleTranscribe();
    setIsLoading(false);
    setRecordPreview(null);
    hideTransModal();
  };
  return (
    <Modal
      transparent
      visible={isTransModalVisible}
      onRequestClose={hideTransModal}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.background}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <View style={styles.container}>
            <Text style={styles.header}>Transcribe</Text>
            <View style={styles.audioCard}>
              <View style={styles.recordIcon}>
                <Ionicons
                  name="recording-sharp"
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {recordPreview.title}
              </Text>

              <Text style={[styles.duration, { marginRight: 10 }]}>
                {duration}
              </Text>
            </View>
            <Text style={styles.confirmationText}>
              Do you want to transcribe audio?
            </Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton} onPress={handleConfirm}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default RecorderPreview;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0,0,0,0.2)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: COLORS.white,
    padding: wp(SIZES.medium),
    borderRadius: 8,
    width: wp(90),
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    // alignSelf: "flex-start",
    ...globalStyles.fontBold20,
    paddingBottom: 16,
  },
  audioCard: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    width: "100%",
    backgroundColor: COLORS.lightBrown,
    marginBottom: 15,
  },
  recordIcon: {
    padding: 15,
    backgroundColor: COLORS.lightBrown,
    borderRadius: 8,
  },
  title: {
    ...globalStyles.fontMedium16,
    flex: 1,
  },
  timeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  duration: {
    ...globalStyles.fontRegular14,
    color: COLORS.labelGray,
    alignSelf: "flex-end",
  },
  confirmationText: {
    ...globalStyles.fontMedium16,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
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
    paddingVertical: 10,
  },
  okText: {
    ...globalStyles.fontMedium16,
    color: COLORS.white,
  },
});
