import axios from "axios";
import React, { useState } from "react";

export default function useTranscribe() {
  const [data, setData] = useState<{ text: string }>();

  const apiUrl = "https://api.openai.com/v1/audio/transcriptions";
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const fileUri =
    "file:///data/user/0/host.exp.exponent/files/audio/AUD20231208101223127.m4a";

  const formData = new FormData();
  formData.append("file", fileUri);
  formData.append("model", "whisper-1");

  axios
    .post(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      setData(response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  return { data };
}
