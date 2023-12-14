// read the input from puzzleInput.txt
// Advent of Code 2023 day 14 part 2

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

// Begin day 14 part 2 code

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

class Grid {
  grid: Tile[][];

  constructor(lines: string[]) {
    this.grid = lines.map((line) => line.split("") as Tile[]);
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

  public simulateRoundedRocksMovement(iterations: number) {
    const [initialAmountBeforeCycle, cycleLength] = this.detectCycleLength();
    if (cycleLength > 0) {
      let iterationsMinusInitialAmount = iterations - initialAmountBeforeCycle;
      const remainingIterations = iterationsMinusInitialAmount % cycleLength;
      for (let i = 0; i < remainingIterations; i++) {
        this.rollRoundedRocks();
      }
    } else {
      for (let i = 0; i < iterations; i++) {
        this.rollRoundedRocks();
      }
    }
  }

  private rollRoundedRocks() {
    this.rollRoundedRocksNorth();
    this.rollRoundedRocksWest();
    this.rollRoundedRocksSouth();
    this.rollRoundedRocksEast();
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

  public rollRoundedRocksSouth() {
    for (let i = this.grid.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === Tile.Rounded) {
          this.rollRoundedRockSouth(i, j);
        }
      }
    }
  }

  public rollRoundedRocksEast() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = this.grid[i].length - 1; j >= 0; j--) {
        if (this.grid[i][j] === Tile.Rounded) {
          this.rollRoundedRockEast(i, j);
        }
      }
    }
  }

  public rollRoundedRocksWest() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === Tile.Rounded) {
          this.rollRoundedRockWest(i, j);
        }
      }
    }
  }

  private rollRoundedRockNorth(i: number, j: number) {
    if (this.continueRollingRock(i, j, "n")) {
      this.grid[i - 1][j] = Tile.Rounded;
      this.grid[i][j] = Tile.Empty;
      this.rollRoundedRockNorth(i - 1, j);
    }
  }

  private rollRoundedRockSouth(i: number, j: number) {
    if (this.continueRollingRock(i, j, "s")) {
      this.grid[i + 1][j] = Tile.Rounded;
      this.grid[i][j] = Tile.Empty;
      this.rollRoundedRockSouth(i + 1, j);
    }
  }

  private rollRoundedRockEast(i: number, j: number) {
    if (this.continueRollingRock(i, j, "e")) {
      this.grid[i][j + 1] = Tile.Rounded;
      this.grid[i][j] = Tile.Empty;
      this.rollRoundedRockEast(i, j + 1);
    }
  }

  private rollRoundedRockWest(i: number, j: number) {
    if (this.continueRollingRock(i, j, "w")) {
      this.grid[i][j - 1] = Tile.Rounded;
      this.grid[i][j] = Tile.Empty;
      this.rollRoundedRockWest(i, j - 1);
    }
  }

  private continueRollingRock(
    i: number,
    j: number,
    direction: "n" | "s" | "e" | "w",
  ) {
    if (direction === "n" && checkValueInArray(this.grid, i - 1, j) === false) {
      return false;
    } else if (
      direction === "s" &&
      checkValueInArray(this.grid, i + 1, j) === false
    ) {
      return false;
    } else if (
      direction === "e" &&
      checkValueInArray(this.grid, i, j + 1) === false
    ) {
      return false;
    } else if (
      direction === "w" &&
      checkValueInArray(this.grid, i, j - 1) === false
    ) {
      return false;
    }

    switch (direction) {
      case "n":
        if (
          this.grid[i - 1][j] === Tile.Cube ||
          this.grid[i - 1][j] === Tile.Rounded
        ) {
          return false;
        }
        break;
      case "s":
        if (
          this.grid[i + 1][j] === Tile.Cube ||
          this.grid[i + 1][j] === Tile.Rounded
        ) {
          return false;
        }
        break;
      case "e":
        if (
          this.grid[i][j + 1] === Tile.Cube ||
          this.grid[i][j + 1] === Tile.Rounded
        ) {
          return false;
        }
        break;
      case "w":
        if (
          this.grid[i][j - 1] === Tile.Cube ||
          this.grid[i][j - 1] === Tile.Rounded
        ) {
          return false;
        }
        break;
    }

    return true;
  }

  private detectCycleLength(): [number, number] {
    const history = new Set<string>();
    const historyMap = new Map<string, number>();
    let cycleDetected = false;
    let cycleLength = 0;
    let initialAmountBeforeCycle = 0;

    while (!cycleDetected && cycleLength < 100_000) {
      // Limit iterations to avoid infinite loop
      const state = this.stringifyGrid();

      if (history.has(state)) {
        cycleDetected = true;
        initialAmountBeforeCycle = historyMap.get(state)!;
        cycleLength = cycleLength - initialAmountBeforeCycle;
      } else {
        history.add(state);
        historyMap.set(state, cycleLength);
        this.rollRoundedRocks();
        cycleLength++;
      }
    }

    return cycleDetected ? [initialAmountBeforeCycle, cycleLength] : [0, 0];
  }

  private stringifyGrid(): string {
    return this.grid.map((row) => row.join("")).join("\n");
  }
}

const g = new Grid(lines);
g.simulateRoundedRocksMovement(1_000_000_000);

output = g.calculateLoadOnNorthSupportBeam().toString();

console.log(output);
await writeOutput(output);
