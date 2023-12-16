// read the input from puzzleInput.txt
// Advent of Code 2023 day 16 part 2

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
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 16 part 2 code

// . empty space
// / and \ are mirrors
// | and - are splitters
// enters top left goes right and hits obstacles

// hits empty space keeps going
// hits mirror goes up or down 90 degrees / = uo \ = down from left and / = down \ = up from left

type MirrorType = "/" | "\\";
type SplitterType = "|" | "-";
type Direction = "up" | "down" | "left" | "right";

class EmptySpace {
  public isEnergized: boolean = false;
  constructor(
    public x: number,
    public y: number,
  ) {
    this.x = x;
    this.y = y;
  }
}

class Mirror {
  public hitDirectionsSet: Set<Direction> = new Set();

  constructor(
    public mirrorType: MirrorType,
    public x: number,
    public y: number,
  ) {
    this.mirrorType = mirrorType;
    this.x = x;
    this.y = y;
  }

  markDirectionHit(direction: Direction): void {
    if (this.hitDirectionsSet.has(direction)) return;
    this.hitDirectionsSet.add(direction);
  }

  getDirection(entrance: Direction): Direction {
    this.markDirectionHit(entrance);

    if (this.mirrorType === "/") {
      if (entrance === "right") return "up";
      if (entrance === "left") return "down";
      if (entrance === "up") return "right";
      if (entrance === "down") return "left";
    }
    if (this.mirrorType === "\\") {
      if (entrance === "right") return "down";
      if (entrance === "left") return "up";
      if (entrance === "up") return "left";
      if (entrance === "down") return "right";
    }
    return "right";
  }
}

class Beam {
  constructor(
    public x: number,
    public y: number,
    public direction: Direction,
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  move(): void {
    if (this.direction === "right") this.x++;
    if (this.direction === "left") this.x--;
    if (this.direction === "up") this.y--;
    if (this.direction === "down") this.y++;
  }
}

class Splitter {
  public hitDirectionsSet: Set<Direction> = new Set();

  constructor(
    public splitterType: SplitterType,
    public x: number,
    public y: number,
  ) {
    this.splitterType = splitterType;
    this.x = x;
    this.y = y;
  }

  markDirectionHit(direction: Direction): void {
    if (this.hitDirectionsSet.has(direction)) return;
    this.hitDirectionsSet.add(direction);
  }

  getDirection(entrance: Direction): Direction | [Beam, Beam] {
    this.markDirectionHit(entrance);

    if (this.splitterType === "|") {
      if (entrance === "up") return "up";
      if (entrance === "down") return "down";
      if (entrance === "left") {
        return [
          new Beam(this.x, this.y + 1, "down"),
          new Beam(this.x, this.y - 1, "up"),
        ];
      }
      if (entrance === "right") {
        return [
          new Beam(this.x, this.y + 1, "down"),
          new Beam(this.x, this.y - 1, "up"),
        ];
      }
    }
    if (this.splitterType === "-") {
      if (entrance === "up") {
        return [
          new Beam(this.x - 1, this.y, "left"),
          new Beam(this.x + 1, this.y, "right"),
        ];
      }
      if (entrance === "down") {
        return [
          new Beam(this.x - 1, this.y, "left"),
          new Beam(this.x + 1, this.y, "right"),
        ];
      }
      if (entrance === "left") return "left";
      if (entrance === "right") return "right";
    }
    return "right";
  }
}

function parseLineToObjects(
  line: string,
  y: number,
): (EmptySpace | Mirror | Splitter)[] {
  const objects: (EmptySpace | Mirror | Splitter)[] = [];
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === ".") {
      objects.push(new EmptySpace(x, y));
    }
    if (char === "/" || char === "\\") {
      objects.push(new Mirror(char, x, y));
    }
    if (char === "|" || char === "-") {
      objects.push(new Splitter(char, x, y));
    }
  }
  return objects;
}

function getColumnAtIndex(
  pattern: (EmptySpace | Mirror | Splitter)[][],
  index: number,
): (EmptySpace | Mirror | Splitter)[] {
  const column: (EmptySpace | Mirror | Splitter)[] = [];
  for (const row of pattern) {
    column.push(row[index]);
  }
  return column;
}

// how many objects are energized
function generateEnergizedOutput(
  grid: (EmptySpace | Mirror | Splitter)[][],
): number {
  let energizedObjects = 0;
  grid.forEach((row) => {
    row.forEach((object) => {
      if (object instanceof EmptySpace && object.isEnergized)
        energizedObjects++;
      else if (object instanceof Mirror && object.hitDirectionsSet.size > 0)
        energizedObjects++;
      else if (object instanceof Splitter && object.hitDirectionsSet.size > 0)
        energizedObjects++;
    });
  });
  return energizedObjects;
}

const initialGrid: (EmptySpace | Mirror | Splitter)[][] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const objects = parseLineToObjects(line, i);
  initialGrid.push(objects);
}

const startingBeams: Beam[] = [];

// add all possible beams to the beams array and make clones of the grid per beam
for (const rowObj of initialGrid[0]) {
  startingBeams.push(new Beam(rowObj.x, rowObj.y, "down"));
}
for (const rowObj of initialGrid[initialGrid.length - 1]) {
  startingBeams.push(new Beam(rowObj.x, rowObj.y, "up"));
}
for (const columnObj of getColumnAtIndex(initialGrid, 0)) {
  startingBeams.push(new Beam(columnObj.x, columnObj.y, "right"));
}
for (const columnObj of getColumnAtIndex(
  initialGrid,
  initialGrid[0].length - 1,
)) {
  startingBeams.push(new Beam(columnObj.x, columnObj.y, "left"));
}

// clone the grid for each beam
const grids: (EmptySpace | Mirror | Splitter)[][][] = [];
for (const beam of startingBeams) {
  const newGrid = initialGrid.map((row) => {
    return row.map((object) => {
      if (object instanceof EmptySpace)
        return new EmptySpace(object.x, object.y);
      if (object instanceof Mirror)
        return new Mirror(object.mirrorType, object.x, object.y);
      if (object instanceof Splitter)
        return new Splitter(object.splitterType, object.x, object.y);
      throw new Error(
        "Object is not an instance of EmptySpace, Mirror, or Splitter",
      );
    });
  });
  grids.push(newGrid);
}

// start with first beam and traverse the grid following the beams direction
// if the beam hits a mirror change direction
// if the beam hits a splitter create a new beam in the direction of the splitter
// if the beam hits an empty space keep going
let largestEnergizedObjects = 0;

for (const startBeam of startingBeams) {
  const grid = grids.shift();
  const beams = [startBeam];

  if (grid === undefined) throw new Error("Beam is undefined");

  while (beams.length > 0) {
    const beam = beams.shift();
    if (beam === undefined) throw new Error("Beam is undefined");

    const object = grid[beam.y]?.[beam.x];

    if (object === undefined) continue;

    if (object instanceof EmptySpace) {
      object.isEnergized = true;
      beams.push(beam);
    }

    if (
      object instanceof Mirror &&
      !object.hitDirectionsSet.has(beam.direction)
    ) {
      beam.direction = object.getDirection(beam.direction);
      beams.push(beam);
    }
    if (
      object instanceof Splitter &&
      !object.hitDirectionsSet.has(beam.direction)
    ) {
      const newDirections = object.getDirection(beam.direction);
      if (newDirections instanceof Array) {
        beams.push(...newDirections);
      } else {
        beam.direction = newDirections;
        beams.push(beam);
      }
    }
    beam.move();
  }

  largestEnergizedObjects = Math.max(
    generateEnergizedOutput(grid),
    largestEnergizedObjects,
  );
}

output = `Energized objects: ${largestEnergizedObjects}`;

console.log(output);
await writeOutput(output);
