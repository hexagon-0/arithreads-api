import express from 'express';
import { validate } from './middleware/validation';
import * as UsersController from './controllers/users';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({
    'hello': 'world',
  });
});

const users = express.Router();
users.post('/', validate(UsersController.createReqSchema), UsersController.createUser);
users.post('/login', validate(UsersController.authReqSchema), UsersController.authenticate);
app.use('/users', users);

export { app };
