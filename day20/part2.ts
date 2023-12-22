// read the input from puzzleInput.txt
// Advent of Code 2023 day 20 part 2

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  // return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 20 part 2 code

console.log(output);
await writeOutput(output);
