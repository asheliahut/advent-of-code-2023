// read the input from puzzleInput.txt
// Advent of Code 2023 day 10 part 2

import { join as pathJoin } from "node:path";
import { DijkstraCalculator } from "dijkstra-calculator";

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

// Begin day 10 part 2 code

function checkValueIn2DArray<T>(
  array: T[][],
  key1: number,
  key2: number,
): boolean {
  // Check if the key is within the bounds of the array
  if (key1 >= 0 && key1 < array.length) {
    if (key2 >= 0 && key2 < array[key1].length) {
      return true;
    }
  }

  return false;
}

// Begin day 10 part 1 code
function directionToSymbolPossible(
  direction: string,
  nextSymbol: string,
): boolean {
  switch (direction) {
    case "up":
      switch (nextSymbol) {
        case "|":
          return true;
        case "-":
          return false;
        case "L":
          return false;
        case "J":
          return false;
        case "X":
          return true;
        case "F":
          return true;
        case ".":
          return false;
        case "S":
          return false;
        default:
          return false;
      }
    case "down":
      switch (nextSymbol) {
        case "|":
          return true;
        case "-":
          return false;
        case "L":
          return true;
        case "J":
          return true;
        case "X":
          return false;
        case "F":
          return false;
        case ".":
          return false;
        case "S":
          return false;
        default:
          return false;
      }
    case "left":
      switch (nextSymbol) {
        case "|":
          return false;
        case "-":
          return true;
        case "L":
          return true;
        case "J":
          return false;
        case "X":
          return false;
        case "F":
          return true;
        case ".":
          return false;
        case "S":
          return false;
        default:
          return false;
      }
    case "right":
      switch (nextSymbol) {
        case "|":
          return false;
        case "-":
          return true;
        case "L":
          return false;
        case "J":
          return true;
        case "X":
          return true;
        case "F":
          return false;
        case ".":
          return false;
        case "S":
          return false;
        default:
          return false;
      }
    default:
      return false;
  }
}

function getStartingPos(twoDArray: string[][]): number[] {
  for (let i = 0; i < twoDArray.length; i++) {
    for (let j = 0; j < twoDArray[i].length; j++) {
      if (twoDArray[i][j] === "S") {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

function generateStartingInformation(
  lines: string[],
): [string[][], number[], string[]] {
  const twoDArray = lines.map((line) => line.split(""));
  const indexTupleOfStartingPosition = [0, 0];
  const startingDirections: string[] = [];

  for (let i = 0; i < twoDArray.length; i++) {
    for (let j = 0; j < twoDArray[i].length; j++) {
      if (twoDArray[i][j] === "S") {
        indexTupleOfStartingPosition[0] = i;
        indexTupleOfStartingPosition[1] = j;

        if (
          checkValueIn2DArray(twoDArray, i - 1, j) &&
          directionToSymbolPossible("up", twoDArray[i - 1][j])
        ) {
          startingDirections.push("up");
        }
        if (
          checkValueIn2DArray(twoDArray, i + 1, j) &&
          directionToSymbolPossible("down", twoDArray[i + 1][j])
        ) {
          startingDirections.push("down");
        }
        if (
          checkValueIn2DArray(twoDArray, i, j - 1) &&
          directionToSymbolPossible("left", twoDArray[i][j - 1])
        ) {
          startingDirections.push("left");
        }
        if (
          checkValueIn2DArray(twoDArray, i, j + 1) &&
          directionToSymbolPossible("right", twoDArray[i][j + 1])
        ) {
          startingDirections.push("right");
        }
      }

      if (twoDArray[i][j] === "7") {
        twoDArray[i][j] = "X";
      }
    }
  }

  return [twoDArray, indexTupleOfStartingPosition, startingDirections];
}

function getNextDirectionAndFill(
  updatedTwoDArray: string[][],
  currentPos: number[],
  curDir: string,
): [string[][], string] {
  let filledTwoDArray = updatedTwoDArray;

  if (filledTwoDArray[currentPos[0]][currentPos[1]] === "S") {
    filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
    return [filledTwoDArray, "none"];
  }

  switch (curDir) {
    case "up":
      if (filledTwoDArray[currentPos[0]][currentPos[1]] === "|") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "up"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "X") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        return [filledTwoDArray, "left"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "F") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        return [filledTwoDArray, "right"];
      } else {
        return [filledTwoDArray, "none"];
      }
    case "down":
      if (filledTwoDArray[currentPos[0]][currentPos[1]] === "|") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "down"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "J") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "left"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "L") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "right"];
      } else {
        return [filledTwoDArray, "none"];
      }
    case "left":
      if (filledTwoDArray[currentPos[0]][currentPos[1]] === "L") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "up"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "F") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        return [filledTwoDArray, "down"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "-") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        return [filledTwoDArray, "left"];
      } else {
        return [filledTwoDArray, "none"];
      }
    case "right":
      if (filledTwoDArray[currentPos[0]][currentPos[1]] === "J") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        filledTwoDArray[currentPos[0] - 1][currentPos[1]] = "1";
        return [filledTwoDArray, "up"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "X") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        filledTwoDArray[currentPos[0] + 1][currentPos[1]] = "1";
        return [filledTwoDArray, "down"];
      } else if (filledTwoDArray[currentPos[0]][currentPos[1]] === "-") {
        filledTwoDArray[currentPos[0]][currentPos[1]] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] + 1] = "1";
        filledTwoDArray[currentPos[0]][currentPos[1] - 1] = "1";
        return [filledTwoDArray, "right"];
      } else {
        return [filledTwoDArray, "none"];
      }
    default:
      return [filledTwoDArray, "none"];
  }
}

function traverseAndFill(
  updatedTwoDArray: string[][],
  currentPos: number[],
  curDir: string,
): string[][] {
  let nextDirection = "none";
  let filledTwoDArray = updatedTwoDArray;
  // look in all directions to see if there is a possible path
  if (curDir === "none") {
    return filledTwoDArray;
  }

  switch (curDir) {
    case "up":
      currentPos[0] = currentPos[0] - 2;

      [filledTwoDArray, nextDirection] = getNextDirectionAndFill(
        filledTwoDArray,
        currentPos,
        curDir,
      );
      if (nextDirection === "none") {
        return filledTwoDArray;
      }

      return traverseAndFill(filledTwoDArray, currentPos, nextDirection);
    case "down":
      currentPos[0] = currentPos[0] + 2;

      [filledTwoDArray, nextDirection] = getNextDirectionAndFill(
        filledTwoDArray,
        currentPos,
        curDir,
      );
      if (nextDirection === "none") {
        return filledTwoDArray;
      }

      return traverseAndFill(filledTwoDArray, currentPos, nextDirection);
    case "left":
      currentPos[1] = currentPos[1] - 2;

      [filledTwoDArray, nextDirection] = getNextDirectionAndFill(
        filledTwoDArray,
        currentPos,
        curDir,
      );
      if (nextDirection === "none") {
        return filledTwoDArray;
      }

      return traverseAndFill(filledTwoDArray, currentPos, nextDirection);
    case "right":
      currentPos[1] = currentPos[1] + 2;

      [filledTwoDArray, nextDirection] = getNextDirectionAndFill(
        filledTwoDArray,
        currentPos,
        curDir,
      );
      if (nextDirection === "none") {
        return filledTwoDArray;
      }

      return traverseAndFill(filledTwoDArray, currentPos, nextDirection);
    default:
      return filledTwoDArray;
  }
}

const [initialtwoDArray, indexTupleOfStartingPosition, startingDirections] =
  generateStartingInformation(lines);

console.log(indexTupleOfStartingPosition, startingDirections);

let gridToTraverse: string[][] = initialtwoDArray;

const stepGrid: string[][] = [];

for (let i = 0; i < gridToTraverse.length; i++) {
  let newRow: string[] = [];
  for (let j = 0; j < gridToTraverse[i].length; j++) {
    // if (checkValueIn2DArray(gridToTraverse, i,j - 1) && checkValueIn2DArray(gridToTraverse, i,j + 1)) {
    newRow.push(" ");
    newRow.push(gridToTraverse[i][j]);
  }
  newRow.push(" ");
  stepGrid.push(newRow);
  stepGrid.push(Array(stepGrid[i].length).fill(" "));
}

stepGrid.unshift(Array(stepGrid[0].length).fill(" "));

const newStartingPos: number[] = getStartingPos(stepGrid);

console.log(newStartingPos);

const finalGrid = traverseAndFill(
  stepGrid,
  newStartingPos,
  startingDirections[0],
);

const graph = new DijkstraCalculator();

for (let i = 0; i < finalGrid.length; i++) {
  for (let j = 0; j < finalGrid[i].length; j++) {
    graph.addVertex(`${i},${j}`);
  }
}

for (let i = 0; i < finalGrid.length; i++) {
  for (let j = 0; j < finalGrid[i].length; j++) {
    if (finalGrid[i][j] === "1") {
      continue;
    }
    if (
      checkValueIn2DArray(finalGrid, i, j - 1) &&
      finalGrid[i][j - 1] !== "1"
    ) {
      graph.addEdge(`${i},${j}`, `${i},${j - 1}`);
    }
    if (
      checkValueIn2DArray(finalGrid, i, j + 1) &&
      finalGrid[i][j + 1] !== "1"
    ) {
      graph.addEdge(`${i},${j}`, `${i},${j + 1}`);
    }
    if (
      checkValueIn2DArray(finalGrid, i - 1, j) &&
      finalGrid[i - 1][j] !== "1"
    ) {
      graph.addEdge(`${i},${j}`, `${i - 1},${j}`);
    }
    if (
      checkValueIn2DArray(finalGrid, i + 1, j) &&
      finalGrid[i + 1][j] !== "1"
    ) {
      graph.addEdge(`${i},${j}`, `${i + 1},${j}`);
    }
  }
}

// loop over the grid and check how many non 1 values that can't reach [0,0]
let count = 0;
for (let i = 0; i < finalGrid.length; i++) {
  for (let j = 0; j < finalGrid[i].length; j++) {
    if (finalGrid[i][j] !== "1" && finalGrid[i][j] !== " ") {
      if (graph.calculateShortestPath(`${i},${j}`, `0,0`).length === 0) {
        count++;
      }
    }
  }
}

output = count.toString();

console.log(output);
await writeOutput(output);
