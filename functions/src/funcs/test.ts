// import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";
// import * as line from "@line/bot-sdk";
// import { Message } from "@line/bot-sdk";
// import { LineConfig } from "../types";
// import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
// import * as dotenv from "dotenv";
// dotenv.config();

// const db = admin.firestore();

// // Initialize LINE
// const lineConfig: LineConfig = {
//   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
//   channelSecret: process.env.CHANNEL_ACCESS_TOKEN ?? "",
//   //   channelAccessToken: functions.config().line_config.channel_access_token ?? "",
//   //   channelSecret: functions.config().line_config.channel_secret ?? "",
// };
// const client = new line.Client(lineConfig);

// // Initialise ChatGPT
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// // Line id for testing (masaki's id)
// const destId = "U0c76609bed3be74104df6a707d3791f0";

// export const test = functions.https.onRequest(
//   async (
//     req: any,
//     res: {
//       [x: string]: any;
//       send: (arg0: string) => void;
//     }
//   ) => {
//     let ohgiriId = "";
//     let content = "";
//     let gptAnswer: string | undefined = "";

//     const title = "😆大喜利結果発表！\n";
//     content += title + "\n";

//     try {
//       const snapshot = await db
//         .collection("ohgiri")
//         .where("status", "==", "waiting")
//         .orderBy("createdAt")
//         .limit(1)
//         .get();

//       await Promise.all(
//         snapshot.docs.map(async (doc) => {
//           ohgiriId = doc.id;
//           const data = doc.data();
//           content += `お題：${data.question}\n`;
//           data.answers.forEach((answer: any) => {
//             content += `\n「${answer.content}」\n`;
//           });
//           content += "\n🤖GPT大先生の評価\n\n";
//           gptAnswer = await getGPTAnswer(data);
//           content += gptAnswer;
//         })
//       );

//       await postText(destId, content);
//       await changeStatus(ohgiriId, gptAnswer);

//       res.send("Function executed successfully");
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send("An error occurred");
//     }
//   }
// );

// const postText = async (destId: string, content: string) => {
//   const message: Message = {
//     type: "text",
//     text: content,
//   };

//   try {
//     await client.pushMessage(destId, message);
//   } catch (error) {
//     console.error("Error posting to LINE:", error);
//     throw error;
//   }
// };

// const changeStatus = async (ohgiriId: string, gptAnswer: string) => {
//   try {
//     await db
//       .collection("ohgiri")
//       .doc(ohgiriId)
//       .update({ status: "completed", gptAnswer: gptAnswer });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     throw error;
//   }
// };

// const getGPTAnswer = async (data: any) => {
//   const instructions =
//     "あなたは大喜利の採点者です。お題に対する回答に10点満点で点数をつけてください。理由も教えてください。\n";
//   const topic = `#お題\n${data.question}`;
//   const system = instructions + topic;
//   let content = "#回答\n";
//   data.answers.forEach((answer: any, index: number) => {
//     content += `${index + 1}.${answer.content}\n\n`;
//   });

//   // ChatGPTに投げるメッセージ
//   const messages: ChatCompletionRequestMessage[] = [
//     { role: "system", content: system },
//     { role: "user", content: content },
//   ];

//   const model = "gpt-3.5-turbo";
//   const maxTokens = 256;

//   try {
//     const response = await openai.createChatCompletion({
//       model: model,
//       messages: messages,
//       max_tokens: maxTokens,
//     });

//     const answer = response.data.choices[0].message?.content;
//     console.log(answer);

//     return answer;
//   } catch (error) {
//     console.error("Error calling ChatGPT API:", error);
//     throw error;
//   }
// };
