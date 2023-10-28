import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import faker from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {

	await prisma.address.deleteMany({});
	await prisma.payment.deleteMany({});
	await prisma.ticket.deleteMany({});
	await prisma.ticketType.deleteMany({});
	await prisma.enrollment.deleteMany({});
	await prisma.event.deleteMany({});
	await prisma.session.deleteMany({});
	await prisma.booking.deleteMany({});
	await prisma.room.deleteMany({});
	await prisma.hotel.deleteMany({});
	await prisma.user.deleteMany({});
	

	const ticketTypes = await prisma.ticketType.createMany({
		data: [
			{ id: 1, name: 'Online', price: 100, isRemote: true, includesHotel: false, updatedAt: new Date() },
			{ id: 2, name: 'Presencial sem Hotel', price: 250, isRemote: false, includesHotel: false, updatedAt: new Date() },
			{ id: 3, name: 'Presencial com Hotel', price: 600, isRemote: false, includesHotel: true, updatedAt: new Date() },
		]
	});

	const hotel = await prisma.hotel.create({
		data: {
			name: faker.name.findName(),
			image: faker.image.imageUrl(),
		},
	});

	const hotel2 = await prisma.hotel.create({
		data: {
			name: faker.name.findName(),
			image: faker.image.imageUrl(),
		},
	});
	console.log(hotel);

	await prisma.room.createMany({
		data: [
			{ name: '113', capacity: 3, hotelId: hotel.id, updatedAt: new Date() },
			{ name: '212', capacity: 2, hotelId: hotel.id, updatedAt: new Date() },
			{ name: '311', capacity: 1, hotelId: hotel.id, updatedAt: new Date() },
			{ name: '111', capacity: 1, hotelId: hotel2.id, updatedAt: new Date() },
			{ name: '212', capacity: 2, hotelId: hotel2.id, updatedAt: new Date() },
		]
	})
	console.log(ticketTypes);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
