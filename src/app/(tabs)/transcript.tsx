import { StyleSheet, FlatList, View } from "react-native";
import React from "react";
import TranscriptItem from "@/components/tabs/TranscriptItem";
import { recordData } from "@assets/dummyData";
import { COLORS } from "@const/index";

const Transcript = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={recordData}
        contentContainerStyle={{ paddingTop: 15, gap: 15, paddingBottom: 150 }}
        renderItem={({ item }) => <TranscriptItem recordData={item} />}
      />
    </View>
  );
};

export default Transcript;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});
