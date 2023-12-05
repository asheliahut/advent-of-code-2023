// read the input from puzzleInput.txt
// advent of code 2023 day 2 part 1

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

// create a map of max number of cubes per color
const maxCubesPerColorMap = new Map<string, number>();
maxCubesPerColorMap.set("red", 12);
maxCubesPerColorMap.set("green", 13);
maxCubesPerColorMap.set("blue", 14);

const input = await readInput();
const lines = input.split("\n");
let output: string = "";
let sumOfPossibleGames: number = 0;

for (let line of lines) {
  let continueGame = true;
  const gameNumber: number = parseInt(line.match(/\d+/)![0]);

  // split the line into a new string after the first occurance of : space
  const splitLine = line.split(": ")[1];

  // split the new string into an array of strings after the first occurance of ;
  const rounds = splitLine.split("; ");

  for (let round of rounds) {
    const cubeHandful = round.split(", ");

    if (!continueGame) {
      break;
    }

    for (let cubes of cubeHandful) {
      const splitCubes = cubes.split(" ");
      const color = splitCubes[1];
      const cubeCount = parseInt(splitCubes[0]);

      if (cubeCount > maxCubesPerColorMap.get(color)!) {
        continueGame = false;
        break;
      }
    }
  }

  if (continueGame) {
    sumOfPossibleGames += gameNumber;
  }
}

output = sumOfPossibleGames.toString();

console.log(output);
await writeOutput(output);
