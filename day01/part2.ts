// read the input from puzzleInput.txt
// advent of code 2023 day 1 part 2

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const numberMap = new Map<string, number>();
numberMap.set("zero", 0);
numberMap.set("one", 1);
numberMap.set("two", 2);
numberMap.set("three", 3);
numberMap.set("four", 4);
numberMap.set("five", 5);
numberMap.set("six", 6);
numberMap.set("seven", 7);
numberMap.set("eight", 8);
numberMap.set("nine", 9);

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

let sum: number = 0;
for (let line of lines) {
  let firstDigit = 0;
  let lastDigit = 0;
  let tempSum: string = "";

  for (let i = 0; i < line.length; i++) {
    const char = line.charAt(i);
    if (char.match(/\d/)) {
      firstDigit = parseInt(char);
      break;
    } else if (char.match(/\w/)) {
      let word = line.substring(i, i + 3);
      if (numberMap.has(word)) {
        firstDigit = numberMap.get(word) ?? 0;
        break;
      }

      word = line.substring(i, i + 4);
      if (numberMap.has(word)) {
        firstDigit = numberMap.get(word) ?? 0;
        break;
      }

      word = line.substring(i, i + 5);
      if (numberMap.has(word)) {
        firstDigit = numberMap.get(word) ?? 0;
        break;
      }
    }
  }

  for (let i = line.length - 1; i >= 0; i--) {
    const char = line.charAt(i);
    if (char.match(/\d/)) {
      lastDigit = parseInt(char);
      break;
    } else if (char.match(/\w/)) {
      let word = line.substring(i, i + 3);
      if (numberMap.has(word)) {
        lastDigit = numberMap.get(word) ?? 0;
        break;
      }

      word = line.substring(i, i + 4);
      if (numberMap.has(word)) {
        lastDigit = numberMap.get(word) ?? 0;
        break;
      }

      word = line.substring(i, i + 5);
      if (numberMap.has(word)) {
        lastDigit = numberMap.get(word) ?? 0;
        break;
      }
    }
  }

  tempSum = firstDigit.toString() + lastDigit.toString();
  sum += parseInt(tempSum);
}

output = sum.toString();

console.log(output);
await writeOutput(output);
