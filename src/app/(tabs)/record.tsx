import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import React, { createContext, useCallback, useState } from "react";
import RecordItem from "@comp/tabs/RecordItem";
import { RecordCardProps } from "types";
import { recordData } from "@assets/dummyData";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@comp/auth/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AudioRecorder from "@comp/tabs/AudioRecorder";

type RecordDataItem = RecordCardProps;

export const RecordContext = createContext(null);

const Record = () => {
  const [data, setData] = useState<RecordDataItem[] | undefined[]>(recordData);

  const [isRecorderVisible, setIsRecorderVisible] = useState(false);

  const showRecorder = () => {
    setIsRecorderVisible(true);
  };
  const hideRecorder = () => {
    setIsRecorderVisible(false);
  };

  const renderItem: ListRenderItem<RecordDataItem> = useCallback(
    ({ item }) => <RecordItem recordData={item} />,
    [data]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{
          paddingTop: 15,
          gap: 15,
          paddingBottom: 150,
        }}
        renderItem={renderItem}
      />

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
      <AudioRecorder
        isVisible={isRecorderVisible}
        hideRecorder={hideRecorder}
      />
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});
