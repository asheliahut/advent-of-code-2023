// read the input from puzzleInput.txt
// Advent of Code 2023 day 15 part 2
import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part2.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split(",");
let output: string = "";

// Begin day 15 part 2 code

async function getHashValue(chars: string[]): Promise<number> {
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

class LensQueue {
  public lenses: Lens[] = [];
  private size: number = 0;
  private maxSize: number = 9;

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
      if (this.lenses[i]?.label == label) {
        this.size--;
        this.lenses.splice(i, 1);

        return true;
      }
    }
    return false;
  }

  private findAndReplaceLens(label: string, focalLength: number): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      if (this.lenses[i]?.label === label) {
        this.lenses[i].focalLength = focalLength;
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
  let label: string = "";
  let labelValue: number = 0;
  if (line.includes("-")) {
    label = line.split("-")[0];
    labelValue = await getHashValue(label.split(""));

    boxes[labelValue].lensSlots.findAndRemoveLens(label);
  } else {
    label = line.split("=")[0];
    const focalLength: number = parseInt(line.split("=")[1]);
    labelValue = await getHashValue(label.split(""));

    boxes[labelValue].lensSlots.enqueueEqual(new Lens(label, focalLength));
  }
}

let focusingPower: number = 0;
for (const box of boxes) {
  if (box.lensSlots.isEmpty()) {
    continue;
  }

  for (const lens in box.lensSlots.lenses) {
    const lensIndexFocus: number = parseInt(lens) + 1;
    const currentFocalLength: number = box.lensSlots.lenses[lens]!.focalLength;
    focusingPower += (1 + box.boxNumber) * lensIndexFocus * currentFocalLength;
  }
}

output = focusingPower.toString();

console.log(output);
await writeOutput(output);
