import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS, SIZES } from "@const/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { DatabaseContext } from "@context/database";
import { TranscriptContext } from "@context/transcriptContext";
import { globalStyles } from "global/styles";

const Document = () => {
  const { id } = useLocalSearchParams();

  const { db, transcriptTable } = useContext(DatabaseContext);
  const { updateDocContent, transcripts } = useContext(TranscriptContext);

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState("");

  const textInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  useEffect(() => {
    db?.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${transcriptTable} WHERE id = ?`,
        [id.toString()],
        (_, resultSet) => {
          console.log(resultSet.rows._array[0]);
          setTitle(resultSet.rows._array[0].title);
          setContent(resultSet.rows._array[0].content);
        },
        (_, resultSet) => {
          console.log("Error occured when getting transcript", resultSet);
          return true;
        }
      );
    });
  }, [id.toString(), transcripts]);

  useEffect(() => {
    console.log("Rendering headers");
    navigation.setOptions({
      title: title,
      headerTitle: () => (
        <Text
          style={{
            ...globalStyles.fontBold20,
            width: wp(50),
            textAlign: "center",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      ),
      headerStyle: {
        backgroundColor: isEditable ? COLORS.lightBrown : COLORS.light,
      },
      headerShadowVisible: false,
      headerTitleStyle: {
        ...globalStyles.fontBold20,
      },
      headerRight: () =>
        !isEditable ? (
          <TouchableOpacity
            onPress={() => {
              setIsEditable(true);
            }}
          >
            <MaterialIcons name="edit" size={24} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsEditable(false);
              updateDocContent(id.toString(), content);
            }}
            style={styles.saveView}
          >
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        ),
    });
    // Focus the input and set the selection to the end when the component mounts
    focusOnTextInput();
  }, [content, isEditable]);

  const focusOnTextInput = () => {
    textInputRef.current?.focus();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, backgroundColor: "blue" }}
      onPress={() => {
        focusOnTextInput();
        console.log("called");
      }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isEditable ? COLORS.lightBrown : COLORS.light },
        ]}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isEditable ? (
            <TextInput
              value={content}
              style={{
                width: "100%",
                ...globalStyles.fontMedium16,
                paddingHorizontal: 20,
                lineHeight: 20,
              }}
              onChangeText={setContent}
              multiline
              ref={textInputRef}
            />
          ) : (
            <Text
              style={{
                lineHeight: wp(SIZES.medium2),
                paddingHorizontal: 20,
                ...globalStyles.fontSemiBold16,
              }}
            >
              {content}
            </Text>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingTop: 10,
  },
  content: {
    minHeight: hp(80),
  },
  saveView: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
  },
  saveButton: {
    ...globalStyles.fontBold16,
  },
});
