import type { AVPlaybackStatusSuccess, Audio } from "expo-av";
import { useSegments } from "expo-router";
import { createContext, useState, useEffect, memo } from "react";
import { PlaybackStatus } from "types";

interface PlaybackContextProps {
  sound: Audio.Sound;
  setSound: React.Dispatch<React.SetStateAction<Audio.Sound>>;
  playbackStatus: PlaybackStatus;
  setPlaybackStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  currentURI: string;
  setCurrentURI: React.Dispatch<React.SetStateAction<string>>;
}

export const PlaybackContext = createContext<PlaybackContextProps>(null);

const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("Playback context called");
  const [sound, setSound] = useState<Audio.Sound>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>(null);
  const [currentURI, setCurrentURI] = useState<string>("");
  console.log("🚀 ~ file: playbackContext.tsx:24 ~ currentURI:", currentURI);
  const segments = useSegments();

  useEffect(() => {
    sound?.setOnPlaybackStatusUpdate(
      (playbackStatus: AVPlaybackStatusSuccess) => {
        if (
          playbackStatus.isLoaded &&
          playbackStatus.didJustFinish &&
          !playbackStatus.isLooping
        ) {
          // The player has just finished playing and will stop. Maybe you want to play something else?
          setPlaybackStatus(null);
          setCurrentURI("");
        }
      }
    );
    return sound !== null
      ? () => {
          console.log("Unloading sound");
          sound?.unloadAsync();
          setSound(null);
          setPlaybackStatus(null);
        }
      : undefined;
  }, [sound, currentURI, segments]);
  return (
    <PlaybackContext.Provider
      value={{
        sound,
        setSound,
        playbackStatus,
        setPlaybackStatus,
        currentURI,
        setCurrentURI,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export default PlaybackProvider;
