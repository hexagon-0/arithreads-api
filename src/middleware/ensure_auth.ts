import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import { verify } from "../auth";
import knex from "../database";

export async function ensureAuth (req: Request, res: Response, next: NextFunction) {
  const [tokenType, accessToken] = (req.headers.authorization ?? ' ').split(' ');

  if (tokenType !== 'Bearer') {
    return res.status(StatusCodes.UNAUTHORIZED).json([
      'Bearer token expected',
    ]);
  }

  try {
    const token = await verify(accessToken);
    if (typeof token !== 'object') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
        'Could not verify token',
      ]);
    }

    if (token.sub === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json([
        'Invalid token',
      ]);
    }

    const user = await knex('users')
      .select('id')
      .where('username', '=', token.sub)
      .first();

    if (user === undefined) {
      return res.status(StatusCodes.NOT_FOUND).json([
        'Token corresponds to non-existing user',
      ]);
    }

    res.locals.user = user;

    next();
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
      'Could not verify token',
    ]);
  }
}
