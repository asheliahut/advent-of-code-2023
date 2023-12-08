// read the input from puzzleInput.txt
// Advent of Code 2023 day 8 part 1

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

// Begin day 8 part 1 code

function createMapFromLines(lines: string[]): Map<string, [string, string]> {
  const map = new Map<string, [string, string]>();
  lines.forEach((line) => {
    const keyValues = line.split(" = ");
    const key = keyValues[0];
    const values = keyValues[1].replace("(", "").replace(")", "").split(", ");
    map.set(key, values as [string, string]);
  });
  return map;
}

const lrInstructions = lines[0].split("");
const linesMinusInstructions = lines.slice(2);

const map = createMapFromLines(linesMinusInstructions);

let steps = 0;
let currentInstruction: string = "";
let currentLocation: string = "AAA";

while (currentLocation !== "ZZZ") {
  const [left, right] = map.get(currentLocation) as [string, string];
  currentInstruction = lrInstructions[steps % lrInstructions.length];
  if (currentInstruction === "L") {
    currentLocation = left;
  } else {
    currentLocation = right;
  }

  steps++;
}

output = steps.toString();

console.log(output);
await writeOutput(output);
