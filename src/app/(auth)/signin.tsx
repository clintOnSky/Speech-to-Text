import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomInput from "@comp/auth/CustomInput";
import { useForm } from "react-hook-form";
import { globalStyles } from "global/styles";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { COLORS, SIZES } from "@const/index";
import CustomButton from "@comp/auth/CustomButton";
import { Link, Stack } from "expo-router";
import { handleSignIn, AuthProps } from "@utils/authFunc";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignIn = () => {
  const { control, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("Called");

  const onSignInPress = async (signInInfo: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    await handleSignIn(signInInfo);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen />
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={require("@img/bgImage.jpg")}
            style={styles.bgImage}
          >
            <Text style={styles.header}>Sign In!</Text>
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
            <Link href="/forgotPassword" asChild>
              <TouchableOpacity style={styles.forgotPwdView}>
                <Text style={styles.forgotPwd}>Forgot password?</Text>
              </TouchableOpacity>
            </Link>
            <View style={{ alignItems: "center" }}>
              <CustomButton
                title="Sign In"
                onPress={handleSubmit(onSignInPress)}
              />
            </View>
            <View style={styles.signUpView}>
              <Text style={styles.noAccountText}>
                Don't have an account yet?
              </Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.signUp}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
        {isLoading && (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;

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
  forgotPwd: {
    ...globalStyles.fontSemiBold16,
    color: COLORS.primary,
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
  loadingView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: COLORS.seeThrough,
    alignItems: "center",
    justifyContent: "center",
  },
});
