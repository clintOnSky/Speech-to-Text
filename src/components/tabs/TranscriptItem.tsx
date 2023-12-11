import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, FC, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@const/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import {
  MenuProps,
  PositionProps,
  RecordCardProps,
  TranscriptDataItem,
} from "types";
import OptionsMenu from "./OptionsMenu";
import { router } from "expo-router";
import { getDateTime } from "@utils/recordingFunc";

interface TranscriptItemProps {
  transcript: TranscriptDataItem;
  setMenuPosition: (data: PositionProps | null) => void;
  setIsVisible: (value: boolean) => void;
  setSelectedDoc: (data: TranscriptDataItem) => void;
}

const TranscriptItem: FC<TranscriptItemProps> = ({
  transcript,
  setMenuPosition,
  setIsVisible,
  setSelectedDoc,
}) => {
  // const { onDelete } = useContext(RecordContext);
  const { date, time } = getDateTime(transcript.createdAt);

  const touchableRef = useRef<TouchableOpacity>(null);

  const handleDelete = () => {
    hideMenu();
    // onDelete(transcript);
  };

  function hideMenu() {
    setIsVisible(false);
  }

  const menuData: MenuProps[] = [
    { title: "Rename", handleMenuPress: hideMenu },
    { title: "Share", handleMenuPress: hideMenu },
    { title: "Delete", handleMenuPress: handleDelete },
  ];

  const showMenu = useCallback(() => {
    setSelectedDoc(transcript);
    touchableRef?.current?.measureInWindow((x, y, width, height) => {
      if (y + height > hp(70)) {
        setMenuPosition({ top: hp(70), left: x - 85 });
      } else {
        setMenuPosition({ top: y + height, left: x - 85 });
      }
      setIsVisible(true);
    });
  }, [touchableRef]);

  return (
    <>
      {/* Transcription Card */}
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push(`/${transcript.id}`)}
      >
        <View style={styles.transcriptIcon}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={{ flex: 1, gap: 5, justifyContent: "center" }}>
          <Text style={styles.title} numberOfLines={1}>
            {transcript.title}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {date} <Text>{time}</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={showMenu}
          style={{ paddingVertical: 5 }}
          ref={touchableRef}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
};

export default TranscriptItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 10,
    marginHorizontal: wp(SIZES.medium),
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 1,
  },
  transcriptIcon: {
    padding: 15,
    backgroundColor: COLORS.lightBrown,
    borderRadius: 8,
  },
  title: {
    ...globalStyles.fontMedium16,
  },
  date: {
    ...globalStyles.fontRegular14,
    color: COLORS.labelGray,
  },
  modal: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionMenu: {
    position: "absolute",
    backgroundColor: COLORS.white,
    elevation: 10,
    borderRadius: 8,
  },
});
