import { Activity, TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, hotelRepository, ticketsRepository, activitiesRepository } from '@/repositories';

async function validateUser(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError(`You must finish enrolling!`);

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError(`You must purchase a ticket!`);

    if (ticket.status === TicketStatus.RESERVED) {
        throw cannotListHotelsError(`You must confirm payment before booking!`);
    }

    const type = ticket.TicketType;
    if (type.includesHotel) {
        const booking = await bookingRepository.findByUserId(userId);
        if (!booking) throw cannotListHotelsError(`You must book a room before continuing!`);
    }
}


async function getActivities(userId: number) {
    await validateUser(userId);

    const request = await activitiesRepository.getActivities();
    const registrations = await activitiesRepository.getRegistrations();

    const activities: { [day: string]: { [location: string]: Activity[] } } = {};

    request.forEach(activity => {
        const startDate = new Date(activity.startTime);
        const day = startDate.toISOString().split('T')[0];
        const location = activity.location;

        if (!activities[day]) {
            activities[day] = {};
        }
        if (!activities[day][location]) {
            activities[day][location] = [];
        }

        activities[day][location].push(activity);
    })

    return { activities, registrations };
}

async function signupActivity(userId: number, activityId: number) {
    await validateUser(userId);

    const activity = await activitiesRepository.create({ userId, activityId });

    return activity;
}


export const activitiesService = {
    getActivities,
    signupActivity
};
