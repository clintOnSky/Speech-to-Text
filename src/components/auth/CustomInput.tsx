import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { COLORS } from "@const/index";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "global/styles";
import { TextInput } from "react-native-paper";

const CustomInput = ({ name, control, rules = {}, label = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View style={styles.inputView}>
              <View style={[styles.icon, { left: 0, marginLeft: 11 }]}>
                <Ionicons
                  name={
                    name === "email"
                      ? "mail-outline"
                      : name === "password" || "confirmPassword"
                      ? "lock-closed-outline"
                      : "person-outline"
                  }
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              {name === "email" ? (
                <TextInput
                  mode="outlined"
                  label="Email"
                  style={styles.input}
                  outlineColor={error ? COLORS.red : COLORS.gray}
                  activeOutlineColor={error ? COLORS.red : COLORS.primary}
                  selectionColor={COLORS.primary}
                  outlineStyle={{ borderRadius: 10 }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onBlur={() => {
                    setIsFocused(false);
                    onBlur();
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              ) : name === "password" || "confirmPassword" ? (
                <>
                  <TextInput
                    mode="outlined"
                    label={
                      name === "password" ? "Password" : "Confirm password"
                    }
                    style={styles.input}
                    outlineColor={error ? COLORS.red : COLORS.gray}
                    activeOutlineColor={error ? COLORS.red : COLORS.primary}
                    selectionColor={COLORS.primary}
                    outlineStyle={{ borderRadius: 10 }}
                    secureTextEntry={!isVisible}
                    autoCapitalize="none"
                    keyboardType={!isVisible ? "default" : "visible-password"}
                    onBlur={() => {
                      setIsFocused(false);
                      onBlur();
                    }}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onChangeText={onChange}
                    value={value}
                  />
                  <View style={[styles.icon, { right: 0, marginRight: 11 }]}>
                    <TouchableOpacity onPress={toggleVisibility}>
                      <Ionicons
                        name={
                          isVisible ? "md-eye-off-outline" : "md-eye-outline"
                        }
                        size={20}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TextInput
                  mode="outlined"
                  label={label}
                  style={styles.input}
                  outlineColor={error ? COLORS.red : COLORS.gray}
                  activeOutlineColor={error ? COLORS.red : COLORS.primary}
                  selectionColor={COLORS.primary}
                  outlineStyle={{ borderRadius: 10 }}
                  onBlur={() => {
                    setIsFocused(false);
                    onBlur();
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            </View>

            <View style={{ marginTop: 3 }}>
              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    ...globalStyles.fontRegular16,
    backgroundColor: COLORS.light,
    flex: 1,
    paddingHorizontal: 30,
  },
  icon: {
    position: "absolute",
    zIndex: 1,
    top: 6,
    bottom: 0,
    justifyContent: "center",
  },
  error: {
    ...globalStyles.fontRegular14,
    color: COLORS.red,
  },
});
