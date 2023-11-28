import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import CustomInput from "@comp/auth/CustomInput";
import { useForm } from "react-hook-form";
import { globalStyles } from "global/styles";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@comp/auth/CustomButton";
import { router } from "expo-router";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignUp = () => {
  const { handleSubmit, control, reset, watch } = useForm();
  const pwd = watch("password");

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={require("@img/bgImage.jpg")}
            style={styles.bgImage}
          >
            <Text style={styles.header}>Sign Up!</Text>
          </ImageBackground>
          <View style={styles.form}>
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
            <CustomInput
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password is too short",
                },
              }}
            />
            <CustomInput
              name="confirmPassword"
              control={control}
              rules={{
                required: "Password is required",
                validate: (value: string) =>
                  value === pwd || "Password does not match",
              }}
            />
            <View style={{ alignItems: "center" }}>
              <CustomButton
                title="Sign Up"
                onPress={handleSubmit(() => console.log("Pressed"))}
              />
            </View>
            <View style={styles.signUpView}>
              <Text style={styles.noAccountText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.signUp}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(30),
    justifyContent: "flex-end",
    paddingLeft: wp(SIZES.large),
  },
  header: {
    ...globalStyles.fontBlack36,
    color: COLORS.primary,
    marginBottom: 30,
  },
  form: {
    paddingHorizontal: wp(SIZES.large),
    gap: 15,
  },
  forgotPwdView: {
    alignSelf: "flex-end",
  },
  signUpView: {
    flexDirection: "row",
    gap: 5,
    alignSelf: "center",
  },
  noAccountText: {
    ...globalStyles.fontRegular16,
    color: COLORS.black,
  },
  signUp: {
    ...globalStyles.fontSemiBold16,
    color: COLORS.primary,
  },
});
