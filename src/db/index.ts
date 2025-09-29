import { drizzle } from 'drizzle-orm/postgres-js';
import postgress from 'postgres';
import { readConfig } from 'src/config';
import * as schema from './schema';

const config = readConfig();
const conn = postgress(config.dbUrl);
export const db = drizzle(conn, { schema });
