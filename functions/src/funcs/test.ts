// import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";
// import * as line from "@line/bot-sdk";
// import { FlexCarousel, FlexMessage } from "@line/bot-sdk";
// import { LineConfig } from "../types";
// import * as dotenv from "dotenv";
// dotenv.config();

// const db = admin.firestore();

// // Initialize LINE
// const lineConfig: LineConfig = {
//   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
//   channelSecret: process.env.CHANNEL_SECRET ?? "",
// };
// const client = new line.Client(lineConfig);

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
//     const today = new Date();
//     const oneWeekBefore = new Date();
//     oneWeekBefore.setDate(today.getDate() - 7);

//     try {
//       const contents = [] as any[]; // Initialize an array to hold the content objects

//       const snapshot = await db
//         .collection("files")
//         .where("createdAt", ">", oneWeekBefore)
//         .orderBy("createdAt")
//         .get();

//       snapshot.forEach((doc) => {
//         const content = getImages(doc.data());
//         contents.push(content); // Push the content to the array
//       });

//       await postText(destId, contents);

//       res.send("Function executed successfully");
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send("An error occurred");
//     }
//   }
// );

// const postText = async (destId: string, contents: any) => {
//   const flexCarousel: FlexCarousel = {
//     type: "carousel",
//     contents: contents,
//   };

//   const flexMessage: FlexMessage = {
//     type: "flex",
//     altText: "Pictures",
//     contents: flexCarousel,
//   };

//   try {
//     await client.pushMessage(destId, flexMessage);
//   } catch (error) {
//     console.error("Error posting to LINE:", error);
//     throw error;
//   }
// };

// const getImages = (file: any) => {
//   const content = {
//     type: "bubble",
//     hero: {
//       type: "image",
//       size: "full",
//       aspectRatio: "20:13",
//       aspectMode: "cover",
//       url: file.url,
//     },
//     body: {
//       type: "box",
//       layout: "vertical",
//       spacing: "sm",
//       contents: [
//         {
//           type: "text",
//           text: file.comment,
//           wrap: true,
//           weight: "bold",
//           size: "lg",
//         },
//         {
//           type: "box",
//           layout: "baseline",
//           contents: [
//             {
//               type: "text",
//               text: file.createdBy,
//               wrap: true,
//               weight: "bold",
//               size: "sm",
//               flex: 0,
//             },
//           ],
//         },
//       ],
//       justifyContent: "center",
//     },
//     footer: {
//       type: "box",
//       layout: "vertical",
//       spacing: "sm",
//       contents: [
//         {
//           type: "box",
//           layout: "horizontal",
//           contents: [
//             {
//               type: "button",
//               action: {
//                 type: "message",
//                 label: "ええな",
//                 text: `ええな\n>>${file.comment}`,
//               },
//               style: "primary",
//             },
//             {
//               type: "button",
//               action: {
//                 type: "message",
//                 label: "まじか",
//                 text: `まじか\n>>${file.comment}`,
//               },
//               color: "#0f0f0f",
//               style: "primary",
//             },
//             {
//               type: "button",
//               action: {
//                 type: "message",
//                 label: "ほざけ",
//                 text: `ほざけ\n>>${file.comment}`,
//               },
//               style: "secondary",
//             },
//           ],
//           spacing: "md",
//         },
//         {
//           type: "button",
//           action: {
//             type: "uri",
//             label: "感想を投稿する",
//             uri: "https://catchapp-ed8dd.web.app/",
//           },
//         },
//       ],
//     },
//   };

//   return content;
// };
