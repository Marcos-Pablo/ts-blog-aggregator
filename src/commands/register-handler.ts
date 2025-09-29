import { setUser } from 'src/config';
import { createUser, getUserByName } from 'src/db/queries/users';

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
