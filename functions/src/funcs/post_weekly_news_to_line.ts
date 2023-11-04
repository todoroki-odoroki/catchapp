import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { ImageMessage, Message } from "@line/bot-sdk";
import { LineConfig } from "../types";
import * as dotenv from "dotenv";
dotenv.config();

type Asset = {
  createdBy?: string;
  url: string;
  createdAt?: Date;
  mineType?: string;
};

const db = admin.firestore();

// Initialize LINE
const lineConfig: LineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? "",
  channelSecret: process.env.CHANNEL_ACCESS_TOKEN ?? "",
};
const client = new line.Client(lineConfig);

// Line Talk Room Id
const destId = "C5481f05c1b97a17a5cecc6c321d1b6d6";

// Line id for testing (masaki's id)
// const destId = "U0c76609bed3be74104df6a707d3791f0";

export const postWeeklyNewsToLine = functions.pubsub
  .schedule("every Saturday 18:00")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const today = new Date();
    const oneWeekBefore = new Date();
    oneWeekBefore.setDate(today.getDate() - 7);

    const year = oneWeekBefore.getFullYear();
    const monthFrom = oneWeekBefore.getMonth() + 1;
    const dayFrom = oneWeekBefore.getDate();
    const monthTo = today.getMonth() + 1;
    const dayTo = today.getDate();

    let content = "";
    const title = "📨 近況報告!\n";
    const period = `【${year}年${monthFrom}月${dayFrom}日〜${monthTo}月${dayTo}日】`;
    content += title + period + "\n";

    await db
      .collection("colNews")
      .where("createdAt", ">", oneWeekBefore)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          content += `\n■${data.content} （${data.createdBy}）`;
        });
        postText(destId, content);
      })
      .catch((e) => console.error(e));

    await postWeeklyFiles();

    return null;
  });

const getDaysBefore = (days: number) => {
  return new Date().setDate(new Date().getDate() - days);
};

const isAsset = (asset: any): asset is Asset => {
  return "url" in asset;
};

const postWeeklyFiles = async () => {
  const aWeekAgo = getDaysBefore(7);
  const files = await db
    .collection("files")
    .where("createdAt", ">", aWeekAgo)
    .get();
  return await Promise.all(
    files.docs
      .map((d): ImageMessage | undefined =>
        isAsset(d)
          ? { type: "image", originalContentUrl: d.url, previewImageUrl: d.url }
          : undefined
      )
      .filter((d) => !!d)
      .map((d) => postToLine(destId, d as ImageMessage))
  );
};

const postText = (destId: string, content: string) => {
  const message: Message = {
    type: "text",
    text: content,
  };
  postToLine(destId, message);
};

const postToLine = async (destId: string, content: Message) => {
  try {
    await client.pushMessage(destId, content);
  } catch (e) {
    console.error(e);
  }
};
