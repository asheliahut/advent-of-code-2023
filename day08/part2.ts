// read the input from puzzleInput.txt
// Advent of Code 2023 day 8 part 2

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

// Begin day 8 part 2 code
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

function getStartingLocations(map: Map<string, [string, string]>): string[] {
  const startingLocations: string[] = [];
  map.forEach((value, key) => {
    if (key.endsWith("A")) {
      startingLocations.push(key);
    }
  });
  return startingLocations;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

const lrInstructions = lines[0].split("");
const lrInstructionsLength = lrInstructions.length;
const linesMinusInstructions = lines.slice(2);

const map = createMapFromLines(linesMinusInstructions);
let startingLocations = getStartingLocations(map);

let cycleLengths: number[] = [];

for (let start of startingLocations) {
  let steps = 0;
  let currentLocation = start;
  while (!currentLocation.endsWith("Z")) {
    const [left, right] = map.get(currentLocation) as [string, string];
    currentLocation =
      lrInstructions[steps % lrInstructionsLength] === "L" ? left : right;
    steps++;
  }
  cycleLengths.push(steps);
}

let totalSteps = cycleLengths.reduce(lcm);

output = totalSteps.toString();

console.log(output);
await writeOutput(output);
