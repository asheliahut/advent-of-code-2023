// read the input from puzzleInput.txt
// advent of code 2023 day 3 part 1

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

// Begin day 3 part 1 code

function generateSpecialCharactersSet(): Set<string> {
  const specialCharacters = new Set<string>();

  // Iterate over the ASCII range for special characters
  for (let i = 33; i <= 126; i++) {
    const char = String.fromCharCode(i);
    if (char !== "." && !char.match(/[a-zA-Z0-9]/)) {
      specialCharacters.add(char);
    }
  }

  return specialCharacters;
}

const specialCharsSet = generateSpecialCharactersSet();

function isSpecialCharacter(char: string): boolean {
  return specialCharsSet.has(char);
}

function isAllSpecialCharacter(char: string): boolean {
  const specialCharsSetClone = new Set(specialCharsSet);
  specialCharsSetClone.add(".");
  return specialCharsSetClone.has(char);
}

function isNumber(char: string): boolean {
  return char.match(/[0-9]/) !== null;
}

// loop through all enties and add them to a 2 dimensional array
const map: string[][] = [];
for (let i = 0; i < lines.length; i++) {
  map[i] = [];
  for (let j = 0; j < lines[i].length; j++) {
    map[i][j] = lines[i][j];
  }
}

// check left and right of a digit in the map and get the full
function getFullNumber(map: string[][], row: number, col: number): number {
  // first validate the function can run
  if (isAllSpecialCharacter(map[row][col])) {
    return 0;
  }

  let num = map[row][col];
  let left = col - 1;
  let right = col + 1;
  while (left >= 0 && !isAllSpecialCharacter(map[row][left])) {
    num = map[row][left] + num;
    left--;
  }
  while (right < map[row].length && !isAllSpecialCharacter(map[row][right])) {
    num = num + map[row][right];
    right++;
  }

  return parseInt(num);
}

// set of numbers found
let numbersSum = 0;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (isSpecialCharacter(map[i][j])) {
      // left
      if (isNumber(map[i][j - 1])) {
        numbersSum += getFullNumber(map, i, j - 1);
      }
      // right
      if (isNumber(map[i][j + 1])) {
        numbersSum += getFullNumber(map, i, j + 1);
      }

      let doesUpHaveNumber = false;
      // up
      if (isNumber(map[i - 1][j])) {
        numbersSum += getFullNumber(map, i - 1, j);
        doesUpHaveNumber = true;
      }
      // up left
      if (!doesUpHaveNumber && isNumber(map[i - 1][j - 1])) {
        numbersSum += getFullNumber(map, i - 1, j - 1);
      }
      // up right
      if (!doesUpHaveNumber && isNumber(map[i - 1][j + 1])) {
        numbersSum += getFullNumber(map, i - 1, j + 1);
      }

      let doesDownHaveNumber = false;
      // down
      if (isNumber(map[i + 1][j])) {
        numbersSum += getFullNumber(map, i + 1, j);
        doesDownHaveNumber = true;
      }

      // down left
      if (!doesDownHaveNumber && isNumber(map[i + 1][j - 1])) {
        numbersSum += getFullNumber(map, i + 1, j - 1);
      }
      // down right
      if (!doesDownHaveNumber && isNumber(map[i + 1][j + 1])) {
        numbersSum += getFullNumber(map, i + 1, j + 1);
      }
    }
  }
}

//output = sum.toString();
output = numbersSum.toString();

console.log(output);
await writeOutput(output);
