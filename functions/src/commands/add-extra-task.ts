import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import Utils from "../utils/utils";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";

const addExtraTask = async (request: Request, response: Response) => {
  logger.log("body:", request.body);
  const {isValid, teamId, userId, text} = Utils.parseRequest(request.body);
  if (!isValid) {
    response.send(CONSTANTS.INVALID_REQUEST);
  } else if (!text) {
    response.send(`Usage: /add-extra-task [extra task name]
example: /add-extra-task code review for project`);
  } else {
    await TaskDB.addTask(teamId, userId, text, 1);
    response.send(`The Extra Task
${Utils.quotesText(text)}
Added Successfully`);
  }
};

export default onRequest(addExtraTask);
