import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import {
  createChirp,
  deleteChirp,
  getChirp,
  getChirps,
  getChirpsbyUser,
} from "../db/queries/chirps.js";
import { Chirp } from "../db/schema.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"] as const;

export async function hanlderCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  try {
    const token = getBearerToken(req);
    let userId = validateJWT(token, config.api.secret);
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
      throw new BadRequestError(
        `Chirp is too long. Max length is ${maxChirpLength}`,
      );
    }

    const words = params.body.split(" ");

    const replaced = words.map((word) => {
      if (PROFANE_WORDS.includes(word.toLocaleLowerCase() as any)) {
        return "****";
      }
      return word;
    });

    const cleanBody = replaced.join(" ");

    const newChirp = await createChirp({
      body: cleanBody,
      userId: userId,
    });

    if (!newChirp) {
      throw new BadRequestError("THIS IS NOT OKAY");
    }

    respondWithJSON(res, 201, newChirp);
  } catch (e) {
    throw new UnauthorizedError("Invalid token, you are not authorized");
  }
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  let authorId = "";
  let authorIdQuery = req.query.authorId;

  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  if (authorId) {
    const authorChirps = await getChirpsbyUser(authorId);
    respondWithJSON(res, 200, authorChirps);
    return;
  }

  const allChirps = await getChirps();

  respondWithJSON(res, 200, allChirps);
}

export async function handlerGetSingleChirp(req: Request, res: Response) {
  const { chirpId } = req.params;

  if (typeof chirpId != "string") {
    throw new NotFoundError("Please provide a valid ID");
  }

  try {
    const chirp: Chirp = await getChirp(chirpId);
    respondWithJSON(res, 200, chirp);
  } catch (err) {
    throw new NotFoundError("No Chipr found with this ID");
  }
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  const { chirpId } = req.params;

  if (typeof chirpId != "string") {
    throw new NotFoundError("Please provide a valid ID");
  }
  const userId = validateJWT(token, config.api.secret);

  const chirp: Chirp = await getChirp(chirpId);

  if (chirp.userId != userId) {
    throw new ForbiddenError("Forbidden");
  }

  await deleteChirp(chirpId);
  res.status(204).send();
}
