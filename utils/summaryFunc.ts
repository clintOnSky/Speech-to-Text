import axios, { AxiosInstance } from "axios";

export interface ChatCompletion {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface Choice {
  finish_reason: string;
  index: number;
  message: {
    content: string;
    role: string;
  };
}

export async function summarizeDoc(
  prompt: string,
  summaryType: string = "Simple Summary"
) {
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  let summaryPrompt = "";

  switch (summaryType) {
    case "Key Concepts":
      summaryPrompt = "summarize the key concepts";
      break;
    case "Visual Summaries":
      summaryPrompt = "create a visual summary";
      break;
    case "Bullet-point Lists":
      summaryPrompt = "organize information into bullet points";
      break;
    case "Question and Answer Format":
      summaryPrompt = "provide a question and answer format";
      break;
    case "Highlight Important Details":
      summaryPrompt = "highlight important details";
      break;
    case "Summary Paragraphs":
      summaryPrompt = "write summary paragraphs";
      break;
    case "Application Examples":
      summaryPrompt = "include real-world application examples";
      break;
    case "Simple Summary":
      summaryPrompt = "include real-world application examples";
      break;
    default:
      summaryPrompt = "provide a simple summary";
      break;
  }

  try {
    const client: AxiosInstance = axios.create({
      // prettier-ignore
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Summary function called");
    const fullPrompt = `Can you ${summaryPrompt} of the following in a ${summaryType} shortly: ${prompt}?. \n Do not exceed the context of the given text`;

    const response = await client.post(url, {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const completion: ChatCompletion = response.data;
    const result = completion.choices[0].message.content;
    console.log(
      "🚀 ~ file: summaryFunc.ts:53 ~ summarizeDoc ~ result:",
      result
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}
