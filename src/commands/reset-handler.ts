import { deleteUsers } from 'src/lib/db/queries/users';

export async function handleReset(_: string) {
  await deleteUsers();
  console.log('Database reset successfully!');
}
