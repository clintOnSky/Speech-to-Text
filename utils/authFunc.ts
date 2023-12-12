import { auth } from "config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import { Alert, Keyboard } from "react-native";

export interface AuthProps {
  email: string;
  password: string;
}

export const handleSignUp = async ({ email, password }: AuthProps) => {
  Keyboard.dismiss();

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(user);
  } catch (error) {
    switch (error.message) {
      case "Firebase: Error (auth/email-already-in-use).":
        Alert.alert("", "Email is already in use");
        break;
      default:
        Alert.alert("Error", error.message);
        break;
    }
  }
};

export const handleSignIn = async ({ email, password }: AuthProps) => {
  Keyboard.dismiss();
  console.log(auth);
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (error) {
    if (error.message == "Firebase: Error (auth/wrong-password).") {
      Alert.alert("", "Password is incorrect");
    } else if (error.message === "Firebase: Error (auth/user-not-found).") {
      Alert.alert("", "User does not exist");
    } else {
      console.log(error.message);
    }
  }
};

export const handleSignOut = async () => {
  signOut(auth)
    .then(() => console.log("Successfully logged out"))
    .catch((error) => Alert.alert("", "Something went wrong"));
};
