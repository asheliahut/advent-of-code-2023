// read the input from puzzleInput.txt
// Advent of Code 2023 day 11 part 1

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

// Begin day 11 part 1 code
function computeManhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const twoDArray = lines.map((line) => line.split(""));

const expandedGalaxy: string[][] = [];

// loop over columns and find all colums where all values are "."
// if they are add a new column to the left of the current column of all "."
// this should add a new element to each row for each column
// all rows should have the same number of columns
for (let i = 0; i < twoDArray[0].length; i++) {
  let allEmpty = true;
  for (let j = 0; j < twoDArray.length; j++) {
    if (twoDArray[j][i] !== ".") {
      allEmpty = false;
      break;
    }
  }

  if (allEmpty) {
    for (let j = 0; j < twoDArray.length; j++) {
      twoDArray[j].splice(i, 0, "."); // Insert at index 'i'
    }
    i++;
  }
}

// loop over rows and find all rows where all values are "."
// if they are add a new row below of all "."
for (let i = 0; i < twoDArray.length; i++) {
  if (twoDArray[i].every((value) => value === ".")) {
    expandedGalaxy.push(Array(twoDArray[i].length).fill("."));
  }

  expandedGalaxy.push(twoDArray[i]);
}

// loop over the expanded galaxy and get the pairs of # galaxies
// replace every # with a number
const mapOfGalaxies: Map<number, [number, number]> = new Map();

let galaxySeen: number = 1;
for (let i = 0; i < expandedGalaxy.length; i++) {
  for (let j = 0; j < expandedGalaxy[i].length; j++) {
    if (expandedGalaxy[i][j] === "#") {
      expandedGalaxy[i][j] = galaxySeen.toString();
      mapOfGalaxies.set(galaxySeen, [i, j]);
      galaxySeen++;
    }
  }
}

// get all possible pairs of galaxies from number of galaxies seen
const galaxyPairs: Set<[number, number]> = new Set();
for (let i = 1; i < galaxySeen; i++) {
  for (let j = i + 1; j < galaxySeen; j++) {
    galaxyPairs.add([i, j]);
  }
}

let minDistanceSum = 0;

for (const pair of galaxyPairs) {
  const [galaxy1, galaxy2] = pair;
  const galaxy1Location = mapOfGalaxies.get(galaxy1)!;
  const galaxy2Location = mapOfGalaxies.get(galaxy2)!;
  minDistanceSum += computeManhattanDistance(
    galaxy1Location[0],
    galaxy1Location[1],
    galaxy2Location[0],
    galaxy2Location[1],
  );
}

output = minDistanceSum.toString();

console.log(output);
await writeOutput(output);
