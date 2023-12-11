import React, { memo, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { AuthUserContext } from "./authContext";

interface DatabaseContextProps {
  db: SQLite.SQLiteDatabase;
  recordingTable: string;
  transcriptTable: string;
}

export const DatabaseContext =
  React.createContext<DatabaseContextProps>(undefined);

const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useContext(AuthUserContext);
  console.log("Database context called");
  const db = SQLite.openDatabase("audioTranscript.db");

  const recordingTable = `recordings${currentUser?.uid}`;
  const transcriptTable = `transcripts${currentUser?.uid}`;
  console.log("🚀 ~ file: database.tsx:23 ~ recordingTable:", recordingTable);

  return (
    <DatabaseContext.Provider value={{ db, recordingTable, transcriptTable }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default memo(DatabaseProvider);
