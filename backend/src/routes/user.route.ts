import * as UserController from '../controllers/user.controller.ts';
import { Hono } from 'hono';

const userRouter = new Hono();
userRouter.post('/', UserController.createUserController);