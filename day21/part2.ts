// read the input from puzzleInput.txt
// Advent of Code 2023 day 21 part 2

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  // return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const writeGridOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part2grid.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 21 part 2 code

type CellType = "S" | "#" | "O" | ".";

class Cell {
  public x: number;
  public y: number;
  public value: CellType;
  public visited: boolean = false;

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

  // clone the current grid and replicate Grid in all directions
  public expandGrid(expandGridBy: number): void {
    if (expandGridBy < 1)
      throw new Error("expandGridBy must be a positive number.");

    const newCells: Cell[][] = [];
    const oldCells: Cell[][] = this.cells;
    const initialRowLength: number = oldCells[0].length;
    const initialColLength: number = oldCells.length;
    const initialStartCell: Cell = this.getStartCell();
    initialStartCell.value = ".";

    for (
      let rowCloneIndex = 0;
      rowCloneIndex < expandGridBy * initialColLength;
      rowCloneIndex++
    ) {
      const newRow: Cell[] = [];

      for (
        let colCloneIndex = 0;
        colCloneIndex < expandGridBy * initialRowLength;
        colCloneIndex++
      ) {
        const originalRow = rowCloneIndex % initialColLength;
        const originalCol = colCloneIndex % initialRowLength;
        const cellToClone = oldCells[originalRow][originalCol];
        newRow.push(
          this.cloneCell(
            cellToClone,
            colCloneIndex,
            rowCloneIndex,
            initialRowLength,
            initialColLength,
          ),
        );
      }

      newCells.push(newRow);
    }

    this.cells = newCells;
    // Reposition the start cell if needed
    this.repositionStartCell(
      initialStartCell,
      initialRowLength,
      initialColLength,
      expandGridBy,
    );
  }

  private cloneCell(
    cell: Cell,
    colCloneIndex: number,
    rowCloneIndex: number,
    rowLength: number,
    colLength: number,
  ): Cell {
    const newX = cell.x + ~~(colCloneIndex / colLength) * rowLength;
    const newY = cell.y + ~~(rowCloneIndex / rowLength) * colLength;
    return new Cell(newX, newY, cell.value);
  }

  private repositionStartCell(
    startCell: Cell,
    rowLength: number,
    colLength: number,
    expandGridBy: number,
  ): void {
    const newX = startCell.x + rowLength * ~~(expandGridBy / 2);
    const newY = startCell.y + colLength * ~~(expandGridBy / 2);
    // console.log(`New start cell: ${newX}, ${newY}`);
    this.setCell(newX, newY, "S");
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

  public getNumberOfRockCells(): number {
    let numberOfRockCells: number = 0;
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.value === "#") {
          numberOfRockCells++;
        }
      }
    }
    return numberOfRockCells;
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

  public floodFill(numberOfSteps: number): void {
    const startCell: Cell = this.getStartCell();
    // console.log(`Start cell: ${startCell.x}, ${startCell.y}`);
    const queue: [Cell[], number][] = [];
    queue.push([[startCell], 0]);
    let steps: number = 0;

    while (queue.length > 0 && steps < numberOfSteps) {
      const [cells, currentStep] = queue.shift() as [Cell[], number];
      const neighbours: Cell[] = [];

      for (const cell of cells) {
        // console.log(cell, steps);
        // visitedMap.set(cell, steps);
        if(cell.visited) {
          continue;
        }

        cell.visited = true;
        if (steps % 2 === 1) {
          this.setCell(cell.x, cell.y, "O");
        } else {
          this.setCell(cell.x, cell.y, ".");
        }

        neighbours.push(...this.getNeighbours(cell));
      }

      steps = currentStep + 1;

      queue.push([neighbours, steps]);
      // console.log("--------------------");
      // console.log(steps);
      // console.log(neighbours.length);
      // console.log(this.toString());
      // console.log("--------------------");
    }
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
      if (steps % 2 === 1) {
        this.setCell(cell.x, cell.y, "O");
      }
    }
  }

  private getNeighbours(
    cell: Cell
  ): Cell[] {
    const neighbours: Cell[] = [];
    const x: number = cell.x;
    const y: number = cell.y;

    if (x > 0 && this.getCell(x - 1, y).value !== "#") {
      if (!this.getCell(x - 1, y).visited) {
        neighbours.push(this.getCell(x - 1, y));
      
        // neighbours.push(this.getCell(x - 1, y));
        // visitedMap.set(this.getCell(x - 1, y), curStep + 1);
      }
    }
    if (x < this.cells[y].length - 1 && this.getCell(x + 1, y).value !== "#") {
      if (!this.getCell(x + 1, y).visited) {
        neighbours.push(this.getCell(x + 1, y));

        // neighbours.push(this.getCell(x + 1, y));
        // visitedMap.set(this.getCell(x + 1, y), curStep + 1);
      }
    }
    if (y > 0 && this.getCell(x, y - 1).value !== "#") {
      if (!this.getCell(x, y - 1).visited) {
        neighbours.push(this.getCell(x, y - 1));
        // neighbours.push(this.getCell(x, y - 1));
        // visitedMap.set(this.getCell(x, y - 1), curStep + 1);
      }
    }
    if (y < this.cells.length - 1 && this.getCell(x, y + 1).value !== "#") {
      if (!this.getCell(x, y + 1).visited) {
        neighbours.push(this.getCell(x, y + 1))

        // neighbours.push(this.getCell(x, y + 1));
        // visitedMap.set(this.getCell(x, y + 1), curStep + 1);
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

grid.expandGrid(10);
console.log("Expanded grid");

// console.log(grid.toString());
// const numSteps = 26_501_365 + 2;
const numSteps = 5;
// number of O's on start row = numSteps + 1
// height of the diamond = numSteps * 2 53,002,730
// width of the diamond = numSteps + 1 26,501,366
// area of the diamond = ((numSteps + 1) * (numSteps * 2)) / 2 = 702,322,373,364,590
// remove half of that 351,161,186,682,295 This is to low
// 526,741,780,023,442 is to low

// console.log(`Start cell: ${grid.getStartCell().x}, ${grid.getStartCell().y}`);
// const cheekyLittleHack = (202_300 * 15081 + 3742);
grid.floodFill(numSteps);
// grid.fillInCellsFromMap(theMap, numSteps);
console.log(grid.toString());
// console.log(`Number of rock cells: ${grid.getNumberOfRockCells()}`);
// console.log(`Size of Grid ${grid.cells.length} x ${grid.cells[0].length}`);
output = grid.getNumberOfMarkedCells().toString();

//3682
//             10_738
// 14_420
//             17_557
// 31_977

// 74_405_000 at 202_300 at 100 expanded grid
//            at 202_300 at 102 expanded grid
console.log(output);
await writeOutput(output);
await writeGridOutput(grid.toString());
