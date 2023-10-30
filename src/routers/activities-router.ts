import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { signupActivity, getActivities } from '@/controllers';
import { activitiesSchema } from '@/schemas/activities-schema';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivities)
  .post('/', validateBody(activitiesSchema), signupActivity)

export { activitiesRouter };
