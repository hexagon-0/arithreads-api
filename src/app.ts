import express from 'express';
import { validate } from './middleware/validation';
import * as UsersController from './controllers/users';
import * as PostsController from './controllers/posts';
import { ensureAuth } from './middleware/ensure_auth';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
  return res.json({
    'hello': 'world',
  });
});

const users = express.Router();
users.post('/', validate(UsersController.createReqSchema), UsersController.createUser);
users.post('/login', validate(UsersController.authReqSchema), UsersController.authenticate);
app.use('/users', users);

const posts = express.Router();
posts.get('/', PostsController.getAll);
posts.post('/', ensureAuth, validate(PostsController.createReqSchema), PostsController.create);
app.use('/posts', posts);

export { app };
