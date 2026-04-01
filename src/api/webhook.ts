import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { updateUserToRed } from "../db/queries/users.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function handlerWebhook(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };

  const params: parameters = req.body;

  if (params.event != "user.upgraded") {
    // res.status(204).send();
    respondWithJSON(res, 204, "");
    return;
  }

  let result = await updateUserToRed(params.data.userId);

  if (!result) {
    throw new NotFoundError("Not Found");
  }

  respondWithJSON(res, 204, "");
}
