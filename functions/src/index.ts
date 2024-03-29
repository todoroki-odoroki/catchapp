import "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { postWeeklyPicturesToLine } from "./funcs/post_weekly_pictures_to_line";
import { postWeeklyNewsToLine } from "./funcs/post_weekly_news_to_line";
import { postReminderToLine } from "./funcs/post_reminder_to_line";
import { postOhgiriResultsToLine } from "./funcs/post_ohgiri_results_to_line";
// import { test } from "./funcs/test";

exports.postWeeklyNewsToLine = postWeeklyNewsToLine;
exports.postWeeklyPicturesToLine = postWeeklyPicturesToLine;
exports.postReminderToLine = postReminderToLine;
exports.postOhgiriResultsToLine = postOhgiriResultsToLine;
// exports.test = test;
