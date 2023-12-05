// read the input from puzzleInput.txt
// advent of code 2023 day 2 part 2

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
let poweredSums: number = 0;

for (let line of lines) {
  const maxCubesPerColorMap = new Map<string, number>();
  maxCubesPerColorMap.set("red", 0);
  maxCubesPerColorMap.set("green", 0);
  maxCubesPerColorMap.set("blue", 0);

  const updateMaxCubesPerColorMap = (color: string, cubeCount: number) => {
    if (cubeCount > maxCubesPerColorMap.get(color)!) {
      maxCubesPerColorMap.set(color, cubeCount);
    }
  };

  const splitLine = line.split(": ")[1];
  const rounds = splitLine.split("; ");

  for (let round of rounds) {
    const cubeHandful = round.split(", ");

    for (let cubes of cubeHandful) {
      const splitCubes = cubes.split(" ");
      const color = splitCubes[1];
      const cubeCount = parseInt(splitCubes[0]);

      updateMaxCubesPerColorMap(color, cubeCount);
    }
  }
  poweredSums +=
    maxCubesPerColorMap.get("red")! *
    maxCubesPerColorMap.get("green")! *
    maxCubesPerColorMap.get("blue")!;
}

output = poweredSums.toString();

console.log(output);
await writeOutput(output);
