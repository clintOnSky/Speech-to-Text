import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import type { Recording } from "expo-av/build/Audio";
import { User } from "firebase/auth";

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

export interface TranscriptCardProps {
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  audioId: string;
  id: string;
}

export interface AudioFileData {
  uri: string;
  title: string;
  timer: number;
}

export type TranscriptDataItem = TranscriptCardProps;

export type RecordDataItem = RecordCardProps;

// export interface AudioFileData {
//   db: SQLiteDatabase;
//   timer: number;
//   title: string;
//   uri: string;
//   addRecording: (data: ) => void;
// }

export type PlaybackStatus = AVPlaybackStatus | AVPlaybackStatusSuccess;

export interface TranscriptContenxtProps {
  transcripts: TranscriptDataItem[];
  setTranscripts: React.Dispatch<React.SetStateAction<TranscriptDataItem[]>>;
  deleteTranscript: (id: string) => void;
  renameTranscript: (id: string, newTitle: string) => void;
  handleTranscribe: () => Promise<void>;
  updateDocContent: (id: string, newContent: string) => void;
}

export interface RecordingContextProps {
  recording: Recording | undefined;
  setRecording: React.Dispatch<React.SetStateAction<Recording | undefined>>;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  recordings: RecordDataItem[];
  setRecordings: React.Dispatch<
    React.SetStateAction<RecordDataItem[] | undefined[]>
  >;
  recordPreview: RecordDataItem;
  setRecordPreview: React.Dispatch<React.SetStateAction<RecordDataItem>>;
  isRecorderVisible: boolean;
  setIsRecorderVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isTransModalVisible: boolean;
  showTransModal: () => void;
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
  saveAudio: (uri: string) => Promise<void>;
}

export interface AuthUserProps {
  currentUser: User;
  onSignOut: () => void;
}
