import { db } from '..';
import { feeds } from '../schema';

export async function addFeed(feedName: string, url: string, userId: string) {
  const [createdFeed] = await db.insert(feeds).values({ name: feedName, url, userId }).returning();
  return createdFeed;
}
