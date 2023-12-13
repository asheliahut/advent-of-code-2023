// read the input from puzzleInput.txt
// Advent of Code 2023 day 12 part 2

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  //return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

// Begin day 12 part 2 code

class HotSpringGrid {
  public grid: HotSpringRow[] = [];

  constructor(grid: HotSpringRow[]) {
    this.grid = grid;
  }

  public getArrangementsPossible(): number {
    let total = 0;
    for (let i = 0; i < this.grid.length; i++) {
      const rowPossibleArrangements = this.grid[i].getArrangementsPossible();
      console.log(rowPossibleArrangements);
      total += rowPossibleArrangements;
    }
    return total;
  }
}

class HotSpringRow {
  public possibleArrangementOfDamaged: number[] = [];
  public brokenRow: string = "";
  private memo: Map<string, number> = new Map();

  constructor(row: string) {
    this.brokenRow = row.split(" ")[0];
    const initialBrokenRow = this.brokenRow;
    for (let i = 0; i < 4; i++) {
      this.brokenRow = this.brokenRow.concat("?" + initialBrokenRow);
    }
    console.log(this.brokenRow);
    this.possibleArrangementOfDamaged = row
      .split(" ")[1]
      .split(",")
      .map((x) => parseInt(x));

    const initialPossibleArrangementOfDamaged =
      this.possibleArrangementOfDamaged;

    for (let i = 0; i < 4; i++) {
      this.possibleArrangementOfDamaged =
        this.possibleArrangementOfDamaged.concat(
          initialPossibleArrangementOfDamaged,
        );
    }
  }

  // look through the broken row and find the possible arrangements that match
  // the possible arrangements in the possibleArrangementOfDamaged array
  // an example brokenRow is: ???.###
  // an example possibleArrangementOfDamaged is: [1,1,3]
  // so the number of arrangements possible should be 1
  // as we are supposed to replace the ? with #
  // as ? is unkown, # is damaged and . is operational
  /**
   * Example input
   * ???.### 1,1,3
   * .??..??...?##. 1,1,3
   * ?#?#?#?#?#?#?#? 1,3,1,6
   * ????.#...#... 4,1,1
   * ????.######..#####. 1,6,5
   * ?###???????? 3,2,1
   * @returns number
   */
  public getArrangementsPossible(): number {
    return this.countValidArrangements(this.brokenRow, 0);
  }

  private countValidArrangements(row: string, index: number): number {
    // Create a key for the cache
    const key = row + "," + index;

    // Check if the result is already in the cache
    if (this.memo.has(key)) {
      return this.memo.get(key)!;
    }

    if (index === row.length) {
      // Check if the arrangement is valid
      const isValid = this.isValidArrangement(row) ? 1 : 0;
      this.memo.set(key, isValid);
      return isValid;
    }

    if (row[index] !== "?") {
      const result = this.countValidArrangements(row, index + 1);
      this.memo.set(key, result);
      return result;
    }

    const withDamaged = this.replaceCharAt(row, index, "#");
    const withOperational = this.replaceCharAt(row, index, ".");

    const result =
      this.countValidArrangements(withDamaged, index + 1) +
      this.countValidArrangements(withOperational, index + 1);

    // Store the result in the cache
    this.memo.set(key, result);

    return result;
  }

  private replaceCharAt(
    str: string,
    index: number,
    replacement: string,
  ): string {
    return (
      str.substring(0, index) +
      replacement +
      str.substring(index + replacement.length)
    );
  }

  // check to see if the arrangement is valid
  private isValidArrangement(arrangement: string): boolean {
    const currentArrangement = [...arrangement.matchAll(/\#*/g)]
      .map((x) => x[0])
      .filter((x) => x !== "");
    const possibleArrangementOfDamaged = this.possibleArrangementOfDamaged;

    if (currentArrangement.length !== possibleArrangementOfDamaged.length) {
      return false;
    }

    return possibleArrangementOfDamaged.every((x, i) => {
      return currentArrangement[i]?.length === x;
    });
  }
}

// parse into 2d array
const grid: HotSpringGrid = new HotSpringGrid(
  lines.map((line) => new HotSpringRow(line)),
);

// operational .
// damaged #
// unknown ?

output = grid.getArrangementsPossible().toString();

console.log(output);
await writeOutput(output);
