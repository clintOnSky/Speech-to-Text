import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "@const/index";

const Document = () => {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: COLORS.light },
          title: id.toString(),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <MaterialIcons name="edit" size={24} color={COLORS.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Text>Document</Text>
    </View>
  );
};

export default Document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});
