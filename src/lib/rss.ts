import { XMLParser } from 'fast-xml-parser';

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string) {
  const response = await fetch(feedUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'gator',
      accept: 'application/rss+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser();
  const result = parser.parse(xml);

  const channel = result?.rss?.channel;

  if (!channel || !channel.title || !channel.link || !channel.description || !channel.item) {
    throw new Error('Failed to parse channel');
  }

  const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

  const rssItems: RSSItem[] = items.reduce((acc: RSSItem[], curr: any) => {
    if (!curr || !curr.title || !curr.link || !curr.description || !curr.pubDate) {
      return acc;
    }
    acc.push({
      title: curr.title,
      link: curr.link,
      description: curr.description,
      pubDate: curr.pubDate,
    });
    return acc;
  }, []);

  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rssFeed;
}
