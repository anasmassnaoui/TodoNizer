import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import CONSTANTS from "../utils/constants";

const help = async (request: Request, response: Response) => {
  logger.log("query:", request.query);
  response.send(CONSTANTS.HELP_MESSAGE);
};

export default onRequest(help);
