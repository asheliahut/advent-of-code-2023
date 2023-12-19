// read the input from puzzleInput.txt
// Advent of Code 2023 day 18 part 2

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

// Begin day 18 part 2 code

type Point = {
  x: number;
  y: number;
};

function getDistanceAndDirectionFromColor(color: string): [number, string] {
  const brokenOutColor: string[] = color.substring(1).split("");
  const tempDirection = brokenOutColor.pop();
  const distance = parseInt(brokenOutColor.join(""), 16);

  switch (tempDirection) {
    case "0":
      return [distance, "R"];
    case "1":
      return [distance, "D"];
    case "2":
      return [distance, "L"];
    case "3":
      return [distance, "U"];
    default:
      throw new Error("invalid direction");
  }
}

function calculatePolygonArea(vertices: Point[]): number {
  let area = 0;
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    let j = (i + 1) % n; // Next vertex index, wrapping around to 0
    area += vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
  }

  return Math.abs(area / 2.0);
}

// example line R 6 (#70c710)
const distanceAndDirections: [number, string][] = lines.map((line) => {
  const color: string = line.substring(line.indexOf("#"), line.length - 1);
  return getDistanceAndDirectionFromColor(color);
});

const points: Point[] = [];
let currentPoint: Point = { x: 0, y: 0 };
let perimeter: number = 0;
points.push(currentPoint);
for (const [distance, direction] of distanceAndDirections) {
  perimeter += distance;
  switch (direction) {
    case "R":
      currentPoint.x += distance;
      break;
    case "D":
      currentPoint.y -= distance;
      break;
    case "L":
      currentPoint.x -= distance;
      break;
    case "U":
      currentPoint.y += distance;
      break;
  }
  points.push({ x: currentPoint.x, y: currentPoint.y });
}

const area: number = calculatePolygonArea(points) + Math.ceil(perimeter / 2);
output = area.toString();

console.log(output);
await writeOutput(output);
