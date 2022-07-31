import "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { postWeeklyNewsToLine } from "./funcs/post_weekly_news_to_line";

exports.postWeeklyNewsToLine = postWeeklyNewsToLine;
