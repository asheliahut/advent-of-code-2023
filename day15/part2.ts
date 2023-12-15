// read the input from puzzleInput.txt
// Advent of Code 2023 day 15 part 2

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
const lines = input.split(",");
let output: string = "";

// Begin day 15 part 2 code

function getHashValue(chars: string[]): number {
  let currentValue = 0;
  chars.forEach((char) => {
    const asciiCodeOfChar = char.charCodeAt(0);
    currentValue += asciiCodeOfChar;
    currentValue *= 17;
    currentValue %= 256;
  });
  return currentValue;
}

class Box {
  public lensSlots: LensQueue = new LensQueue();
  public boxNumber: number = 0;

  constructor(boxNumber: number) {
    this.boxNumber = boxNumber;
  }
}

class Lens {
  public label: string = "";
  public focalLength: number = 0;

  constructor(label: string, focalLength: number) {
    this.label = label;
    this.focalLength = focalLength;
  }
}

// create a queue of lenses that has a max size of 9

class LensQueue {
  public lenses: (Lens | undefined)[] = Array<Lens>(9);
  size: number = 0;
  maxSize: number = 9;

  constructor() {
    this.lenses.fill(undefined);
  }

  public enqueueEqual(lens: Lens) {
    if (this.findAndReplaceLens(lens.label, lens.focalLength)) {
      return;
    }

    this.lenses[this.size] = lens;
    this.size++;
    return;
  }

  public findAndRemoveLens(label: string): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      if (this.lenses[i] == undefined) {
        continue;
      }

      if (this.lenses[i]!.label == label) {
        this.lenses[i] = undefined;
        this.size--;
        // now move all the lenses forward to the end of the lenses array

        let j = 0;
        let lastLensIndex = 0;
        const newLenses: (Lens | undefined)[] = Array(this.maxSize).fill(
          undefined,
        );
        // keep going until you hit the end of the array
        while (j < this.maxSize) {
          if (this.lenses[j] == undefined) {
            j++;
            continue;
          } else {
            // move the lens to the end of the array
            newLenses[lastLensIndex] = this.lenses[j];
            lastLensIndex++;
            j++;
          }
        }
        this.lenses = newLenses;
        return true;
      }
    }
    return false;
  }

  private findAndReplaceLens(label: string, focalLength: number): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      if (this.lenses[i] == undefined) {
        continue;
      }
      if (this.lenses[i]!.label === label) {
        this.lenses[i]!.focalLength = focalLength;
        return true;
      }
    }
    return false;
  }

  public isEmpty(): boolean {
    return this.size == 0;
  }
}

const boxes: Box[] = [];

for (let i = 0; i < 256; i++) {
  const box = new Box(i);
  boxes.push(box);
}

for (const line of lines) {
  let chars = "";
  let labelValue = 0;
  if (line.includes("-")) {
    chars = line.split("-")[0];
    labelValue = getHashValue(chars.split(""));

    boxes[labelValue].lensSlots.findAndRemoveLens(chars);
  } else {
    chars = line.split("=")[0];
    const focalLength = parseInt(line.split("=")[1]);
    labelValue = getHashValue(chars.split(""));

    boxes[labelValue].lensSlots.enqueueEqual(new Lens(chars, focalLength));
  }
}

let focusingPower = 0;
for (const box of boxes) {
  if (box.lensSlots.isEmpty()) {
    continue;
  }

  for (const lens in box.lensSlots.lenses) {
    if (box.lensSlots.lenses[lens] == undefined) {
      continue;
    }

    const lensIndexFocus = parseInt(lens) + 1;
    const currentFocalLength = box.lensSlots.lenses[lens]!.focalLength;
    focusingPower += (1 + box.boxNumber) * lensIndexFocus * currentFocalLength;
  }
}

output = focusingPower.toString();

console.log(output);
await writeOutput(output);
