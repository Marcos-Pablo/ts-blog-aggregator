import { getUserByName } from 'src/db/queries/users';
import { setUser } from '../config';

export async function handleLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0];
  const user = await getUserByName(name);
  if (!user) {
    throw new Error(`User ${name} not found`);
  }
  setUser(name);
  console.log('User switched successfully!');
}
