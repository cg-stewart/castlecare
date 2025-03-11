import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function saveApplication(userId: string, applicationData: any) {
  await redis.set(`application:${userId}`, JSON.stringify(applicationData));
}

export async function getApplication(userId: string) {
  const application = await redis.get(`application:${userId}`);
  return application ? JSON.parse(application as string) : null;
}
