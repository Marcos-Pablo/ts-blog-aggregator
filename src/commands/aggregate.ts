import { getNextFeedToFetch, markFeedFetched } from 'src/lib/db/queries/feeds';
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
}

function handleError(err: unknown) {
  console.log(`Error scraping feeds: ${err instanceof Error ? err.message : 'Unknown error'}`);
}
