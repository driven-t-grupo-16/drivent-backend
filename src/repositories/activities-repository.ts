import { CreateActivitySignupParams } from '@/protocols';
import { prisma } from '@/config';

async function getActivities() {
    return prisma.activity.findMany({
        orderBy: { startTime: 'asc' }
    });
}

async function getRegistrations() {
    return prisma.activityRegistration.findMany()
}

async function getUserActivities(userId: number) {
    return prisma.activityRegistration.findMany({
        where: { userId },
        select: { activityId: true }
    })
}

async function create({ userId, activityId }: CreateActivitySignupParams) {
    return prisma.activityRegistration.create({
        data: {
            userId: userId,
            activityId: activityId
        },
    });
}

export const activitiesRepository = {
    getActivities,
    getRegistrations,
    create
};
