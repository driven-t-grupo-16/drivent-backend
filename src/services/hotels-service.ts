import { TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError(`You must finish enrolling!`);

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError(`You must purchase a ticket!`);

    const type = ticket.TicketType;

    if (type.isRemote || !type.includesHotel) {
        throw cannotListHotelsError(`Your ticket doesn't require a hotel!`);
    }
    if (ticket.status === TicketStatus.RESERVED) {
        throw cannotListHotelsError(`You must confirm payment before booking!`);
    }
}

async function getHotels(userId: number) {
    await validateUserBooking(userId);

    const hotels = await hotelRepository.findHotels();
    if (hotels.length === 0) throw notFoundError();

    const booking = await bookingRepository.findByUserId(userId);

    return { hotels, booking };
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
    await validateUserBooking(userId);

    if (!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId');

    const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);
    if (!hotelWithRooms) throw notFoundError();

    return hotelWithRooms;
}

export const hotelsService = {
    getHotels,
    getHotelsWithRooms,
};
