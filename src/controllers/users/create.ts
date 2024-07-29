import { RequestHandler } from 'express';
import { object, string, InferType } from 'yup';
import { hashPassword } from '../../security';
import knex from '../../database';
import { StatusCodes } from 'http-status-codes';

export const createReqSchema = {
  body: object({
    username: string().required().min(3),
    password: string().required().min(8),
  })
};

type ReqBody = InferType<typeof createReqSchema.body>;

export const createUser: RequestHandler<{}, {}, ReqBody> = async (req, res) => {
  const user = req.body;

  user.password = await hashPassword(user.password);

  try {
    const [dbUser] = await knex('users').insert(user, ['id', 'username']);

    return res.status(StatusCodes.CREATED).json(dbUser);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
      'Could not create user',
    ]);
  }
};
