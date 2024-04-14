import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const moveToExtra = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId, text} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else {
    const taskNumber = parseInt(text || "");
    if (isNaN(taskNumber) || taskNumber <= 0) {
      response.send(`Usage: /move-to-extra [task number]
example: /move-to-extra 3`);
    } else {
      const task = await TaskDB.getTask(teamId, userId, taskNumber - 1);
      if (!task) {
        response.send(`The Task *${taskNumber}* not found!`);
      } else {
        await TaskDB.changeTaskPriority(teamId, task.id, 1);
        response.send(`The Task
${Utils.quotesText(task.text)}
moved to extra tasks`);
      }
    }
  }
};

export default onRequest(moveToExtra);
