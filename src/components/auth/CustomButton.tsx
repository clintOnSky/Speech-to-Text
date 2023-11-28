import {
  Text,
  TouchableOpacity,
  DimensionValue,
  StyleSheet,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { COLORS } from "@const/index";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SIZES } from "@const/index";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  children?: ReactNode;
};

const CustomButton = ({ title, onPress, children }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {children}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 15,
    width: wp(80),
    paddingVertical: wp(SIZES.medium),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    elevation: 3,
  },
  text: {
    ...globalStyles.fontSemiBold16,
    color: COLORS.white,
  },
});
