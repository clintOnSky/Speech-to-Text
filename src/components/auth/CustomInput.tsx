import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { COLORS } from "@const/index";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "global/styles";

const CustomInput = ({ name, control, rules = {}, placeholder = "" }) => {
  return (
    <View>
      <Controller
        name={name}
        control={control}
        rules={{}}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View style={styles.inputView}>
              <Ionicons
                name={
                  name === "email"
                    ? "mail-outline"
                    : name === "password"
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
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              ) : name === "password" ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor={COLORS.gray}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity>
                    <Ionicons
                      name="eye-outline"
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
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            </View>
            <View>{error && <Text>{error.message}</Text>}</View>
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
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    ...globalStyles.fontBold16,
  },
  error: {},
});
