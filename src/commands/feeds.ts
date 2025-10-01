import { createFeedFollow } from 'src/lib/db/queries/feed-follows';
import { addFeed, getFeeds } from 'src/lib/db/queries/feeds';
import { Feed, User } from 'src/lib/db/schema';
import { fetchFeed } from 'src/lib/rss';
import { printFeedFollow } from './feed-follows';

export async function handleAggregate(_: string) {
  const feedUrl = 'https://www.wagslane.dev/index.xml';
  const feedData = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feedData, null, 2));
}

export async function handleGetFeeds(_: string) {
  const result = await getFeeds();

  if (result.length === 0) {
    console.log('No feeds found.');
    return;
  }

  console.log(`Found ${result.length} feeds:`);
  for (const { users, feeds } of result) {
    printFeed(feeds, users);
    console.log(`=====================================`);
  }
}

export async function handleAddFeed(cmdName: string, user: User, ...args: string[]) {
  const feedName = args[0];
  const url = args[1];

  if (!feedName || !url) {
    throw new Error(`usage: ${cmdName} <feed-name> <url>`);
  }

  const feed = await addFeed(feedName, url, user.id);

  if (!feed) {
    throw new Error('Failed to create feed');
  }

  const feedFollow = await createFeedFollow(feed.id, user.id);
  console.log('Feed created successfully:');
  printFeed(feed, user);
  printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
