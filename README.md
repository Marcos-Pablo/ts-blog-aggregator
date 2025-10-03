# TS Blog Aggregator

A TypeScript-powered blog aggregator that lets users follow feeds, browse posts, and manage subscriptions. Built with Drizzle ORM and designed for extensibility.

## Features

- **Feed Management:** Add, list, and remove RSS/Atom feeds.
- **User Subscriptions:** Users can follow or unfollow feeds.
- **Post Aggregation:** Bulk import posts from feeds, with upsert support for duplicates.
- **Browse Posts:** View recent posts from feeds a user follows.
- **Command-Line Interface:** Interact with the aggregator using simple commands.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (or compatible SQL database)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/ts-blog-aggregator.git
   cd ts-blog-aggregator
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your database:
   - Create a .gatorconfig.json file at home-dir with your database connection string:
     ```
     "db_url": "postgres://example"
     ```
   - Run migrations:
     ```sh
     npm run migrate
     ```

### Usage

#### Register a User

```sh
npm run start register <username>
```

#### Login

```sh
npm run start login <username>
```

#### Reset the database

```sh
npm run start reset
```

#### List Users

```sh
npm run start users
```

#### Aggregate Posts

```sh
npm run start agg <time_between_reqs>
```

#### Add a Feed

```sh
npm run start addfeed <feed-name> <url>
```

#### List Feeds

```sh
npm run start feeds
```

#### Follow a Feed

```sh
npm run start follow <url>
```

#### Unfollow a Feed

```sh
npm run start unfollow <url>
```

#### List Followed Feeds

```sh
npm run start following
```

#### Browse Posts

```sh
npm run start browse
```

Lists recent posts from feeds the user follows.

## Development

- All source code is in TypeScript.
- Database schema and migrations are managed with Drizzle ORM.
- Extend commands or add new features by editing the CLI and schema files.
