// read the input from puzzleInput.txt
// Advent of Code 2023 day 9 part 1

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

// Begin day 9 part 1 code

const extrapolateNextValue = (history: number[]): number => {
  const diffs: number[][] = [history];
  let currentArray: number[] = history;
  let nextArray: number[] = [];

  if (currentArray.every((value) => value === 0)) {
    console.log("edge case");
    return 0;
  }
  while (!currentArray.every((value) => value === 0)) {
    for (let i = 0; i < currentArray.length - 1; i++) {
      nextArray.push(currentArray[i + 1] - currentArray[i]);
    }

    diffs.push(nextArray);
    currentArray = nextArray;
    nextArray = [];
  }

  let nextValue = 0;
  for (const diff of diffs) {
    nextValue += diff.at(-1)!;
  }

  return nextValue;
};

const histories: number[][] = lines.map((line) => {
  const history = line.split(" ").map((value) => parseInt(value));
  return history;
});

let sum: number = 0;
for (const hist of histories) {
  sum += extrapolateNextValue(hist);
}

output = sum.toString();

console.log(output);
await writeOutput(output);
