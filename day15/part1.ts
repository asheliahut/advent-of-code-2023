// read the input from puzzleInput.txt
// Advent of Code 2023 day 15 part 1

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
const line = input.split(",");
let output: string = "";

// Begin day 15 part 1 code

function getHashValue(chars: string[]): number {
  let currentValue = 0;
  chars.forEach((char) => {
    const asciiCodeOfChar = char.charCodeAt(0);
    currentValue += asciiCodeOfChar;
    currentValue *= 17;
    currentValue %= 256;
  });
  return currentValue;
}

let total = 0;
line.forEach((str: string) => {
  const chars = str.split("");
  const hashValue = getHashValue(chars);
  total += hashValue;
});

console.log(getHashValue("qp".split("")));

output = total.toString();

console.log(output);
await writeOutput(output);
