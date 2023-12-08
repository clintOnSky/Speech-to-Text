import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import type { Recording } from "expo-av/build/Audio";

export interface MenuProps {
  title: string;
  handleMenuPress: () => void;
}

export interface PositionProps {
  top: number;
  left: number;
}
export interface RecordCardProps {
  title: string;
  createdAt: string;
  duration: number;
  id: string;
  uri: string;
}

export interface AudioFileData {
  uri: string;
  title: string;
  timer: number;
}

export type RecordDataItem = RecordCardProps;

// export interface AudioFileData {
//   db: SQLiteDatabase;
//   timer: number;
//   title: string;
//   uri: string;
//   addRecording: (data: ) => void;
// }

export type PlaybackStatus = AVPlaybackStatus | AVPlaybackStatusSuccess;

export interface RecordingContextProps {
  recording: Recording | undefined;
  setRecording: React.Dispatch<React.SetStateAction<Recording | undefined>>;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  recordings: RecordDataItem[] | undefined[];
  setRecordings: React.Dispatch<
    React.SetStateAction<RecordDataItem[] | undefined[]>
  >;
  recordPreview: RecordDataItem;
  setRecordPreview: React.Dispatch<React.SetStateAction<RecordDataItem>>;
  isRecorderVisible: boolean;
  setIsRecorderVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isTransModalVisible: boolean;
  hideTransModal: () => void;
  showRecorder: () => void;
  hideRecorder: () => void;
  clearStates: () => void;
  startRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  deleteAudio: (id: string) => void;
  renameAudio: (id: string, newTitle: string) => void;
}
