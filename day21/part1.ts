// read the input from puzzleInput.txt
// Advent of Code 2023 day 21 part 1

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  // return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 21 part 1 code

type CellType = "S" | "#" | "O" | ".";

class Cell {
  public x: number;
  public y: number;
  public value: CellType;

  constructor(x: number, y: number, cellType: CellType) {
    this.x = x;
    this.y = y;
    this.value = cellType;
  }
}

class Grid {
  public cells: Cell[][];

  constructor() {
    this.cells = [];
  }

  public addRow(row: Cell[]): void {
    this.cells.push(row);
  }

  public getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  public setCell(x: number, y: number, cellType: CellType): void {
    this.cells[y][x].value = cellType;
  }

  public getNumberOfMarkedCells(): number {
    let numberOfMarkedCells: number = 0;
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.value === "O") {
          numberOfMarkedCells++;
        }
      }
    }
    return numberOfMarkedCells;
  }

  public getStartCell(): Cell {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.value === "S") {
          return cell;
        }
      }
    }

    throw new Error("No start cell found");
  }

  public floodFill(numberOfSteps: number): Map<Cell, number> {
    const startCell: Cell = this.getStartCell();
    const visitedMap: Map<Cell, number> = new Map();
    const queue: [Cell[], number][] = [];
    queue.push([[startCell], 0]);
    let steps: number = 0;

    while (queue.length > 0 && steps < numberOfSteps) {
      const [cells, currentStep] = queue.shift() as [Cell[], number];
      const neighbours: Cell[] = [];

      for (const cell of cells) {
        visitedMap.set(cell, steps);
        neighbours.push(...this.getNeighbours(cell, visitedMap));
      }

      steps = currentStep + 1;

      queue.push([neighbours, steps]);
      console.log("--------------------");
      console.log(steps);
      console.log(neighbours.length);
      // console.log(this.toString());
      console.log("--------------------");
    }

    return visitedMap;
  }

  public fillInCellsFromMap(
    visitedMap: Map<Cell, number>,
    numSteps: number,
  ): void {
    let isEven = false;
    if (numSteps % 2 === 0) {
      isEven = true;
    }

    for (const [cell, steps] of visitedMap) {
      // console.log(cell, steps);
      if (isEven) {
        if (steps % 2 === 0) {
          this.setCell(cell.x, cell.y, "O");
        } else {
          this.setCell(cell.x, cell.y, ".");
        }
      } else {
        if (steps % 2 === 1) {
          this.setCell(cell.x, cell.y, "O");
        } else {
          this.setCell(cell.x, cell.y, ".");
        }
      }
    }
  }

  private getNeighbours(cell: Cell, visitedMap: Map<Cell, number>): Cell[] {
    const neighbours: Cell[] = [];
    const x: number = cell.x;
    const y: number = cell.y;

    if (x > 0) {
      if (
        !visitedMap.has(this.getCell(x - 1, y)) &&
        this.getCell(x - 1, y).value !== "#"
      ) {
        neighbours.push(this.getCell(x - 1, y));
        visitedMap.set(this.getCell(x - 1, y), 0);
      }
    }
    if (x < this.cells[y].length - 1 && this.getCell(x + 1, y).value !== "#") {
      if (!visitedMap.has(this.getCell(x + 1, y))) {
        neighbours.push(this.getCell(x + 1, y));
        visitedMap.set(this.getCell(x + 1, y), 0);
      }
    }
    if (y > 0 && this.getCell(x, y - 1).value !== "#") {
      if (!visitedMap.has(this.getCell(x, y - 1))) {
        neighbours.push(this.getCell(x, y - 1));
        visitedMap.set(this.getCell(x, y - 1), 0);
      }
    }
    if (y < this.cells.length - 1 && this.getCell(x, y + 1).value !== "#") {
      if (!visitedMap.has(this.getCell(x, y + 1))) {
        neighbours.push(this.getCell(x, y + 1));
        visitedMap.set(this.getCell(x, y + 1), 0);
      }
    }

    return neighbours.filter((neighbour: Cell) => {
      return neighbour.value === ".";
    });
  }

  public toString(): string {
    let output: string = "";
    for (const row of this.cells) {
      for (const cell of row) {
        output += cell.value;
      }
      output += "\n";
    }
    return output;
  }
}

// create a 2d array of the input as a Grid
const grid: Grid = new Grid();
let x = 0;
let y = 0;
for (const line of lines) {
  const row: Cell[] = [];
  for (const char of line) {
    row.push(new Cell(x, y, char as CellType));
    x++;
  }
  grid.addRow(row);
  x = 0;
  y++;
}

const numSteps = 6;

const theMap = grid.floodFill(numSteps);
grid.fillInCellsFromMap(theMap, numSteps);
console.log(grid.toString());
output = grid.getNumberOfMarkedCells().toString();

console.log(output);
await writeOutput(output);
