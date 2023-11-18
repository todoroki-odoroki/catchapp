import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { Message } from "@line/bot-sdk";
import { LineConfig } from "../types";
import * as dotenv from "dotenv";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
dotenv.config();

const db = admin.firestore();

// Initialize LINE
const lineConfig: LineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
  channelSecret: process.env.CHANNEL_SECRET ?? "",
};
const client = new line.Client(lineConfig);

// Initialise ChatGPT
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Line Talk Room Id
const destId = "C5481f05c1b97a17a5cecc6c321d1b6d6";

export const postOhgiriResultsToLine = functions.pubsub
  .schedule("every Saturday 18:01")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    let ohgiriId = "";
    let content = "";
    let gptAnswer: string | undefined = "";

    const title = "😆大喜利結果発表！\n";
    content += title + "\n";

    try {
      const snapshot = await db
        .collection("ohgiri")
        .where("status", "==", "waiting")
        .orderBy("createdAt")
        .limit(1)
        .get();

      await Promise.all(
        snapshot.docs.map(async (doc) => {
          ohgiriId = doc.id;
          const data = doc.data();
          content += `お題「${data.question}」\n`;
          data.answers.forEach((answer: any, index: number) => {
            content += `\n${index + 1}.${answer.content}\n`;
          });
          content += "\n\n🤖GPT大先生の評価\n\n";
          gptAnswer = await getGPTAnswer(data);
          content += gptAnswer;
        })
      );

      await postText(destId, content);
      await changeStatus(ohgiriId, gptAnswer);
    } catch (e) {
      console.error("Error:", e);
    }
    return null;
  });

const postText = async (destId: string, content: string) => {
  const message: Message = {
    type: "text",
    text: content,
  };

  try {
    await client.pushMessage(destId, message);
  } catch (error) {
    console.error("Error posting to LINE:", error);
    throw error;
  }
};

const changeStatus = async (ohgiriId: string, gptAnswer: string) => {
  try {
    await db
      .collection("ohgiri")
      .doc(ohgiriId)
      .update({ status: "completed", gptAnswer: gptAnswer });
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

const getGPTAnswer = async (data: any) => {
  const instructions =
    "あなたは大喜利の採点者です。お題に対する各回答に10点満点(10=とても面白い)で点数をつけてください。点数の理由も簡潔に教えてください。アニメキャラクターを一つ選んで、そのキャラの口調で話してください。\n";
  const topic = `#お題\n${data.question}`;
  const system = instructions + topic;
  let content = "#回答\n";
  data.answers.forEach((answer: any, index: number) => {
    content += `${index + 1}.${answer.content}\n\n`;
  });

  const model = "gpt-3.5-turbo";
  const maxTokens = 256;
  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: system },
    { role: "user", content: content },
  ];

  try {
    const response = await openai.createChatCompletion({
      model: model,
      max_tokens: maxTokens,
      messages: messages,
    });

    const answer = response.data.choices[0].message?.content;
    console.log(answer);

    return answer;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw error;
  }
};
