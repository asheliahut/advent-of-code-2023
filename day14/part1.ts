// read the input from puzzleInput.txt
// Advent of Code 2023 day 14 part 1

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

// Begin day 14 part 1 code

// O is a rounded rock
// # is a cube-shaped rock
// . is empty space

enum Tile {
  Empty = ".",
  Cube = "#",
  Rounded = "O",
}

function checkValueInArray(
  array: string[][],
  key1: number,
  key2: number,
): boolean {
  // Check if the key is within the bounds of the array
  if (
    key1 >= 0 &&
    key1 < array.length &&
    key2 >= 0 &&
    key2 < array[key1].length
  ) {
    return true;
  }

  return false;
}

class grid {
  grid: Tile[][] = [];

  constructor(lines: string[]) {
    for (let line of lines) {
      this.grid.push(line.split("") as Tile[]);
    }
  }

  public calculateLoadOnNorthSupportBeam() {
    const gridLength = this.grid.length;
    let totalLoad = 0;
    for (let i = 0; i < gridLength; i++) {
      const totalRoundedRocksPerRow = this.grid[i].filter(
        (tile) => tile === Tile.Rounded,
      ).length;
      totalLoad += totalRoundedRocksPerRow * (gridLength - i);
    }

    return totalLoad;
  }

  public rollRoundedRocksNorth() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === Tile.Rounded) {
          this.rollRoundedRockNorth(i, j);
        }
      }
    }
  }

  private rollRoundedRockNorth(i: number, j: number) {
    if (this.grid[i][j] !== Tile.Rounded) {
      return;
    }

    if (this.continueRollingRock(i, j)) {
      this.grid[i - 1][j] = Tile.Rounded;
      this.grid[i][j] = Tile.Empty;
      this.rollRoundedRockNorth(i - 1, j);
    }
  }

  private continueRollingRock(i: number, j: number) {
    if (checkValueInArray(this.grid, i - 1, j) === false) {
      return false;
    }
    if (
      this.grid[i - 1][j] === Tile.Cube ||
      this.grid[i - 1][j] === Tile.Rounded
    ) {
      return false;
    }

    return true;
  }
}

const g = new grid(lines);
g.rollRoundedRocksNorth();
output = g.calculateLoadOnNorthSupportBeam().toString();

console.log(output);
await writeOutput(output);
