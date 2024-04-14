import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const completeTask = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId, text} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else {
    const taskNumber = parseInt(text || "");
    if (isNaN(taskNumber) || taskNumber <= 0) {
      response.send(`Usage: /complete-task [task number]
example: /complete-task 3`);
    } else {
      const task = await TaskDB.getTask(teamId, userId, taskNumber - 1);
      if (!task) {
        response.send(`The Task *${taskNumber}* not found!`);
      } else {
        await TaskDB.markTaskAsComplete(teamId, task.id);
        response.send(`The Task
${Utils.quotesText(task.text)}
marked as completed`);
      }
    }
  }
};

export default onRequest(completeTask);
