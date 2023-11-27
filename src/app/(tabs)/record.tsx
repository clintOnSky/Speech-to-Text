import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import RecordCard from "@comp/tabs/RecordCard";

const Record = () => {
  return (
    <View style={styles.container}>
      <RecordCard />
      {/* <FlatList /> */}
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
