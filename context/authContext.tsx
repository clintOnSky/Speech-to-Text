import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "config/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { router, useSegments } from "expo-router";
import { Alert } from "react-native";
import { AuthUserProps } from "types";

export const AuthUserContext = createContext<AuthUserProps>(null);

const authUser = (
  currentUser: User,
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
  setCheckedAuth: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const checkAuth = async (authorizedUser: User) => {
    authorizedUser ? setCurrentUser(authorizedUser) : setCurrentUser(null);
    setCheckedAuth(true);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, checkAuth);
    return unsubscribe;
  }, [currentUser]);
};

// Ensures the user on accesses the app once they have been authenticated
const useProtectedRoute = (currentUser: User, checkedAuth: boolean) => {
  const segments = useSegments();

  const inAuthRoute = segments[0] === "(auth)"; // Sets boolean to true if you are in an auth screen

  const navigate = useCallback(() => {
    if (checkedAuth) {
      console.log("Im in");
      // If authentication is not successful and it is not in the auth route, it navigates to login
      if (!currentUser && !inAuthRoute) {
        router.replace("/signin");

        // If it is successful it checks navigates to chatlist only if the app has just been opened
      } else if (segments[0] === undefined) {
        router.replace("/home");

        // If user is in the authentication screen and login is successful, it navigates to the chat list screen
      } else if (inAuthRoute && currentUser) {
        router.replace("/home");
      }
    }
  }, [segments, checkedAuth, currentUser]);

  useEffect(() => {
    navigate();
  }, [currentUser, segments, checkedAuth]);
};

export const AuthUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  console.log("🚀 ~ AuthUserProvider ~ currentUser:", currentUser?.email);
  const [checkedAuth, setCheckedAuth] = useState<boolean>(false);
  authUser(currentUser, setCurrentUser, setCheckedAuth);
  useProtectedRoute(currentUser, checkedAuth);
  const onSignOut = () => {
    signOut(auth).catch((error) => Alert.alert("", "Something went wrong"));
    setCurrentUser(null);
  };

  return (
    <AuthUserContext.Provider value={{ currentUser, onSignOut }}>
      {children}
    </AuthUserContext.Provider>
  );
};
