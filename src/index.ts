import { readConfig, setUser } from './config';

function main() {
  setUser('Marcos');
  const config = readConfig();

  console.log(config);
}

main();
