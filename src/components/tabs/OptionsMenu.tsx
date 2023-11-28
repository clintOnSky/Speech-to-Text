import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SIZES } from "@const/index";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MenuProps } from "types";

interface OptionsMenuProps {
  data: MenuProps[];
  hideMenu: () => void;
}
const OptionsMenu = ({ data, hideMenu }: OptionsMenuProps) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={styles.button}
          key={index.toString()}
          onPress={() => {
            item.handleMenuPress;
            hideMenu();
          }}
        >
          <Ionicons
            name={
              item.title === "Rename"
                ? "pencil-sharp"
                : item.title === "Share"
                ? "share-outline"
                : "trash-outline"
            }
            size={20}
            color={item.title === "Delete" ? COLORS.red : COLORS.gray}
          />
          <Text
            style={[
              styles.optionText,
              item.title === "Delete" && {
                color: COLORS.red,
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default OptionsMenu;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: wp(SIZES.medium),
    paddingVertical: 11,
    alignItems: "center",
  },
  optionText: {
    ...globalStyles.fontRegular14,
  },
});
