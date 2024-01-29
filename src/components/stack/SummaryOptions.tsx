import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@const/index";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import CustomButton from "../auth/CustomButton";
import { summarizeDoc } from "@utils/summaryFunc";

interface SummaryOptionsProps {
  hideModal: () => void;
  content: string;
  setSummary: (summary: string) => void;
  setIsEditable: (editable: boolean) => void;
  setSelectedContent: (type: string) => void;
  isVisible: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SummaryOptions = ({
  content,
  setIsEditable,
  setSelectedContent,
  hideModal,
  setSummary,
  isVisible,
  setIsLoading,
}: SummaryOptionsProps) => {
  const summaryTypes = [
    "Simple Summary",
    "Key Concepts",
    "Visual Summaries",
    "Bullet-point Lists",
    "Question and Answer Format",
    "Highlight Important Details",
    "Summary Paragraphs",
    "Application Examples",
  ];

  const [selectedType, setSelectedType] = useState<string>(summaryTypes[0]);

  const handleSelected = (type: string) => {
    if (type === selectedType) {
      setSelectedType("");
    } else {
      setSelectedType(type);
    }
  };

  const handleSummary = async (selectedType: string, prompt: string) => {
    setIsLoading(true);
    const summaryResult = await summarizeDoc(prompt, selectedType);
    setSummary(summaryResult);
    setSelectedContent("Summary");
    setIsLoading(false);
    setIsEditable(true);
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {
        setSelectedType(summaryTypes[0]);
        hideModal();
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedType(summaryTypes[0]);
          hideModal();
        }}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.seeThrough }}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Select the summary type</Text>
        <FlatList
          data={summaryTypes}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.summaryCard,
                {
                  backgroundColor:
                    selectedType === item ? COLORS.primary : "transparent",
                },
              ]}
              onPress={() => handleSelected(item)}
            >
              <Text
                style={[
                  styles.cardText,
                  {
                    color:
                      selectedType === item ? COLORS.white : COLORS.primary,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.summarizeBtn}>
          <CustomButton
            title={selectedType === "" ? "Get Simple Summary" : "Done"}
            onPress={() => {
              handleSummary(selectedType, content);
              setSelectedType("");
              hideModal();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SummaryOptions;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    top: hp(35),
    elevation: 5,
    backgroundColor: COLORS.white,
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    gap: 10,
    paddingTop: 20,
    paddingBottom: hp(12),
  },
  header: {
    ...globalStyles.fontBold20,
    alignSelf: "center",
    paddingBottom: 20,
  },
  summaryCard: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
  },
  cardText: {
    ...globalStyles.fontSemiBold16,
    color: COLORS.primary,
  },
  summarizeBtn: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
