import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const todayTasks = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else {
    const tasks = await TaskDB.getTasks(teamId, userId, 0);
    if (tasks.length === 0) {
      response.send(`Hi <@${userId}>, you don't have any tasks today`);
    } else {
      let message = `Hi <@${userId}>, Here is your tasks for today:\n`;
      for (let i = 0; i < tasks.length; i++) {
        message += `${tasks[i][1]}\n`;
      }
      response.send({response_type: "in_channel", text: message});
    }
  }
};

export default onRequest(todayTasks);
