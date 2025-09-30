import { fetchFeed } from 'src/lib/rss';

export async function handleAggregate(_: string) {
  const feedUrl = 'https://www.wagslane.dev/index.xml';
  const feedData = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feedData, null, 2));
}
