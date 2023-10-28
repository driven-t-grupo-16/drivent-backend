import { createClient } from 'redis';

export const DEFAULT_EXP = 1800;

const redis = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  console.log('Connecting to Redis...');
  await redis.connect();
})();

export default redis;
