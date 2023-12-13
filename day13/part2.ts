// read the input from puzzleInput.txt
// Advent of Code 2023 day 13 part 2

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

// Begin day 13 part 2 code

// ash . and # are rocks

// split input into patterns on "" entries in the lines array
const patterns: string[][][] = [];
let pattern: string[][] = [];
for (const line of lines) {
  if (line === "") {
    patterns.push(pattern);
    pattern = [];
    continue;
  }
  pattern.push(line.split(""));
}
patterns.push(pattern);

// a reflection is if line 1 is the same as line 2
function isReflection(line1: string[], line2: string[]): boolean {
  return line1.join("") === line2.join("");
}

function checkValueInArray(array: string[][], key1: number): boolean {
  // Check if the key is within the bounds of the array
  if (key1 >= 0 && key1 < array.length) {
    return true;
  }

  return false;
}

// check if the column at key1 exists in the array
function checkValueInArrayCol(array: string[][], key1: number): boolean {
  // Check if the key is within the bounds of the array column
  if (key1 >= 0 && key1 < array[0].length) {
    return true;
  }

  return false;
}

function getColumnAtIndex(pattern: string[][], index: number): string[] {
  const column: string[] = [];
  for (const row of pattern) {
    column.push(row[index]);
  }
  return column;
}

// this function takes in a pattern string [][]
// I need to find all vertical reflections and horizontal reflections
// a reflection is 2 columns or 2 rows that are the same
// I want to return a tuple of the index of the highest up horizontal row reflection
// and the left most vertical column reflection
function findReflections(pattern: string[][]): [number[], number[]] {
  let numRows = pattern.length;
  let numCols = pattern[0].length;
  const rowReflections: number[] = [];
  const colReflections: number[] = [];

  // check for horizontal reflections using isReflection
  // using 4 indexes i,j,k and l to go up and down from the center
  // checking pairs of rows for reflections
  let i = Math.floor(numRows / 2);
  let j = i + 1;
  let k = i - 1;
  let l = k - 1;
  let lowestReflection = -1;

  // 0, 1, 2, 3, 4, 5, 6, 7, 8
  if (isReflection(pattern[i], pattern[k])) {
    lowestReflection = k;
    let innerHigh = j;
    let innerLow = l;
    while (innerLow >= 0 || innerHigh < numRows) {
      const inArrayInnerJ = checkValueInArray(pattern, innerHigh);
      const inArrayInnerK = checkValueInArray(pattern, innerLow);
      if (
        (inArrayInnerJ && !inArrayInnerK) ||
        (!inArrayInnerJ && inArrayInnerK) ||
        (!inArrayInnerJ && !inArrayInnerK)
      ) {
        if (lowestReflection <= numRows - 1 && lowestReflection >= 0) {
          rowReflections.push(lowestReflection);
        }
        break;
      }

      if (!isReflection(pattern[innerHigh], pattern[innerLow])) {
        break;
      }
      innerHigh++;
      innerLow--;
    }
  }

  while (l >= 0 || j < numRows) {
    if (checkValueInArray(pattern, j) && isReflection(pattern[i], pattern[j])) {
      lowestReflection = i;
      let innerHigh = j + 1;
      let innerLow = i - 1;
      while (innerLow >= 0 || innerHigh < numRows) {
        const inArrayInnerJ = checkValueInArray(pattern, innerHigh);
        const inArrayInnerK = checkValueInArray(pattern, innerLow);
        if (
          (inArrayInnerJ && !inArrayInnerK) ||
          (!inArrayInnerJ && inArrayInnerK) ||
          (!inArrayInnerJ && !inArrayInnerK)
        ) {
          if (lowestReflection <= numRows - 1 && lowestReflection >= 0) {
            rowReflections.push(lowestReflection);
          }
          break;
        }

        if (!isReflection(pattern[innerHigh], pattern[innerLow])) {
          break;
        }
        innerHigh++;
        innerLow--;
      }
    }
    if (checkValueInArray(pattern, l) && isReflection(pattern[k], pattern[l])) {
      lowestReflection = l;
      let innerHigh = k + 1;
      let innerLow = l - 1;
      while (innerLow >= 0 || innerHigh < numRows) {
        const inArrayInnerJ = checkValueInArray(pattern, innerHigh);
        const inArrayInnerK = checkValueInArray(pattern, innerLow);
        if (
          (inArrayInnerJ && !inArrayInnerK) ||
          (!inArrayInnerJ && inArrayInnerK) ||
          (!inArrayInnerJ && !inArrayInnerK)
        ) {
          if (lowestReflection <= numRows - 1 && lowestReflection >= 0) {
            rowReflections.push(lowestReflection);
          }
          break;
        }

        if (!isReflection(pattern[innerHigh], pattern[innerLow])) {
          break;
        }
        innerHigh++;
        innerLow--;
      }
    }

    i++;
    j++;
    k--;
    l--;
  }

  // now check for vertical reflections using isReflection
  // using 4 indexes i,j,k and l to go left and right from the center
  // checking pairs of columns for reflections
  i = Math.ceil(numCols / 2);
  j = i + 1;
  k = i - 1;
  l = k - 1;
  lowestReflection = -1;

  // use getColumnAtIndex to get the column at the index

  if (
    isReflection(getColumnAtIndex(pattern, i), getColumnAtIndex(pattern, k))
  ) {
    lowestReflection = k;
    let innerHigh = j;
    let innerLow = l;
    while (innerLow >= 0 || innerHigh < numCols) {
      const inArrayInnerJ = checkValueInArrayCol(pattern, innerHigh);
      const inArrayInnerK = checkValueInArrayCol(pattern, innerLow);
      if (
        (inArrayInnerJ && !inArrayInnerK) ||
        (!inArrayInnerJ && inArrayInnerK) ||
        (!inArrayInnerJ && !inArrayInnerK)
      ) {
        if (lowestReflection <= numCols - 1 && lowestReflection >= 0) {
          colReflections.push(lowestReflection);
        }
        break;
      }

      if (
        !isReflection(
          getColumnAtIndex(pattern, innerHigh),
          getColumnAtIndex(pattern, innerLow),
        )
      ) {
        break;
      }
      innerHigh++;
      innerLow--;
    }
  }

  while (l >= 0 || j < numCols) {
    if (
      checkValueInArrayCol(pattern, j) &&
      isReflection(getColumnAtIndex(pattern, i), getColumnAtIndex(pattern, j))
    ) {
      lowestReflection = i;
      let innerHigh = j;
      let innerLow = i;
      while (innerLow >= 0 || innerHigh < numCols) {
        const inArrayInnerJ = checkValueInArrayCol(pattern, innerHigh);
        const inArrayInnerK = checkValueInArrayCol(pattern, innerLow);
        if (
          (inArrayInnerJ && !inArrayInnerK) ||
          (!inArrayInnerJ && inArrayInnerK) ||
          (!inArrayInnerJ && !inArrayInnerK)
        ) {
          if (lowestReflection <= numCols - 1 && lowestReflection >= 0) {
            colReflections.push(lowestReflection);
          }
          break;
        }

        if (
          !isReflection(
            getColumnAtIndex(pattern, innerHigh),
            getColumnAtIndex(pattern, innerLow),
          )
        ) {
          break;
        }
        innerHigh++;
        innerLow--;
      }
    }

    if (
      checkValueInArrayCol(pattern, l) &&
      isReflection(getColumnAtIndex(pattern, k), getColumnAtIndex(pattern, l))
    ) {
      lowestReflection = l;
      let innerHigh = k;
      let innerLow = l;
      while (innerLow >= 0 || innerHigh < numCols) {
        const inArrayInnerJ = checkValueInArrayCol(pattern, innerHigh);
        const inArrayInnerK = checkValueInArrayCol(pattern, innerLow);
        if (
          (inArrayInnerJ && !inArrayInnerK) ||
          (!inArrayInnerJ && inArrayInnerK) ||
          (!inArrayInnerJ && !inArrayInnerK)
        ) {
          if (lowestReflection <= numCols - 1 && lowestReflection >= 0) {
            colReflections.push(lowestReflection);
          }
          break;
        }

        if (
          !isReflection(
            getColumnAtIndex(pattern, innerHigh),
            getColumnAtIndex(pattern, innerLow),
          )
        ) {
          break;
        }
        innerHigh++;
        innerLow--;
      }
    }
    i++;
    j++;
    k--;
    l--;
  }

  return [rowReflections, colReflections];
}

function compareReflections(
  oldRef: [number[], number[]],
  newRef: [number[], number[]],
): [number[], number[]] {
  const [ref1Row, ref1Col] = oldRef;
  const minRef1Row = Math.min(...ref1Row);
  const minRef1Col = Math.min(...ref1Col);
  const minRef2Row: number[] = newRef[0].filter((x) => x !== minRef1Row);
  const minRef2Col: number[] = newRef[1].filter((x) => x !== minRef1Col);

  return [minRef2Row, minRef2Col];
}

let total = 0;

for (const pattern of patterns) {
  const oldReflection = findReflections(pattern);

  let newReflectionFound = false;
  for (const row in pattern) {
    for (const col in pattern[row]) {
      const tempPattern: string[][] = JSON.parse(JSON.stringify(pattern));

      if (pattern[row][col] === "#") {
        tempPattern[row][col] = ".";
      } else {
        tempPattern[row][col] = "#";
      }

      const newReflections = findReflections(tempPattern);
      const newReflectionMinusOld = compareReflections(
        oldReflection,
        newReflections,
      );

      const [tempRowReflectionIdxs, tempColReflectionIdxs] =
        newReflectionMinusOld;

      const minRowReflectionIdx = Math.min(...tempRowReflectionIdxs);
      const minColReflectionIdx = Math.min(...tempColReflectionIdxs);
      if (minRowReflectionIdx !== Infinity) {
        newReflectionFound = true;
        total += (minRowReflectionIdx + 1) * 100;
        break;
      }

      if (minColReflectionIdx !== Infinity) {
        newReflectionFound = true;
        total += minColReflectionIdx + 1;
        break;
      }
    }

    if (newReflectionFound) {
      break;
    }
  }
}

output = `Total Summary Number: ${total}`;

console.log(output);
await writeOutput(output);
