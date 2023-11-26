import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomInput from "@comp/auth/CustomInput";
import { useForm } from "react-hook-form";
import { globalStyles } from "global/styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, SIZES } from "@const/index";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = () => {
  const { control, handleSubmit } = useForm();
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Sign In!</Text>
        <CustomInput
          name="email"
          placeholder="Enter email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Email or Phone number is invalid",
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
        <TouchableOpacity style={styles.forgotPwdView}>
          <Text style={styles.forgotPwd}>Forgot password?</Text>
        </TouchableOpacity>
        {/* <CustomButton /> */}
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(SIZES.large),
  },
  content: {
    paddingTop: 60,
  },
  header: {
    ...globalStyles.fontBlack24,
    color: COLORS.primary,
    marginBottom: 30,
  },
  forgotPwdView: {
    alignSelf: "flex-end",
  },
  forgotPwd: {
    ...globalStyles.fontSemiBold14,
    color: COLORS.primary,
  },
});
