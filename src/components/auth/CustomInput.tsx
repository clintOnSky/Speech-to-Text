import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { COLORS } from "@const/index";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "global/styles";

const CustomInput = ({ name, control, rules = {}, placeholder = "" }) => {
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
            <View
              style={[
                styles.inputView,
                isFocused && { borderColor: COLORS.primary },
              ]}
            >
              <Ionicons
                name={
                  name === "email"
                    ? "mail-outline"
                    : name === "password" || "confirmPassword"
                    ? "lock-closed-outline"
                    : "person-outline"
                }
                size={24}
                color={COLORS.primary}
              />
              {name === "email" ? (
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor={COLORS.gray}
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
                    style={styles.input}
                    placeholder={
                      name === "password" ? "Enter password" : "Repeat password"
                    }
                    placeholderTextColor={COLORS.gray}
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
                  <TouchableOpacity onPress={toggleVisibility}>
                    <Ionicons
                      name={isVisible ? "md-eye-off-outline" : "md-eye-outline"}
                      size={24}
                      color={COLORS.gray}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.gray}
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
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    ...globalStyles.fontRegular16,
  },
  error: {
    ...globalStyles.fontRegular14,
    color: COLORS.red,
  },
});
