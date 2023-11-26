import {
  Text,
  TouchableOpacity,
  DimensionValue,
  StyleSheet,
} from "react-native";
import React from "react";
import { COLORS } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SIZES } from "@const/index";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
};

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    paddingVertical: wp(SIZES.medium),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  text: {
    ...globalStyles.fontSemiBold16,
    color: COLORS.white,
  },
});
