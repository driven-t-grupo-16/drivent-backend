import { CreateBookingParams, UpdateBookingParams } from '@/protocols';
import { prisma } from '@/config';

async function create({ roomId, userId }: CreateBookingParams) {
  return prisma.booking.create({
    data: { roomId, userId },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
    include: { Room: true },
  });
}

async function findByUserId(userId: number) {
  const booking = await prisma.booking.findFirst({
    where: { userId },
    include: { Room: { include: { Hotel: true } } },
  });

  if (!booking) return null;
  const roomId = booking.Room.id;

  const others = prisma.booking.findMany({
    where: { roomId, userId: { not: userId } },
    include: { User: true },
  });

  return { booking, others };
}

async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  return prisma.booking.upsert({
    where: { id },
    create: { roomId, userId },
    update: { roomId },
  });
}

export const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
};
