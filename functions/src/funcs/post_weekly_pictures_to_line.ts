import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { FlexCarousel, FlexMessage } from "@line/bot-sdk";
import { LineConfig } from "../types";
import * as dotenv from "dotenv";
dotenv.config();

const db = admin.firestore();

// Initialize LINE
const lineConfig: LineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
  channelSecret: process.env.CHANNEL_SECRET ?? "",
};
const client = new line.Client(lineConfig);

// Line Talk Room Id
const destId = "C5481f05c1b97a17a5cecc6c321d1b6d6";

export const postWeeklyPicturesToLine = functions.pubsub
  .schedule("every Saturday 18:01")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const today = new Date();
    const oneWeekBefore = new Date();
    oneWeekBefore.setDate(today.getDate() - 7);

    try {
      const contents = [] as any[];

      const snapshot = await db
        .collection("files")
        .where("createdAt", ">", oneWeekBefore)
        .orderBy("createdAt")
        .get();

      snapshot.forEach((doc) => {
        const content = getImages(doc.data());
        contents.push(content);
      });

      await postText(destId, contents);

      return null;
    } catch (e) {
      console.error("Error: ", e);
      return null;
    }
  });

const getImages = (file: any) => {
  const content = {
    type: "bubble",
    hero: {
      type: "image",
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
      url: file.url,
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: file.comment,
          wrap: true,
          weight: "bold",
          size: "lg",
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: file.createdBy,
              wrap: true,
              weight: "bold",
              size: "sm",
              flex: 0,
            },
          ],
        },
      ],
      justifyContent: "center",
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "ええな",
                text: `ええな\n>>${file.comment}`,
              },
              style: "primary",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "まじか",
                text: `まじか\n>>${file.comment}`,
              },
              color: "#0f0f0f",
              style: "primary",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "ほざけ",
                text: `ほざけ\n>>${file.comment}`,
              },
              style: "secondary",
            },
          ],
          spacing: "md",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "感想を投稿する",
            uri: "https://catchapp-ed8dd.web.app/",
          },
        },
      ],
    },
  };
  return content;
};

const postText = async (destId: string, contents: any) => {
  const flexCarousel: FlexCarousel = {
    type: "carousel",
    contents: contents,
  };

  const flexMessage: FlexMessage = {
    type: "flex",
    altText: "Posted Pictures",
    contents: flexCarousel,
  };

  try {
    await client.pushMessage(destId, flexMessage);
  } catch (e) {
    console.error("Error posting to LINE:", e);
    throw e;
  }
};
