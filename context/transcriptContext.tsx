import React, { createContext, memo, useContext, useState } from "react";
import { RecordingContext } from "./recordingContext";
import { getCurrentISOString } from "@utils/index";
import uuid from "react-native-uuid";
import { DatabaseContext } from "./database";
import { TranscriptContenxtProps, TranscriptDataItem } from "types";
import { transcribeAudio } from "@utils/transcribeFunc";
import { Alert } from "react-native";

export const TranscriptContext = createContext<TranscriptContenxtProps>(null);

const TranscriptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transcripts, setTranscripts] = useState(null);

  const { db, transcriptTable } = useContext(DatabaseContext);
  const { recordPreview } = useContext(RecordingContext);

  const handleTranscribe = async () => {
    const content = await transcribeAudio(
      recordPreview.uri,
      recordPreview.title
    );
    console.log("Calling handleTranscribe");
    if (!content) {
      return;
    } else if (content === "") {
      return Alert.alert("No text", "Nothing was said in the audio");
    }
    const title = `DOC${getCurrentISOString().replace(/[-T:Z.]/g, "")}`;
    addTranscript(title, content);
  };

  const addTranscript = (title: string, content: string) => {
    const id = uuid.v4().toString();
    const summary = "";
    const createdAt = getCurrentISOString();
    const audioId = recordPreview.id;

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${transcriptTable} (id, title, content, summary, createdAt, audioId) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, title, content, summary, createdAt, audioId],
        (_, resultSet) => {
          console.log("Added new transcript successfully");
          const transcriptInfo: TranscriptDataItem = {
            id,
            title,
            content,
            summary,
            createdAt,
            audioId,
          };

          setTranscripts((prevTrans: TranscriptDataItem[]) => {
            if (prevTrans === null) {
              // If previous state is null, return a new array with the new item
              return [transcriptInfo];
            }

            // Otherwise, prepend the new item to the previous state array
            return [transcriptInfo, ...prevTrans];
          });
        },
        (_, error) => {
          console.error("Error while inserting", error);
          return true;
        }
      );
    });
  };

  const deleteTranscript = (id: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${transcriptTable} WHERE id = ?`,
        [id],
        (_, resultSet) => {
          console.log("Successfully deleted transcript", id);
          if (resultSet.rowsAffected > 0) {
            setTranscripts((prevTrans: TranscriptDataItem[]) =>
              [...prevTrans].filter((transcript) => transcript.id !== id)
            );
          }
        },
        (_, error) => {
          console.log("Error while deleting", error);
          return true;
        }
      );
    });
  };

  const renameTranscript = (id: string, newContent: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${transcriptTable} SET title = ? WHERE id = ?`,
        [newContent, id],
        (_, resultSet) => {
          console.log("Successfully updated transcript content", id);
          if (resultSet.rowsAffected > 0) {
            let existingArr = [...transcripts];
            const index = existingArr.findIndex(
              (transcript) => transcript.id === id
            );
            existingArr[index].content = newContent;
            setTranscripts(existingArr);
          }
        }
      );
    });
  };

  const updateTranscript = (id: string, content: string, summary: string) => {
    console.log("🚀 ~ file: transcriptContext.tsx:126 ~ summary:", summary);
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${transcriptTable} SET content = ?, summary = ? WHERE id = ?`,
        [content, summary, id],
        (_, resultSet) => {
          console.log("Successfully updated content and summary", id);
          if (resultSet.rowsAffected > 0) {
            let existingArr = [...transcripts];
            const index = existingArr.findIndex(
              (transcript) => transcript.id === id
            );
            existingArr[index].content = content;
            existingArr[index].summary = summary;
            setTranscripts(existingArr);
          }
        }
      );
    });
  };

  return (
    <TranscriptContext.Provider
      value={{
        transcripts,
        setTranscripts,
        handleTranscribe,
        deleteTranscript,
        renameTranscript,
        updateTranscript,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

export default TranscriptProvider;
