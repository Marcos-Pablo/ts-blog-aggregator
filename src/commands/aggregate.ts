import { getNextFeedToFetch, markFeedFetched } from 'src/lib/db/queries/feeds';
import { bulkCreatePosts } from 'src/lib/db/queries/posts';
import { NewPost } from 'src/lib/db/schema';
import { fetchFeed } from 'src/lib/rss';
import { parseDuration } from 'src/lib/utils';

export async function handleAggregate(cmdName: string, ...args: string[]) {
  const timeArg = args[0];
  if (!timeArg) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenRequests = parseDuration(timeArg);
  console.log(`Collecting feeds every ${timeArg}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      console.log('Shutting down feed aggregator...');
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log('No feeds to fetch');
    return;
  }

  console.log('Found a feed to fetch!');
  await markFeedFetched(feed.id);
  const feedData = await fetchFeed(feed.url);

  console.log(`Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`);
  if (feedData.channel.item.length === 0) {
    return;
  }

  const bulkInsert = feedData.channel.item.map(
    (postData) =>
      ({
        title: postData.title,
        url: postData.link,
        description: postData.description,
        publishedAt: new Date(postData.pubDate),
        feedId: feed.id,
      }) satisfies NewPost,
  );

  const result = await bulkCreatePosts(bulkInsert);

  if (!result) {
    console.log(`Failed to save posts from feed ${feed.name}`);
  }
}

function handleError(err: unknown) {
  console.log(`Error scraping feeds: ${err instanceof Error ? err.message : 'Unknown error'}`);
}
