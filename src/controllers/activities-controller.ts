import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activities = await activitiesService.getActivities(userId);

  return res.status(httpStatus.OK).send(activities);
}

export async function signupActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.body.activityId);

  const activity = await activitiesService.signupActivity(userId, activityId);

  return res.status(httpStatus.OK).send({ activity });
}

