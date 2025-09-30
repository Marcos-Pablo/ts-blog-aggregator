import { readConfig } from 'src/config';
import { getUsers, getUserByName, createUser } from 'src/lib/db/queries/users';
import { setUser } from '../config';

export async function handleRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0];
  const userExists = await getUserByName(name);

  if (userExists) {
    throw new Error(`User ${name} already exists`);
  }

  const user = await createUser(name);
  setUser(user.name);
  console.log('User created successfully!');
}

export async function handleGetUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();
  for (const user of users) {
    console.log(`${user.name} ${user.name === config.currentUserName ? '(current)' : ''}`);
  }
}

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
