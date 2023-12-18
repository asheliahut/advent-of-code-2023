// read the input from puzzleInput.txt
// Advent of Code 2023 day 18 part 1

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part1_grid.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 18 part 1 code

const MAX_SIZE: number = 600;

class Cell {
  public colorOfCell: string;
  public cellCharacter: string = ".";

  constructor(character: string, color: string) {
    this.cellCharacter = character;
    this.colorOfCell = color;
  }
}

class TravelDirectionWithColor {
  public direction: string;
  public color: string;
  public distance: number;

  constructor(direction: string, color: string, distance: number) {
    this.direction = direction;
    this.color = color;
    this.distance = distance;
  }
}

// create a 2d grid with MAX_SIZE rows and 100_000 columns
class Grid {
  private _grid: Cell[][] = [];

  constructor(grid?: Cell[][]) {
    if (grid) {
      this._grid = grid;
      return;
    }

    for (let i = 0; i < MAX_SIZE; i++) {
      this._grid.push([]);
      for (let j = 0; j < MAX_SIZE; j++) {
        this._grid[i].push(new Cell(".", "#FFFFFF"));
      }
    }
  }

  public map<T>(
    callbackfn: (value: Cell[], index: number, array: Cell[][]) => T,
  ): T[] {
    return this._grid.map(callbackfn);
  }

  public getGrid(): Cell[][] {
    return this._grid;
  }

  public getGridRowLength(): number {
    return this._grid.length;
  }

  public getGridColLength(): number {
    return this._grid[0].length;
  }

  public getRow(row: number): Cell[] {
    return this._grid[row];
  }

  public getCell(row: number, col: number): Cell {
    return this._grid[row][col];
  }

  public removeCellsToLeftOfCol(col: number): void {
    for (let row = 0; row < this._grid.length; row++) {
      this._grid[row].splice(0, col);
    }
  }

  public removeCellsToRightOfCol(col: number): void {
    for (let row = 0; row < this._grid.length; row++) {
      this._grid[row].splice(col, this._grid[row].length);
    }
  }

  public removeCellsAboveRow(row: number): void {
    this._grid.splice(0, row);
  }

  public removeCellsBelowRow(row: number): void {
    this._grid.splice(row, this._grid.length);
  }

  public setCell(row: number, col: number, val: Cell): void {
    if (row < 0 || row > this._grid.length) {
      console.log(row);
      throw new Error("row out of bounds");
    }

    if (col < 0 || col > this._grid[row].length) {
      console.log(col);
      throw new Error("col out of bounds");
    }

    this._grid[row][col] = val;
  }
}

const grid1 = new Grid();

// example line R 6 (#70c710)
const directionsWithColors: TravelDirectionWithColor[] = lines.map((line) => {
  const direction: string = line.split(" ")[0];
  const distance: number = parseInt(line.split(" ")[1]);
  const color: string = line.substring(line.indexOf("#"), line.length);
  return new TravelDirectionWithColor(direction, color, distance);
});

// fill in the grid by walking through the directions
// start in the top left corner 0,0
// keep track of where you are
const rowStart: number = 200;
const colStart: number = 200;
let row: number = rowStart;
let col: number = colStart;

for (const dirWithColor of directionsWithColors) {
  let color: string = dirWithColor.color;
  let direction: string = dirWithColor.direction;
  let distance: number = dirWithColor.distance;

  // walk the distance
  for (let i = 0; i < distance; i++) {
    // set the cell
    grid1.setCell(row, col, new Cell("#", color));

    // move in the direction
    if (direction === "R") {
      col++;
    } else if (direction === "L") {
      col--;
    } else if (direction === "U") {
      row--;
    } else if (direction === "D") {
      row++;
    }
  }
}

// calculate minRow to start and minCol to start
let minRow: number = MAX_SIZE;
let minCol: number = MAX_SIZE;
let maxRow: number = 0;
let maxCol: number = 0;
for (let row = 0; row < MAX_SIZE; row++) {
  for (let col = 0; col < MAX_SIZE; col++) {
    if (grid1.getCell(row, col).cellCharacter === "#") {
      if (row < minRow) {
        minRow = row;
      }

      if (row > maxRow) {
        maxRow = row;
      }

      if (col < minCol) {
        minCol = col;
      }

      if (col > maxCol) {
        maxCol = col;
      }
    }
  }
}

grid1.removeCellsAboveRow(minRow);
grid1.removeCellsBelowRow(maxRow - minRow + 1);
grid1.removeCellsToLeftOfCol(minCol);
grid1.removeCellsToRightOfCol(maxCol - minCol + 1);

maxCol = maxCol - minCol + 1;
maxRow = maxRow - minRow + 1;

// function to determine if a cell is inside the walls #
function fillInsideWalls(
  row: number,
  col: number,
  maxRow: number,
  maxCol: number,
): boolean {
  // Check bounds
  if (row < 0 || row >= maxRow || col < 0 || col >= maxCol) {
    return false;
  }

  // Check if the cell is already visited or is a wall
  if (grid1.getCell(row, col).cellCharacter !== ".") {
    return false;
  }

  // Mark the cell as visited by changing its character
  grid1.setCell(row, col, new Cell("#", "#FF0000")); // You can use a different marking system

  // Recursively check all four directions
  fillInsideWalls(row + 1, col, maxRow, maxCol); // Down
  fillInsideWalls(row - 1, col, maxRow, maxCol); // Up
  fillInsideWalls(row, col + 1, maxRow, maxCol); // Right
  fillInsideWalls(row, col - 1, maxRow, maxCol); // Left

  return true;
}

// find a single point inside the walls and fill the inside of the walls
fillInsideWalls(150, 141, maxRow - 1, maxCol - 1);

// count the number of cells marekd with #
let count: number = 0;
for (let row = 0; row < maxRow; row++) {
  for (let col = 0; col < maxCol; col++) {
    if (grid1.getCell(row, col).cellCharacter === "#") {
      count++;
    }
  }
}

// output grid
output = count.toString();

console.log(output);
await writeOutput(output);
