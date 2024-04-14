import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const tasks = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else {
    const [tasks, extraTasks] = await Promise.all([
      TaskDB.getTasks(teamId, userId, 0),
      TaskDB.getTasks(teamId, userId, 1),
    ]);
    if (tasks.length === 0 && extraTasks.length === 0) {
      response.send("No Tasks found!");
    } else {
      let message = "";
      if (tasks.length !== 0) {
        message += "*Here is your tasks list:*\n";
        message += tasks
          .map((task, i) => Utils.quotesText(`${i + 1}: ${task}`))
          .join("\n");
      }
      if (extraTasks.length !== 0) {
        const offset = tasks.length;
        message += offset !== 0 ? "\n" : "";
        message += "*Here is your extra tasks list:*\n";
        message += extraTasks
          .map((task, i) => Utils.quotesText(`${offset + i + 1}: ${task}`))
          .join("\n");
      }
      response.send(message);
    }
  }
};

export default onRequest(tasks);
