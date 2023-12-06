import { StyleSheet } from "react-native";
import React from "react";
import * as SQLite from "expo-sqlite";

interface DatabaseContextProps {
  db: SQLite.SQLiteDatabase;
}

export const DatabaseContext =
  React.createContext<DatabaseContextProps>(undefined);

const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = SQLite.openDatabase("audioTranscript.db");

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;

const styles = StyleSheet.create({});
