import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomInput from "@/components/auth/CustomInput";
import { useForm } from "react-hook-form";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@/components/auth/CustomButton";
import { globalStyles } from "global/styles";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ForgotPassword = () => {
  const { control, handleSubmit } = useForm();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Receive an email to reset your password</Text>
      <CustomInput
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: EMAIL_REGEX,
            message: "Email is invalid",
          },
        }}
      />
      <CustomButton title="Reset Password" onPress={handleSubmit(() => {})} />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(SIZES.large),
    justifyContent: "center",
    backgroundColor: COLORS.light,
    gap: 15,
    // alignItems: "center",
  },
  text: {
    ...globalStyles.fontRegular16,
    alignSelf: "center",
  },
});
