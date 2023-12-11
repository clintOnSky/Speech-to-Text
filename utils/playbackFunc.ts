import { AVPlaybackStatusSuccess, Audio } from "expo-av";

export const play = async (playbackObj: Audio.Sound, uri: string) => {
  try {
    return await playbackObj.loadAsync(
      {
        uri,
      },
      { shouldPlay: true }
    );
  } catch (e) {
    console.warn("Error occured in play function", e);
  }
};
export const pause = async (playbackObj: Audio.Sound) => {
  try {
    return await playbackObj.pauseAsync();
  } catch (e) {
    console.warn("Error occured in pause function", e);
  }
};

export const resume = async (playbackObj: Audio.Sound) => {
  try {
    return await playbackObj.playAsync();
  } catch (e) {
    console.warn("Error occured in pause function", e);
  }
};

export const getAudioDuration = async (uri: string) => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false }
    );

    return new Promise<number | null>((resolve) => {
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded) {
          const durationMillis = playbackStatus.durationMillis;
          console.log("Is Loaded", durationMillis);
          resolve(durationMillis);
        }
      });
    });
  } catch (error) {
    console.error("Error getting audio duration:", error.message);
    return null;
  }
};
