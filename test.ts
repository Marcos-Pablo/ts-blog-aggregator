function main() {
  let factorial = 1;
  let aux = 0;
  let s = 0;
  for (let i = 1; i <= 5; i++) {
    aux++;
    factorial *= aux;
    aux++;
    factorial *= aux;
    s += i / factorial;
    console.log(`${i}/${factorial}`);
  }

  console.log('s = ', s);
}

main();
