import { CreateActivitySignupParams } from '@/protocols';
import { prisma } from '@/config';

async function getActivities() {
    return prisma.activity.findMany({
        orderBy: { startTime: 'asc' }
    });
}

async function getUnique(activityId: number) {
    return prisma.activity.findUnique({
        where: {
            id: activityId
        },
        include: {
            ActivityRegistration: {
                select: {
                    id: true
                },
                where: {
                    activityId: activityId
                }
            }
        }
    })
}

async function getRegistrations() {
    return prisma.activityRegistration.findMany()
}

async function getUserActivities(userId: number) {
    return prisma.activityRegistration.findMany({
        where: { userId },
        include: { Activity: true }
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
    getUserActivities,
    getUnique,
    create
};
