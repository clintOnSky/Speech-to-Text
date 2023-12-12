import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useState,
  useRef,
  FC,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@const/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import { PositionProps, RecordCardProps } from "types";
import { Audio } from "expo-av";
import { pause, play, resume } from "@utils/playbackFunc";
import { PlaybackContext } from "@context/playbackContext";
import { getDateTime, getDuration } from "@utils/recordingFunc";

type RecordItemProps = {
  recordData: RecordCardProps;
  setMenuPosition: (data: PositionProps | null) => void;
  setIsVisible: (value: boolean) => void;
  setSelectedRecord: (data: RecordCardProps) => void;
};

const RecordItem: FC<RecordItemProps> = ({
  recordData,
  setMenuPosition,
  setIsVisible,
  setSelectedRecord,
}) => {
  const {
    sound,
    setSound,
    playbackStatus,
    setPlaybackStatus,
    currentURI,
    setCurrentURI,
  } = useContext(PlaybackContext);

  const { date, time } = getDateTime(recordData.createdAt);

  const touchableRef = useRef<TouchableOpacity>(null);

  const handleAudio = useCallback(async () => {
    setCurrentURI(recordData.uri);
    try {
      if (sound === null || currentURI !== recordData.uri) {
        currentURI !== recordData.uri && (await sound?.unloadAsync());
        const playbackObj = new Audio.Sound();
        const status = await play(playbackObj, recordData.uri);
        setSound(playbackObj);
        setPlaybackStatus(status);
      } else if (
        playbackStatus.isLoaded &&
        playbackStatus.isPlaying &&
        currentURI === recordData.uri
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
  }, [playbackStatus, sound]);

  const showMenu = useCallback(() => {
    setSelectedRecord(recordData);
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
      {/* Record Card */}
      <View style={styles.container}>
        <View style={styles.soundIcon}>
          <Ionicons name="recording-sharp" size={24} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1, gap: 5, justifyContent: "center" }}>
          <Text style={styles.title} numberOfLines={1}>
            {recordData.title}
          </Text>
          <View style={styles.timeView}>
            <Text style={styles.date} numberOfLines={1}>
              {date} {time}
            </Text>
            <Text style={[styles.date, { marginRight: 10 }]}>
              {getDuration(recordData.duration)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleAudio}>
          <Ionicons
            name={
              playbackStatus?.isLoaded &&
              playbackStatus?.isPlaying &&
              currentURI === recordData.uri
                ? "pause"
                : "play"
            }
            size={26}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showMenu}
          style={{ paddingVertical: 5 }}
          ref={touchableRef}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RecordItem;

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
  soundIcon: {
    padding: 15,
    backgroundColor: COLORS.lightGreen,
    borderRadius: 8,
  },
  title: {
    ...globalStyles.fontMedium16,
    marginRight: 15,
  },
  timeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    ...globalStyles.fontRegular14,
    color: COLORS.labelGray,
  },
});
