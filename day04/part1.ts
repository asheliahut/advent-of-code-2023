// read the input from puzzleInput.txt
// Advent of Code 2023 day 4 part 1

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

// Begin day 4 part 1 code
let grandTotal: number = 0;

for (let line of lines) {
  // split out after the :
  const winningNumbers = new Set<number>();
  const numbersIHave = new Set<number>();
  const splitLine = line.split(":");
  // get the card number from Card 4:
  //const cardNumber = parseInt(splitLine[0].split(" ")[1]);
  const numbers = splitLine[1].trim().split("|");

  const winningNumbersString = numbers[0]
    .trim()
    .split(" ")
    .filter((number) => number !== "");
  console.log(`winningNumbersString: ${winningNumbersString}`);
  for (let winningNumber of winningNumbersString) {
    winningNumbers.add(parseInt(winningNumber));
  }

  const numbersIHaveString = numbers[1]
    .trim()
    .split(" ")
    .filter((number) => number !== "");
  console.log(`numbersIHaveString: ${numbersIHaveString}`);
  for (let numberIHave of numbersIHaveString) {
    numbersIHave.add(parseInt(numberIHave));
  }

  // get the number of numbers I have that are in the winning numbers
  let matchingNumbers = 0;
  for (let number of numbersIHave) {
    if (winningNumbers.has(number)) {
      matchingNumbers++;
    }
  }

  // create a total that is 1 point for the first match and then doubled for each match after
  if (matchingNumbers === 0) {
    continue;
  }
  let total = 1;
  for (let i = 1; i < matchingNumbers; i++) {
    total *= 2;
  }

  grandTotal += total;
}

output = grandTotal.toString();

console.log(output);
await writeOutput(output);
