import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  res.status(statusCode).send({ error: message });
}
