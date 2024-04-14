import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import CONSTANTS from "../utils/constants";
import TaskDB from "../database/tasksDB";
import Slack from "../utils/slack";

const install = async (request: Request, response: Response) => {
  logger.log("query:", request.query);
  const error = request.query.error as string | undefined;
  const code = request.query.code as string | undefined;
  if (error || !code) {
    response.send(request.query.error_description || CONSTANTS.ERROR_TEXT);
  } else {
    const data = await Slack.getAccessInfo(code);
    logger.log("data:", data);
    if (!data.ok) {
      response.send(CONSTANTS.ERROR_TEXT);
    } else {
      const teamId = data.team.id;
      const userId = data.authed_user.id;
      const teamName = data.team.name;
      const accessToken = data.access_token;
      await TaskDB.createTeam(teamId, teamName, accessToken);
      const message = `Hello <@${userId}>, Thanks for installing *TodoNizer*
${CONSTANTS.HELP_MESSAGE}`;
      const info = await Slack.sendMessage(accessToken, userId, message);
      logger.log("info:", info);
      response.send("App Installed Succefully!");
    }
  }
};

export default onRequest(install);
