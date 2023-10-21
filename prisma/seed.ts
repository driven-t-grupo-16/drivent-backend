import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

  await prisma.ticketType.deleteMany();

  const ticketTypes = await prisma.ticketType.createMany({
    data: [
      {id: 1, name: 'Online', price: 100, isRemote: true, includesHotel: false, updatedAt: new Date()},
      {id: 2, name: 'Presencial sem Hotel', price: 250, isRemote: false, includesHotel: false, updatedAt: new Date()},
      {id: 3, name: 'Presencial com Hotel', price: 600, isRemote: false, includesHotel: true, updatedAt: new Date()},
    ]
  });

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
