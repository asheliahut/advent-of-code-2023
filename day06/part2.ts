// read the input from puzzleInput.txt
// Advent of Code 2023 day 6 part 2

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

// Begin day 6 part 2 code

// time is the limit of the race
let time = parseInt(lines[0].split(":")[1].trim().replaceAll(" ", ""));
// distance is the max distance the toy boat has to beat
let distance = parseInt(lines[1].split(":")[1].trim().replaceAll(" ", ""));
let waysToWin = 0;

for (let j = 0; j < time; j++) {
  // Calculate the distance the boat will travel
  // Speed increases by 1 mm/ms for each ms the button is held
  let speed = j;
  // Remaining time after the button is released
  let travelTime = time - j;
  let boatDistance = speed * travelTime;

  if (boatDistance > distance) {
    waysToWin++;
  }
}

output = waysToWin.toString();

console.log(output);
await writeOutput(output);
