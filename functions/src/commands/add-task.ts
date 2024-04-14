import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const addTask = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId, text} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else if (!text) {
    response.send(`Usage: /add-task [task name]
example: /add-task deploy the app to the store`);
  } else {
    await TaskDB.addTask(teamId, userId, text, 0);
    response.send(`The Task\n${Utils.quotesText(text)}\nAdded Successfully`);
  }
};

export default onRequest(addTask);
