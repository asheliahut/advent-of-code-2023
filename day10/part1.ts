// read the input from puzzleInput.txt
// Advent of Code 2023 day 10 part 1

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

function getNextDirection(
  updatedTwoDArray: string[][],
  currentPos: number[],
  curDir: string,
): string {
  switch (curDir) {
    case "up":
      if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "|") {
        return "up";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "X") {
        return "left";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "F") {
        return "right";
      } else {
        return "none";
      }
    case "down":
      if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "|") {
        return "down";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "J") {
        return "left";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "L") {
        return "right";
      } else {
        return "none";
      }
    case "left":
      if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "L") {
        return "up";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "F") {
        return "down";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "-") {
        return "left";
      } else {
        return "none";
      }
    case "right":
      if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "J") {
        return "up";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "X") {
        return "down";
      } else if (updatedTwoDArray[currentPos[0]][currentPos[1]] === "-") {
        return "right";
      } else {
        return "none";
      }
    default:
      return "none";
  }
}

// this is a recursive function that will go through the twoDArray and replace all the locations
// with a number that represents the order in which the path is taken
function createNumberedTwoDArray(
  updatedTwoDArray: string[][],
  currentPos: number[],
  curDir: string,
  numSteps: number,
): string[][] {
  let curNumSteps = numSteps;
  let nextDirection = "none";
  // look in all directions to see if there is a possible path
  if (curDir === "none") {
    return updatedTwoDArray;
  } else {
    curNumSteps++;
  }

  switch (curDir) {
    case "up":
      currentPos[0] = currentPos[0] - 1;

      nextDirection = getNextDirection(updatedTwoDArray, currentPos, curDir);
      if (nextDirection === "none") {
        return updatedTwoDArray;
      }
      updatedTwoDArray[currentPos[0]][currentPos[1]] = curNumSteps.toString();

      return createNumberedTwoDArray(
        updatedTwoDArray,
        currentPos,
        nextDirection,
        curNumSteps,
      );
    case "down":
      currentPos[0] = currentPos[0] + 1;

      nextDirection = getNextDirection(updatedTwoDArray, currentPos, curDir);
      if (nextDirection === "none") {
        return updatedTwoDArray;
      }

      updatedTwoDArray[currentPos[0]][currentPos[1]] = curNumSteps.toString();

      return createNumberedTwoDArray(
        updatedTwoDArray,
        currentPos,
        nextDirection,
        curNumSteps,
      );
    case "left":
      currentPos[1] = currentPos[1] - 1;

      nextDirection = getNextDirection(updatedTwoDArray, currentPos, curDir);
      if (nextDirection === "none") {
        return updatedTwoDArray;
      }

      updatedTwoDArray[currentPos[0]][currentPos[1]] = curNumSteps.toString();

      return createNumberedTwoDArray(
        updatedTwoDArray,
        currentPos,
        nextDirection,
        curNumSteps,
      );
    case "right":
      currentPos[1] = currentPos[1] + 1;

      nextDirection = getNextDirection(updatedTwoDArray, currentPos, curDir);
      if (nextDirection === "none") {
        return updatedTwoDArray;
      }

      updatedTwoDArray[currentPos[0]][currentPos[1]] = curNumSteps.toString();

      return createNumberedTwoDArray(
        updatedTwoDArray,
        currentPos,
        nextDirection,
        curNumSteps,
      );
    default:
      return updatedTwoDArray;
  }
}

const [initialtwoDArray, indexTupleOfStartingPosition, startingDirections] =
  generateStartingInformation(lines);

const listOfTwoDArrays: string[][][] = [];

for (const startingDirection of startingDirections) {
  const cloneTwoDArray = JSON.parse(JSON.stringify(initialtwoDArray));
  const cloneOfIndexTupleOfStartingPosition = JSON.parse(
    JSON.stringify(indexTupleOfStartingPosition),
  );

  listOfTwoDArrays.push(
    createNumberedTwoDArray(
      cloneTwoDArray,
      cloneOfIndexTupleOfStartingPosition,
      startingDirection,
      0,
    ),
  );
}

listOfTwoDArrays.forEach((twoDArray) => {
  twoDArray.forEach((row) => console.log(row));
});

let isMatch = false;
let matchedNumber = "";

for (let i = 0; i < listOfTwoDArrays[0].length; i++) {
  for (let j = 0; j < listOfTwoDArrays[0][i].length; j++) {
    if (listOfTwoDArrays[0][i][j].match(/[0-9]/)) {
      isMatch = true;
      const curVal = listOfTwoDArrays[0][i][j];
      for (const twoDArray of listOfTwoDArrays) {
        if (curVal !== twoDArray[i][j]) {
          isMatch = false;
        }
      }
    }

    if (isMatch) {
      matchedNumber = listOfTwoDArrays[0][i][j];
      break;
    }
  }

  if (isMatch) {
    break;
  }
}

output = matchedNumber.toString();

console.log(output);
await writeOutput(output);
