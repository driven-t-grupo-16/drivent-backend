import Joi from 'joi';
import { SignupActivityBody } from '@/protocols';

export const activitiesSchema = Joi.object<SignupActivityBody>({
    activityId: Joi.number().integer().min(1).required(),
});
