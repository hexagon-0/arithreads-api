import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { object, string, InferType, ValidationError, Schema } from 'yup';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from './security';
import knex from './database';

type ValidationSchemas<Body = any, Query = any, Params = any, Headers = any> = {
  body?: Schema<Body>;
  query?: Schema<Query>;
  params?: Schema<Params>;
  headers?: Schema<Headers>;
};

function validate<Body = any, Query = any, Params = any, Headers = any> (
  schemas: ValidationSchemas<Body, Query, Params, Headers>
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const validationPromises = [
      schemas.body?.validate(req.body, { abortEarly: false }),
      schemas.query?.validate(req.query, { abortEarly: false }),
      schemas.params?.validate(req.params, { abortEarly: false }),
      schemas.headers?.validate(req.headers, { abortEarly: false }),
    ].filter(p => p !== undefined);

    const validated = await Promise.allSettled(validationPromises);
    const errors = validated.filter(promise => promise.status === 'rejected');

    if (errors.length > 0) {
      const result = errors.flatMap(e => e.reason.errors);
      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }

    return next();
  }
}

const app = express();

const users = express.Router();

const reqSchema = {
  body: object({
    username: string().required().min(3),
    password: string().required().min(8),
  })
};

type ReqBody = InferType<typeof reqSchema.body>;

const createUser: RequestHandler<{}, {}, ReqBody> = async (req, res) => {
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

users.post('/', validate(reqSchema), createUser);

app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({
    'hello': 'world',
  });
});

app.use('/users', users);

export { app };
