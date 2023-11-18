import * as functions from "firebase-functions";
import * as line from "@line/bot-sdk";
import { Message } from "@line/bot-sdk";
import { LineConfig } from "../types";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize LINE
const lineConfig: LineConfig = {
  channelAccessToken: functions.config().LINE_CHANNEL_ACCESS_TOKEN ?? "",
  channelSecret: functions.config().LINE_CHANNEL_SECRET ?? "",
};
const client = new line.Client(lineConfig);

// Line Talk Room Id
const destId = "C5481f05c1b97a17a5cecc6c321d1b6d6";

export const postReminderToLine = functions.pubsub
  .schedule("every Friday 18:00")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    let content = "";
    const title = "近況登録リマインド📢\n明日の18:00までに登録してね!";
    const webAppUrl = "https://catchapp-ed8dd.web.app/\n";
    content += title + webAppUrl;

    const url = "https://meigen.doodlenote.net/api/json.php?c=1&e=1";
    const options: AxiosRequestConfig = {
      url: `${url}/users`,
      method: "GET",
    };

    await axios(options)
      .then((res: AxiosResponse) => {
        const { data } = res;
        const wordOfWeek = `\n~今週の名言~\n“${data[0].meigen}”\n${data[0].author}`;
        content += wordOfWeek;
        postText(destId, content);
      })
      .catch((e: AxiosError<{ error: string }>) => console.error(e));

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
