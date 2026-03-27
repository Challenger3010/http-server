import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { Chirp } from "../db/schema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"] as const;

export async function hanlderCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

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
    userId: params.userId,
  });

  if (!newChirp) {
    throw new BadRequestError("THIS IS NOT OKAY");
  }

  respondWithJSON(res, 201, newChirp);
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  const allChirps = await getChirps();
  console.log(allChirps);

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
