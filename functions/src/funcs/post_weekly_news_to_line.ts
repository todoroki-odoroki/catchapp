import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { Message } from "@line/bot-sdk";
import { LineConfig } from "../types";
const db = admin.firestore();

// Initialize LINE
const lineConfig: LineConfig = {
  channelAccessToken: functions.config().line_config.channel_access_token ?? '',
  channelSecret: functions.config().line_config.channel_secret ?? '',
};
const client = new line.Client(lineConfig);

// Line Talk Room Id
const destId = "C5481f05c1b97a17a5cecc6c321d1b6d6";

export const postWeeklyNewsToLine = functions.pubsub
  .schedule("every Friday 18:00")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    console.log("processed");

    const today = new Date();
    const oneWeekBefore = new Date();
    oneWeekBefore.setDate(today.getDate() - 7);

    const year = oneWeekBefore.getFullYear();
    const monthFrom = oneWeekBefore.getMonth() + 1;
    const dayFrom = oneWeekBefore.getDate();
    const monthTo = today.getMonth() + 1;
    const dayTo = today.getDate();

    let content = `📨 近況報告!\n【${year}年${monthFrom}月${dayFrom}日〜${monthTo}月${dayTo}日】\n`;
    console.log(today, oneWeekBefore, content);

    await db
      .collection("colNews")
      .where("createdAt", ">", oneWeekBefore)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("content", doc.data().content);
          content += `\n■${doc.data().content}`;
        });
        postToLine(destId, content);
      })
      .catch((e) => console.error(e));

    return null;
  });

const postToLine = (destId: string, content: string) => {
  const message: Message = 
    {
      type: "text",
      text: content,
    };
  client.pushMessage(destId, message).catch((e) => console.error(e));
  console.log(destId, message);
};
