import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, FC, useCallback, useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@const/index";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { globalStyles } from "global/styles";
import { MenuProps, PositionProps, RecordCardProps } from "types";
import OptionsMenu from "./OptionsMenu";
import { RecordContext } from "@/app/(tabs)/record";

type RecordItemProps = {
  recordData: RecordCardProps;
};

const RecordItem: FC<RecordItemProps> = ({ recordData: recordData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<PositionProps | null>(null);

  // const { onDelete } = useContext(RecordContext);

  const touchableRef = useRef<TouchableOpacity>(null);

  const handleDelete = () => {
    hideMenu();
    // onDelete(recordData);
  };

  function hideMenu() {
    setIsVisible(false);
  }

  const menuData: MenuProps[] = [
    { title: "Rename", handleMenuPress: hideMenu },
    { title: "Share", handleMenuPress: hideMenu },
    { title: "Delete", handleMenuPress: handleDelete },
  ];

  const showMenu = useCallback(() => {
    touchableRef?.current?.measureInWindow((x, y, width, height) => {
      if (y + height > hp(70)) {
        setMenuPosition({ top: hp(70), left: x - 85 });
      } else {
        setMenuPosition({ top: y + height, left: x - 85 });
      }
      setIsVisible(true);
    });
  }, [touchableRef]);

  return (
    <>
      {/* Record Card */}
      <View style={styles.container}>
        <View style={styles.soundIcon}>
          <Ionicons name="recording-sharp" size={24} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1, gap: 5, justifyContent: "center" }}>
          <Text style={styles.title} numberOfLines={1}>
            {recordData.title}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            25-11-2023 <Text>15:11</Text>
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="play" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showMenu}
          style={{ paddingVertical: 5 }}
          ref={touchableRef}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      {/* Options Menu */}
      <Modal transparent={true} visible={isVisible} onRequestClose={hideMenu}>
        <TouchableWithoutFeedback onPressIn={hideMenu}>
          <View style={styles.modal}>
            <View style={[styles.optionMenu, menuPosition && menuPosition]}>
              <OptionsMenu data={menuData} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default RecordItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 10,
    marginHorizontal: wp(SIZES.medium),
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 1,
  },
  soundIcon: {
    padding: 15,
    backgroundColor: COLORS.lightBrown,
    borderRadius: 8,
  },
  title: {
    ...globalStyles.fontMedium16,
  },
  date: {
    ...globalStyles.fontRegular14,
    color: COLORS.labelGray,
  },
  modal: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionMenu: {
    position: "absolute",
    backgroundColor: COLORS.white,
    elevation: 10,
    borderRadius: 8,
  },
});
