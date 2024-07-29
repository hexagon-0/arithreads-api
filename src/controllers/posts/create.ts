import { RequestHandler } from 'express';
import { object, string, InferType, number } from 'yup';
import knex from '../../database';
import { StatusCodes } from 'http-status-codes';

export const createReqSchema = {
  body: object({
    operand: number().required(),
    operator: string().required().oneOf(['+', '-', '*', '/']).optional(),
    parentPostId: number().integer().optional(),
  })
};

type ReqBody = InferType<typeof createReqSchema.body>;

export const create: RequestHandler<{}, {}, ReqBody> = async (req, res) => {
  const user = res.locals.user as { id: number };

  const post: any = {
    userId: user.id,
    operand: req.body.operand,
  };

  const parent = req.body.parentPostId;
  const operator = req.body.operator;

  const hasParent = parent !== undefined && parent !== null;
  const hasOperator = operator !== undefined && operator !== null;
  if (hasParent !== hasOperator) {
    return res.status(StatusCodes.BAD_REQUEST).json([
      'Response post must have parent and operator',
    ]);
  }

  if (hasParent) {
    post.operator = operator;
    post.parentPostId = parent;
  }

  try {
    const [dbPost] = await knex('posts').insert(post, 'id');
    return res.status(StatusCodes.CREATED).json({ id: dbPost.id });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
      'Could not create post',
    ]);
  }
};
