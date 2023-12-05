// read the input from puzzleInput.txt
// advent of code 2023 day 1 part 1

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

let sum: number = 0;
for (let line of lines) {
  let firstDigit = 0;
  let lastDigit = 0;
  let tempSum: string = "";

  const matches = line.match(/\d/g);
  if (matches) {
    firstDigit = parseInt(matches[0]);
    lastDigit = parseInt(matches.at(-1)!);
  }

  tempSum = firstDigit.toString() + lastDigit.toString();
  sum += parseInt(tempSum);
}

output = sum.toString();

console.log(output);
await writeOutput(output);
