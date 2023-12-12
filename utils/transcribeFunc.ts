import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

export async function transcribeAudio(
  uri: string,
  title: string
): Promise<string> {
  const apiUrl = "https://api.openai.com/v1/audio/transcriptions";
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  // const fileExtension = uri.split(".").pop();
  // const mimeTypeMap = {
  //   flac: "audio/flac",
  //   m4a: "audio/mp4",
  //   mp3: "audio/mpeg",
  //   mp4: "audio/mp4",
  //   mpeg: "audio/mpeg",
  //   mpga: "audio/mpeg",
  //   oga: "audio/ogg",
  //   ogg: "audio/ogg",
  //   wav: "audio/wav",
  //   webm: "audio/webm",
  // };

  // const contentType = mimeTypeMap[fileExtension];
  // console.log("🚀 ~ file: transcribeFunc.ts:26 ~ contentType:", contentType);
  try {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", {
      uri,
      type: "audio/ogg",
      name: title,
    });
    formData.append("model", "whisper-1");
    // formData.append("response_format", "text");

    const response = await axios.post(apiUrl, formData, {
      // prettier-ignore
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "multipart/form-data",
      },
      // onUploadProgress: (progress) => {
      //   console.log(progress.loaded);
      // },
    });
    const responseData: { text: string } = response.data;

    if (responseData.text === "you") {
      // Show an alert and cancel the operation
      Alert.alert(
        "Empty",
        "The audio file contains no text. Operation cancelled."
      );
      return "";
    }

    router.push("/transcript");
    return responseData.text;
  } catch (error) {
    console.error("Axios request error:", error.code);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
      console.error("Response Data:", error.response.data);
    }
    return new Promise((resolve, error) => {
      console.log(error);
      Alert.alert(
        "Error",
        "A network error occurred. Do you want to try again?",
        [
          {
            text: "Cancel",
            onPress: () => {
              resolve(""); // Resolving with an empty string or appropriate value
            },
          },
          {
            text: "Try again",
            onPress: async () => {
              const result = await transcribeAudio(uri, title);
              resolve(result);
            },
          },
        ]
      );
    });
  }
}
