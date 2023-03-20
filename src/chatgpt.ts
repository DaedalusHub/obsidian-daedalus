import { Notice } from "obsidian";

const axios = require("axios");

interface ChatGPTResponse {
  choices: { text: string }[];
}

export async function sendRequestToChatGPT(text: string, apiKey: string, maxTokens = 200): Promise<string> {
  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    prompt: text,
    model: "text-davinci-003",
    max_tokens: maxTokens,
  };

  let response;
  try {
    response = await client.post("https://api.openai.com/v1/completions", params);
    new Notice("Response received", 10000);
    console.log(response.data);
  } catch (error) {
    new Notice(`Error received: ${error}`, 10000);
    console.error(error);
  }

  if (response.status !== 200) {
    const message = `Failed to get ChatGPT response. Status: ${response.status} ${response.statusText}`;
    new Notice(message, 10000);
    throw new Error(message);
  }
  const responseJson = response.data as ChatGPTResponse;
  return responseJson.choices[0].text;
}
