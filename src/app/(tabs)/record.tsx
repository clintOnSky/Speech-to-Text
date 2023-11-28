import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import React, { useCallback } from "react";
import RecordItem from "@/components/tabs/RecordItem";
import { RecordCardProps } from "types";
import { recordData } from "@assets/dummyData";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@/components/auth/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type RecordDataItem = RecordCardProps;

const Record = () => {
  const renderItem: ListRenderItem<RecordDataItem> = useCallback(
    ({ item }) => <RecordItem recordData={item} />,
    [recordData]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recordData}
        contentContainerStyle={{
          paddingTop: 15,
          gap: 15,
          paddingBottom: 150,
        }}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <View
            style={{
              paddingHorizontal: wp(SIZES.medium),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomButton title="Start Recording" onPress={() => {}}>
              <Ionicons name="mic-outline" size={24} color={COLORS.white} />
            </CustomButton>
          </View>
        )}
        ListFooterComponentStyle={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
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
