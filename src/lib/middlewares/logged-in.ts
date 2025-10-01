import { CommandHandler, UserCommandHandler } from 'src/commands/commands';
import { readConfig } from 'src/config';
import { getUserByName } from '../db/queries/users';

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const config = readConfig();
    if (!config.currentUserName) {
      throw new Error('User not logged in');
    }

    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
