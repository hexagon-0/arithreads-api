import { NextFunction, Request, Response } from 'express';
import { Schema } from 'yup';
import { StatusCodes } from 'http-status-codes';

export type ValidationSchemas<Body = any, Query = any, Params = any, Headers = any> = {
  body?: Schema<Body>;
  query?: Schema<Query>;
  params?: Schema<Params>;
  headers?: Schema<Headers>;
};

export function validate<Body = any, Query = any, Params = any, Headers = any> (
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
