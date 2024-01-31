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
  console.log("🚀 ~ summaryType:", summaryType);
  const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  let summaryPrompt = "";

  switch (summaryType) {
    case "Simple Summary":
      summaryPrompt = "provide a simple summary";
      break;
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
    case "Application Examples":
      summaryPrompt = "include real-world application examples";
      break;
    case "Comparisons and Contrasts":
      summaryPrompt = "compare and contrast the ideas";
      break;
    case "Cause and Effect":
      summaryPrompt = "explain cause-and-effect relationships";
      break;
    case "Timeline or Chronology":
      summaryPrompt = "present information in chronological order";
      break;
    case "Analogy":
      summaryPrompt = "use analogies to explain complex ideas";
      break;
    case "Problem-Solving Scenarios":
      summaryPrompt = "frame the content in problem-solving scenarios";
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
    const fullPrompt = `Can you explain and ${summaryPrompt} of the following in a ${summaryType} format shortly: ${prompt}?. \n Do not exceed the context of the given text`;

    console.log("🚀 ~ fullPrompt:", fullPrompt);
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
