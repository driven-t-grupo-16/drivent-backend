import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '@/config';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import redis, { DEFAULT_EXP } from '@/config/redis';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKeyEvent = 'event';
  const cachedKey = await redis.get(cacheKeyEvent);
  if (cachedKey) {
    return JSON.parse(cachedKey);
  } else {
    let event = await eventRepository.findFirst();
    if (!event) {
      event = await prisma.event.create({
        data: {
          title: 'Driven.t',
          logoImageUrl: 'https://files.driven.com.br/images/logo-rounded.png',
          backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
          startsAt: dayjs().toDate(),
          endsAt: dayjs().add(21, 'days').toDate(),
        },
      });
    }
    const cacheData = exclude(event, 'createdAt', 'updatedAt');
    redis.setEx(cacheKeyEvent, DEFAULT_EXP, JSON.stringify(cacheData));
    return cacheData;
  }
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

export const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};
