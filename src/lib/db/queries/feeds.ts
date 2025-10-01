import { eq } from 'drizzle-orm';
import { db } from '..';
import { feeds, users } from '../schema';

export async function addFeed(feedName: string, url: string, userId: string) {
  const [insertedFeed] = await db.insert(feeds).values({ name: feedName, url, userId }).returning();
  return insertedFeed;
}

export async function getFeeds() {
  const result = await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id));
  return result;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}
