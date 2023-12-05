// read the input from puzzleInput.txt
// Advent of Code 2023 day 4 part 2

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

// Begin day 4 part 2 code
function generateTupleOfSets(lines: string[]): [Set<number>, Set<number>][] {
  const tupleOfSets: [Set<number>, Set<number>][] = [];

  for (let line of lines) {
    const winningNumbers = new Set<number>();
    const numbersIHave = new Set<number>();
    const splitLine = line.split(":");
    const numbers = splitLine[1].trim().split("|");

    const winningNumbersString = numbers[0]
      .trim()
      .split(" ")
      .filter((number) => number !== "");
    for (let winningNumber of winningNumbersString) {
      winningNumbers.add(parseInt(winningNumber));
    }

    const numbersIHaveString = numbers[1]
      .trim()
      .split(" ")
      .filter((number) => number !== "");
    for (let numberIHave of numbersIHaveString) {
      numbersIHave.add(parseInt(numberIHave));
    }

    tupleOfSets.push([winningNumbers, numbersIHave]);
  }

  return tupleOfSets;
}

const tupleOfSets = generateTupleOfSets(lines);
const queueOfSetsIndexes: number[] = [];
let grandTotal: number = tupleOfSets.length;

// add all the indexes to the queue
for (let i = 0; i < tupleOfSets.length; i++) {
  queueOfSetsIndexes.push(i);
}

while (queueOfSetsIndexes.length > 0) {
  const index = queueOfSetsIndexes.shift() ?? 0;
  const winningNumbers = tupleOfSets[index][0];
  const numbersIHave = tupleOfSets[index][1];

  let matchingNumbers = 0;
  for (let number of numbersIHave) {
    if (winningNumbers.has(number)) {
      matchingNumbers++;
    }
  }

  for (let i = 0; i < matchingNumbers; i++) {
    queueOfSetsIndexes.push(index + i + 1);
  }

  grandTotal += matchingNumbers;
}

output = grandTotal.toString();

console.log(output);
await writeOutput(output);
