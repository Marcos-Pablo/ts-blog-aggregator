import { CommandsRegistry, registerCommand, runCommand } from './commands/commands';
import { handlerLogin } from './commands/login-handler';
import { argv } from 'node:process';

function main() {
  const commandsRegistry: CommandsRegistry = {};
  registerCommand(commandsRegistry, 'login', handlerLogin);

  const input = argv.slice(2);
  if (input.length === 0) {
    console.log('usage: cli <command> [args...]');
    process.exit(1);
  }

  const cmdName = input[0];
  const args = input.slice(1);

  try {
    runCommand(commandsRegistry, cmdName, ...args);
  } catch (err) {
    console.log(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();
