import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

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
    await prisma.activityRegistration.deleteMany({});
    await prisma.activity.deleteMany({});
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

    await prisma.activity.createMany({
        data: [
            { name: "Zumba Dance", location: "Fitness Center", capacity: 18, startTime: "2023-10-31 13:00:00", endTime: "2023-10-31 14:00:00" },
            { name: "Yoga Class", location: "Fitness Center", capacity: 25, startTime: "2023-10-31 15:00:00", endTime: "2023-10-31 16:00:00" },
            { name: "Digital Art Workshop", location: "Art Studio", capacity: 11, startTime: "2023-10-31 13:00:00", endTime: "2023-10-31 15:00:00" },
            { name: "Painting Workshop", location: "Art Studio", capacity: 15, startTime: "2023-10-31 15:00:00", endTime: "2023-10-31 16:00:00" },
            { name: "Coding Bootcamp", location: "Tech Hub", capacity: 7, startTime: "2023-10-31 13:00:00", endTime: "2023-10-31 14:00:00" },
            { name: "Coding Bootcamp", location: "Tech Hub", capacity: 12, startTime: "2023-10-31 14:00:00", endTime: "2023-10-31 15:00:00" },
            { name: "Pilates Class", location: "Fitness Center", capacity: 14, startTime: "2023-10-30 13:00:00", endTime: "2023-10-30 14:00:00" },
            { name: "Zumba Dance", location: "Fitness Center", capacity: 8, startTime: "2023-10-31 14:00:00", endTime: "2023-10-31 15:00:00" },
            { name: "Pilates Class", location: "Fitness Center", capacity: 11, startTime: "2023-10-30 15:00:00", endTime: "2023-10-30 16:00:00" },
            { name: "Photography Workshop", location: "Art Studio", capacity: 18, startTime: "2023-10-30 14:00:00", endTime: "2023-10-30 16:00:00" },
            { name: "Painting Workshop", location: "Art Studio", capacity: 13, startTime: "2023-10-30 13:00:00", endTime: "2023-10-30 14:00:00" },
            { name: "Robotics Class", location: "Tech Hub", capacity: 17, startTime: "2023-10-30 13:00:00", endTime: "2023-10-30 15:00:00" },
            { name: "Excel Workshop", location: "Tech Hub", capacity: 10, startTime: "2023-10-30 16:00:00", endTime: "2023-10-30 17:00:00" },
        ]
    })

    const user = await prisma.user.create({
        data: {
            email: "email@email.com",
            password: "123456"
        },
    });

    const act1 = await prisma.activity.create({
        data: { name: "Excel Workshop", location: "Tech Hub", capacity: 1, startTime: "2023-10-30 15:00:00", endTime: "2023-10-30 16:00:00" },
    })
    const act2 = await prisma.activity.create({
        data: { name: "Bodybuilding Workshop", location: "Fitness Center", capacity: 1, startTime: "2023-10-30 16:00:00", endTime: "2023-10-30 18:00:00" },
    })
    const act3 = await prisma.activity.create({
        data: { name: "Coding Bootcamp", location: "Tech Hub", capacity: 1, startTime: "2023-10-31 15:00:00", endTime: "2023-10-31 16:00:00" },
    })

    await prisma.activityRegistration.createMany({
        data: [
            { userId: user.id, activityId: act1.id, createdAt: new Date(), updatedAt: new Date() },
            { userId: user.id, activityId: act2.id, createdAt: new Date(), updatedAt: new Date() },
            { userId: user.id, activityId: act3.id, createdAt: new Date(), updatedAt: new Date() },
        ]
    })

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
