import "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { postWeeklyNewsToLine } from "./funcs/post_weekly_news_to_line";
import { postReminderToLine } from "./funcs/post_reminder_to_line";


exports.postWeeklyNewsToLine = postWeeklyNewsToLine;
exports.postReminderToLine = postReminderToLine;
