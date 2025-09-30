import { readConfig } from 'src/config';
import { addFeed } from 'src/lib/db/queries/feeds';
import { getUserByName } from 'src/lib/db/queries/users';
import { Feed, User } from 'src/lib/db/schema';
import { fetchFeed } from 'src/lib/rss';

export async function handleAggregate(_: string) {
  const feedUrl = 'https://www.wagslane.dev/index.xml';
  const feedData = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feedData, null, 2));
}

export async function handleAddFeed(cmdName: string, ...args: string[]) {
  const feedName = args[0];
  const url = args[1];

  if (!feedName || !url) {
    throw new Error(`usage: ${cmdName} <feed-name> <url>`);
  }
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feed = await addFeed(feedName, url, user.id);

  if (!feed) {
    throw new Error('Failed to create feed');
  }

  console.log('Feed created successfully:');
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
