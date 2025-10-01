import { readConfig } from 'src/config';
import { createFeedFollow, getFeedFollowsForUser } from 'src/lib/db/queries/feed-follows';
import { getFeedByUrl } from 'src/lib/db/queries/feeds';
import { getUserByName } from 'src/lib/db/queries/users';

export async function handleFollow(cmdName: string, ...args: string[]) {
  const url = args[0];
  const config = readConfig();

  if (!url) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const [user, feed] = await Promise.all([getUserByName(config.currentUserName), getFeedByUrl(url)]);

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

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

export async function handleListFeedFollows(_: string) {
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);

  if (!user) {
    throw new Error(`${config.currentUserName} not found`);
  }

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
