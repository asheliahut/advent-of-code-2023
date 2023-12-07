// read the input from puzzleInput.txt
// Advent of Code 2023 day 7 part 1

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

// Begin day 7 part 1 code
// create a new array of playing cards sorted from lowest to highest
const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

// create a map of playing cards to a value where A is 14 and 2 is 2
const cardValues = new Map<string, number>();
cards.forEach((card, index) => {
  cardValues.set(card, index + 2);
});

// create a map of winning types to a value where five of a kind is 6 and high card is 0
const winningTypes = new Map<string, number>();
winningTypes.set("five of a kind", 6);
winningTypes.set("four of a kind", 5);
winningTypes.set("full house", 4);
winningTypes.set("three of a kind", 3);
winningTypes.set("two pair", 2);
winningTypes.set("one pair", 1);
winningTypes.set("high card", 0);

function getHandType(hand: number[]) {
  const cardFrequency = new Map();

  for (const card of hand) {
    cardFrequency.set(card, (cardFrequency.get(card) || 0) + 1);
  }

  const maxCount = Math.max(...cardFrequency.values());

  if (maxCount === 5) {
    return winningTypes.get("five of a kind");
  } else if (maxCount === 4) {
    return winningTypes.get("four of a kind");
  } else if (maxCount === 3) {
    // check for full house
    for (const count of cardFrequency.values()) {
      if (count === 2) {
        return winningTypes.get("full house");
      }
    }
    return winningTypes.get("three of a kind");
  } else if (maxCount === 2) {
    // check for two pair
    let pairCount = 0;
    for (const count of cardFrequency.values()) {
      if (count === 2) {
        pairCount++;
      }
    }
    if (pairCount === 2) {
      return winningTypes.get("two pair");
    }
    return winningTypes.get("one pair");
  }

  return winningTypes.get("high card");
}

// loop through hands and return arrays of hands sorted by winning condition
// example all onne pair hands, all two pair hands, etc.
function sortWinningHandTypesIntoSegmentedArrays(
  hands: [number[], number][],
): [number[], number][][] {
  const sortedHands: [number[], number][][] = [];
  for (let i = 0; i < 7; i++) {
    sortedHands.push([]);
  }

  for (const hand of hands) {
    const handType = getHandType(hand[0])!;
    sortedHands[handType].push(hand);
  }

  return sortedHands;
}

function compareMatchingHandsWinByHighestCard(
  hand1: number[],
  hand2: number[],
): number {
  // do not sort the hands as order is important
  // compare high cards
  for (let i = 0; i < 5; i++) {
    if (hand1[i] > hand2[i]) {
      return -1;
    } else if (hand1[i] < hand2[i]) {
      return 1;
    }
  }
  // hands are equal
  return 0;
}

function createTupleOfHandsFromInput(lines: string[]): [number[], number][] {
  const hands: [number[], number][] = [];

  for (const line of lines) {
    const cards = line.split(" ");
    const hand1: number[] = cards[0]
      .split("")
      .map((card) => cardValues.get(card)!);
    const bid: number = parseInt(cards[1]);

    hands.push([hand1, bid]);
  }

  return hands;
}

const hands = createTupleOfHandsFromInput(lines);
let sortedHands = sortWinningHandTypesIntoSegmentedArrays(hands);

// loop through sorted hands and compare hands of the same type

for (let i = 0; i < 7; i++) {
  sortedHands[i].sort((a, b) =>
    compareMatchingHandsWinByHighestCard(b[0], a[0]),
  );
}
sortedHands = sortedHands.filter((handSegment) => handSegment.length > 0);
// now combine all the sorted hands into one array by hand type
const sortedHandsByType: [number[], number][] = [];
for (let i = 0; i < sortedHands.length; i++) {
  sortedHandsByType.push(...sortedHands[i]);
}

console.log(sortedHandsByType);

let totalWinnings = 0;
for (let i = 0; i < sortedHandsByType.length; i++) {
  totalWinnings += sortedHandsByType[i][1] * (i + 1);
}

output = totalWinnings.toString();

console.log(output);
await writeOutput(output);
