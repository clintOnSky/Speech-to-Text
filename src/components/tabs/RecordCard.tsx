import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@const/index";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "global/styles";

interface MenuProps {
  title: string;
  onPress: () => void;
}
const RecordCard = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const menuData: MenuProps[] = [
    { title: "Rename", onPress: () => {} },
    { title: "Share", onPress: () => {} },
    { title: "Delete", onPress: () => {} },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.soundIcon}>
        <Ionicons name="recording-sharp" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1, gap: 5, justifyContent: "center" }}>
        <Text style={styles.title} numberOfLines={1}>
          Recording1
        </Text>
        <Text style={styles.date} numberOfLines={1}>
          25-11-2023 <Text>15:11</Text>
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="play" size={26} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
      </TouchableOpacity>
      {isMenuOpen && (
        <View style={styles.optionMenu}>
          {menuData?.map((item, index) => (
            <TouchableOpacity
              style={styles.optionButton}
              key={index.toString()}
              onPress={item.onPress}
            >
              <Ionicons
                name={
                  item.title === "Rename"
                    ? "pencil-sharp"
                    : item.title === "Share"
                    ? "share-outline"
                    : "trash-outline"
                }
                size={20}
                color={COLORS.gray}
              />
              <Text style={styles.optionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default RecordCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 10,
    marginHorizontal: wp(SIZES.medium),
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  soundIcon: {
    padding: 15,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
  },
  title: {
    ...globalStyles.fontMedium16,
  },
  date: {
    ...globalStyles.fontRegular14,
    color: COLORS.labelGray,
  },
  optionMenu: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: COLORS.white,
    elevation: 5,
    zIndex: 1,
    borderRadius: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  optionText: {
    flex: 1,
    ...globalStyles.fontRegular16,
  },
});
