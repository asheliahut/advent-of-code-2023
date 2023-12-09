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
  const diffs: number[] = [history[0]!];
  let currentArray: number[] = history;
  let nextArray: number[] = [];

  while (!currentArray.every((value) => value === 0)) {
    for (let i = 0; i < currentArray.length - 1; i++) {
      nextArray.push(currentArray[i + 1] - currentArray[i]);
    }

    diffs.push(nextArray[0]);
    currentArray = nextArray;
    nextArray = [];
  }

  return diffs.reverse().reduce((prev, curr) => curr - prev);
};

const histories: number[][] = lines.map((line) => {
  const history = line.split(" ").map((value) => parseInt(value));
  return history;
});

output = histories
  .reduce((acc, curr) => acc + extrapolatePastValue(curr), 0)
  .toString();

console.log(output);
await writeOutput(output);
