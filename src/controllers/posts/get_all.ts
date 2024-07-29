import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import knex from "../../database";
import Post from "../../database/models/post";

type PostTree = {
  id: number,
  operator: string | undefined,
  operand: number,
  username: string,
  responses: PostTree[],
};

async function getAllRecursive (parentPostId: number | null = null) {
  const posts = await knex('posts')
    .select('posts.id', 'posts.operand', 'posts.operator', 'users.username')
    .where('parentPostId', parentPostId)
    .join('users', 'posts.userId', '=', 'users.id');

  return Promise.all(posts.map(async (post): Promise<PostTree> => ({
    id: post.id,
    operand: post.operand,
    operator: post.operator,
    username: post.username,
    responses: await getAllRecursive(post.id),
  })));
}

export async function getAll (req: Request, res: Response) {
  try {
    const response = await getAllRecursive();

    return res.status(StatusCodes.OK).json(response);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
      'Could not get posts',
    ]);
  }
}
