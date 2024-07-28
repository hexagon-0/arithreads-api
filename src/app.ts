import express from 'express';
import { object, string, InferType, ValidationError } from 'yup';
import { StatusCodes } from 'http-status-codes';

const app = express();

const users = express.Router();

const userSchema = object({
  username: string().required().min(3),
  email: string().required().email(),
  password: string().required().min(8),
});

type User = InferType<typeof userSchema>;

users.post('/', async (req, res) => {
  try {
    const user = await userSchema.validate(req.body, { abortEarly: false });

    return res.status(StatusCodes.CREATED).json({
      id: 1,
      ...user,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const entries: [string, string[]][] = err.inner.map(error => ([error.path ?? '', error.errors]));
      const result = Object.fromEntries(entries);

      return res.status(StatusCodes.BAD_REQUEST).json(result);
    }
  }
});

app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({
    'hello': 'world',
  });
});

app.use('/users', users);

export { app };
