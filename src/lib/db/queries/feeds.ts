import { eq } from 'drizzle-orm';
import { db } from '..';
import { feeds, users } from '../schema';

export async function addFeed(feedName: string, url: string, userId: string) {
  const [createdFeed] = await db.insert(feeds).values({ name: feedName, url, userId }).returning();
  return createdFeed;
}

export async function getFeeds() {
  const result = await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id));
  return result;
}
