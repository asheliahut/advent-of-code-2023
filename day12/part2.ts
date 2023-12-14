// read the input from puzzleInput.txt
// Advent of Code 2023 day 12 part 2

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
    // console.log(this.brokenRow);
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
    return this.memoCountValidArrangements(
      this.brokenRow,
      this.possibleArrangementOfDamaged,
    );
  }

  private memoCountValidArrangements(
    row: string,
    constraints: number[],
    nextChar?: string,
  ): number {
    const key = row + constraints.join(",") + nextChar;
    if (this.memo.has(key)) {
      return this.memo.get(key)!;
    }
    const result = this.countValidArrangements(row, constraints, nextChar);
    this.memo.set(key, result);
    return result;
  }

  private countValidArrangements(
    row: string,
    constraints: number[],
    nextChar?: string,
  ): number {
    // ???.... 0
    // ?#?.... 0
    if (constraints.length === 0) {
      return row.includes("#") ? 0 : 1;
    }

    if (row.length === 0) {
      return 0;
    }

    if (row[0] === "?") {
      return (
        this.memoCountValidArrangements(
          "." + row.substring(1),
          constraints,
          nextChar,
        ) +
        this.memoCountValidArrangements(
          "#" + row.substring(1),
          constraints,
          nextChar,
        )
      );
    }

    if (nextChar !== undefined && row[0] !== nextChar) {
      return 0;
    }

    if (row[0] === ".") {
      return this.memoCountValidArrangements(row.substring(1), constraints);
    }

    const head = row.substring(0, constraints[0]);

    if (head.length < constraints[0] || head.includes(".")) {
      return 0;
    }

    if (row.startsWith(Array(constraints[0]).fill("#").join(""))) {
      return this.memoCountValidArrangements(
        row.substring(constraints[0]),
        constraints.slice(1),
        ".",
      );
    }

    // ##?. => 3
    // => ?. => 1 (next must be '#')

    for (let i = 1; i < constraints[0]; i++) {
      if (row[i] === undefined) {
        return 0;
      }

      if (row[i] === "?") {
        return this.memoCountValidArrangements(
          row.substring(i),
          [constraints[0] - i, ...constraints.slice(1)],
          "#",
        );
      }
    }

    // #??# => 2,2
    // ==> ??# => 1,2
    // ==> ?# => 1

    return 0;
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
