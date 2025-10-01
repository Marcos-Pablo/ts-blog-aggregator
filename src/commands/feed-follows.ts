import { createFeedFollow, getFeedFollowsForUser } from 'src/lib/db/queries/feed-follows';
import { getFeedByUrl } from 'src/lib/db/queries/feeds';
import { User } from 'src/lib/db/schema';

export async function handleFollow(cmdName: string, user: User, ...args: string[]) {
  const url = args[0];

  if (!url) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const feed = await getFeedByUrl(url);

  if (!feed) {
    throw new Error(`Feed not found: ${url}`);
  }

  const feedFollow = await createFeedFollow(feed.id, user.id);

  if (!feedFollow) {
    throw new Error('Failed to follow the feed');
  }

  console.log('Feed followed successfully:');
  printFeedFollow(feedFollow.feedName, feedFollow.userName);
}

export async function handleListFeedFollows(_: string, user: User) {
  const following = await getFeedFollowsForUser(user.id);
  if (following.length === 0) {
    console.log('No feed follows found for this user.');
  }

  console.log(`Feed follows for user ${user.name}:`);
  for (const ff of following) {
    console.log(`* %s`, ff.feedName);
  }
}

export function printFeedFollow(userName: string, feedName: string) {
  console.log(`* User:          ${userName}`);
  console.log(`* Feed:          ${feedName}`);
}
