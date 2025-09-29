import { CommandsRegistry, registerCommand, runCommand } from './commands/commands';
import { argv } from 'node:process';
import { handleRegister } from './commands/register-handler';
import { handleLogin } from './commands/login-handler';
import { handleReset } from './commands/reset-handler';

async function main() {
  const commandsRegistry: CommandsRegistry = {};
  registerCommand(commandsRegistry, 'login', handleLogin);
  registerCommand(commandsRegistry, 'register', handleRegister);
  registerCommand(commandsRegistry, 'reset', handleReset);

  const input = argv.slice(2);
  if (input.length === 0) {
    console.log('usage: cli <command> [args...]');
    process.exit(1);
  }

  const cmdName = input[0];
  const args = input.slice(1);

  try {
    await runCommand(commandsRegistry, cmdName, ...args);
  } catch (err) {
    console.log(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }

  process.exit(0);
}

main();
