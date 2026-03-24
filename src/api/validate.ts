import type { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.js";

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"] as const;

export async function handlerValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
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
  res.status(200).send(JSON.stringify({ cleanedBody: cleanBody }));
}
