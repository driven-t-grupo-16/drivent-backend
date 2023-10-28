import { Router } from 'express';
import { signInGitHub, singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInGitHubSchema, signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/sign-in/github', validateBody(signInGitHubSchema), signInGitHub);

export { authenticationRouter };
