import { COLORS, FONTS, SIZES } from "@const/index";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const globalStyles = StyleSheet.create({
  fontRegular12: {
    fontFamily: FONTS.regular,
    fontSize: wp(SIZES.extraSmall),
    color: COLORS.black,
  },
  fontRegular14: {
    fontFamily: FONTS.regular,
    fontSize: wp(SIZES.small),
    color: COLORS.black,
  },
  fontRegular16: {
    fontFamily: FONTS.regular,
    fontSize: wp(SIZES.medium),
    color: COLORS.black,
  },
  fontRegular20: {
    fontFamily: FONTS.regular,
    fontSize: wp(SIZES.medium2),
    color: COLORS.black,
  },
  fontMedium12: {
    fontFamily: FONTS.medium,
    fontSize: wp(SIZES.extraSmall),
    color: COLORS.black,
  },
  fontMedium16: {
    fontFamily: FONTS.medium,
    fontSize: wp(SIZES.medium),
    color: COLORS.black,
  },
  fontMedium20: {
    fontFamily: FONTS.medium,
    fontSize: wp(SIZES.medium2),
    color: COLORS.black,
  },
  fontSemiBold14: {
    fontFamily: FONTS.semiBold,
    fontSize: wp(SIZES.small),
    color: COLORS.black,
  },
  fontSemiBold16: {
    fontFamily: FONTS.semiBold,
    fontSize: wp(SIZES.medium),
    color: COLORS.black,
  },
  fontSemiBold20: {
    fontFamily: FONTS.semiBold,
    fontSize: wp(SIZES.medium2),
    color: COLORS.black,
  },
  fontSemiBold36: {
    fontFamily: FONTS.semiBold,
    fontSize: wp(SIZES.extraLarge),
    color: COLORS.black,
  },
  fontBold14: {
    fontFamily: FONTS.bold,
    fontSize: wp(SIZES.small),
    color: COLORS.black,
  },
  fontBold16: {
    fontFamily: FONTS.bold,
    fontSize: wp(SIZES.medium),
    color: COLORS.black,
  },

  fontBold20: {
    fontFamily: FONTS.bold,
    fontSize: wp(SIZES.medium2),
    color: COLORS.black,
  },
  fontBlack24: {
    fontFamily: FONTS.black,
    fontSize: wp(SIZES.large),
    color: COLORS.black,
  },
  fontBlack36: {
    fontFamily: FONTS.black,
    fontSize: wp(SIZES.extraLarge),
    color: COLORS.black,
  },
});
