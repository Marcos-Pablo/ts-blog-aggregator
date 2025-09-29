import { readConfig } from 'src/config';
import { getUsers } from 'src/db/queries/users';

export async function handleGetUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();
  for (const user of users) {
    console.log(`${user.name} ${user.name === config.currentUserName ? '(current)' : ''}`);
  }
}
