import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { updateUserToRed } from "../db/queries/users.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerWebhook(req: Request, res: Response) {
  const key = getAPIKey(req);

  if (key != config.api.polka) {
    respondWithJSON(res, 401, "");
    return;
  }

  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };

  const params: parameters = req.body;

  if (params.event != "user.upgraded") {
    respondWithJSON(res, 204, "");
    return;
  }

  let result = await updateUserToRed(params.data.userId);

  if (!result) {
    throw new NotFoundError("Not Found");
  }

  respondWithJSON(res, 204, "");
}
