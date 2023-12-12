import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

export async function transcribeAudio(
  uri: string,
  title: string
): Promise<string> {
  const apiUrl = "https://api.openai.com/v1/audio/transcriptions";
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  try {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", {
      uri: uri,
      type: "audio/mp4",
      name: title,
    });
    formData.append("model", "whisper-1");
    // formData.append("response_format", "text");

    console.log("Transcribing");
    const response = await axios.post(apiUrl, formData, {
      // prettier-ignore
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "multipart/form-data",
      },
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
    console.log(responseData.text);
    return responseData.text;
  } catch (error) {
    // console.error("Axios request error:", error.code);
    // if (error.response) {
    // console.error("Response Status:", error.response.status);
    // console.error("Response Headers:", error.response.headers);
    // console.error("Response Data:", error.response.data);
    // }
    return new Promise((resolve) => {
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
