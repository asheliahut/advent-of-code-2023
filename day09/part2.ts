// read the input from puzzleInput.txt
// Advent of Code 2023 day 9 part 2

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

// Begin day 9 part 2 code

const extrapolatePastValue = (history: number[]): number => {
  let diffs: number[][] = [history];
  let currentArray: number[] = history;
  let nextArray: number[] = [];

  while (!currentArray.every((value) => value === 0)) {
    for (let i = 0; i < currentArray.length - 1; i++) {
      nextArray.push(currentArray[i + 1] - currentArray[i]);
    }

    diffs.push(nextArray);
    currentArray = nextArray;
    nextArray = [];
  }

  let prevValue = 0;

  for (let i = diffs.length - 1; i >= 0; i--) {
    prevValue = diffs[i].at(0)! - prevValue;
  }

  return prevValue;
};

const histories: number[][] = lines.map((line) => {
  const history = line.split(" ").map((value) => parseInt(value));
  return history;
});

let sum: number = 0;
for (const hist of histories) {
  sum += extrapolatePastValue(hist);
}

output = sum.toString();

console.log(output);
await writeOutput(output);
