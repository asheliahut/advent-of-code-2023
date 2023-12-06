// read the input from puzzleInput.txt
// Advent of Code 2023 day 6 part 1

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

// Begin day 6 part 1 code

let times = lines[0]
  .split(":")[1]
  .trim()
  .split(" ")
  .filter((x) => x !== "")
  .map((x) => parseInt(x));
let distances = lines[1]
  .split(":")[1]
  .trim()
  .split(" ")
  .filter((x) => x !== "")
  .map((x) => parseInt(x));

const possibleWaysToWin: number[] = [];

for (let i = 0; i < times.length; i++) {
  // time is the limit of the race
  let time = times[i];
  // distance is the max distance the toy boat has to beat
  let distance = distances[i];
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

  possibleWaysToWin.push(waysToWin);
}

// multiply the possible ways to win together
let total = possibleWaysToWin.reduce((product, number) => product * number, 1);

output = total.toString();

console.log(output);
await writeOutput(output);
