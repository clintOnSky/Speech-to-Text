import type { Audio } from "expo-av";
// try {
//   if (sound === null) {
//     console.log("Loading Sound");
//     const { sound: playbackObj } = await Audio.Sound.createAsync({
//       uri: recordData.uri,
//     });

//     const status = await playbackObj.playAsync();
//     setSound(playbackObj);
//     console.log("Playing audio");
//     setPlaybackStatus(status);
//   } else if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
//     console.log("Pausing sound");
//     const status = await sound.pauseAsync();
//     setPlaybackStatus(status);
//   } else if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
//     console.log("Resuming audio");
//     const status = await sound.playAsync();
//     setPlaybackStatus(status);
//   } else {
//     const status = await sound.unloadAsync();
//     console.log(status);
//     setPlaybackStatus(status);
//     setSound(null);
//   }
// } catch (e) {
//   console.warn(e);
// }

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
