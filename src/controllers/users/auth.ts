import { RequestHandler } from "express";
import { InferType, object, string } from "yup";
import knex from "../../database";
import { StatusCodes } from "http-status-codes";
import { verifyPassword } from "../../security";
import { sign } from "../../auth";

export const authReqSchema = {
  body: object({
    username: string().required(),
    password: string().required(),
  }),
};

type ReqBody = InferType<typeof authReqSchema.body>;

export const authenticate: RequestHandler<{}, {}, ReqBody> = async (req, res) => {
  try {
    const dbUser = await knex('users')
      .select('username', 'password')
      .where('username', '=', req.body.username)
      .first();

    if (
      dbUser === undefined ||
      !await verifyPassword(dbUser.password, req.body.password)
    ) {
      return res.status(StatusCodes.NOT_FOUND).json([
        'Invalid credentials',
      ]);
    }

    try {
      const token = sign({ sub: dbUser.username });

      return res.status(StatusCodes.OK).json({
        accessToken: token,
        tokenType: 'Bearer',
      });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
        'Could not authenticate',
      ]);
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
      'Could not authenticate',
    ]);
  }
};
