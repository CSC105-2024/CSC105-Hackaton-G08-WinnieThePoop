import * as UserController from '../controllers/user.controller.ts';
import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.ts';
const userRouter = new Hono();

userRouter.post('/signup', UserController.createUserController);
userRouter.post('/login', UserController.loginUserController);
userRouter.get('/profile', authMiddleware,UserController.fetchProfileController);
userRouter.patch('/profile', authMiddleware,UserController.updateProfileController);
userRouter.post('/profile/upload-profile-pic', authMiddleware, UserController.uploadProfilePicController);

export default userRouter;