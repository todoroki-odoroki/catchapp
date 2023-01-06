import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { Message } from "@line/bot-sdk";
import { LineConfig } from "../types";
import * as axios from "axios";

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

export const postReminderToLine = functions.pubsub
  .schedule("every Friday 18:00")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {

    let content = "";
    const title = "近況登録リマインド📢\n明日の18:00までに登録してね！";
    const webUrl = "https://catchapp-ed8dd.web.app/\n"
    content += title + webUrl;

    await axios.get("https://meigen.doodlenote.net/api/json.php?c=1&e=1")
    .then(response=>{
      const wordOfWeek = `\n~今週の名言~\n“${response.data[0].meigen}”\n${response.data[0].author}`;
      content += wordOfWeek;
      postText(destId, content);
  }).catch((e) => console.error(e));

    return null;
  });

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
