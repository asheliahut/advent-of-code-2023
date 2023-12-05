// read the input from puzzleInput.txt
// Advent of Code 2023 day 5 part 2

import { join as pathJoin } from "node:path";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

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

// Begin day 5 part 2 code

const trimmedLines = lines.filter((line) => line.trim() !== "");

const seeds = trimmedLines[0].split(": ")[1].split(" ");

function* generateSeedBatches(seeds: string[], batchSize: number) {
  let currentSeed = parseInt(seeds[0]);
  let batch = [];

  for (let i = 1; i < seeds.length; i += 2) {
    const endSeed = parseInt(seeds[i]) + currentSeed;
    for (let j = currentSeed; j < endSeed; j++) {
      batch.push(j);
      if (batch.length === batchSize) {
        yield batch;
        batch = [];
      }
    }
    if (i + 1 < seeds.length) {
      currentSeed = parseInt(seeds[i + 1]);
    }
  }

  if (batch.length > 0) {
    yield batch;
  }
}

console.log("hello");

// create the seed-to-soil map from n number of lines beflow "seed-to-soil map:"
const seedToSoilMap: number[][] = [];
const soilToFertilizerMap: number[][] = [];
const fertilizerToWaterMap: number[][] = [];
const waterToLightMap: number[][] = [];
const lightToTemperatureMap: number[][] = [];
const temperatureToHumidityMap: number[][] = [];
const humidityToLocationMap: number[][] = [];

let lineIndex = 2;

while (trimmedLines[lineIndex] !== "soil-to-fertilizer map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  seedToSoilMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (trimmedLines[lineIndex] !== "fertilizer-to-water map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  soilToFertilizerMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (trimmedLines[lineIndex] !== "water-to-light map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  fertilizerToWaterMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (trimmedLines[lineIndex] !== "light-to-temperature map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  waterToLightMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (trimmedLines[lineIndex] !== "temperature-to-humidity map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  lightToTemperatureMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (trimmedLines[lineIndex] !== "humidity-to-location map:") {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  temperatureToHumidityMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

lineIndex++;

while (lineIndex < trimmedLines.length) {
  const ranges = trimmedLines[lineIndex].split(" ");
  const destinationRange = parseInt(ranges[0]);
  const sourceRange = parseInt(ranges[1]);
  const rangeLength = parseInt(ranges[2]);

  humidityToLocationMap.push([destinationRange, sourceRange, rangeLength]);
  lineIndex++;
}

const mapToNext = (value: number, maps: number[][]): number => {
  for (const map of maps) {
    const [destinationRange, sourceRange, rangeLength] = map;
    if (value >= sourceRange && value < sourceRange + rangeLength) {
      return destinationRange + (value - sourceRange);
    }
  }
  return value;
};

let lowestLocation = Infinity;
const batchSize = 50000; // Adjust based on performance and memory considerations
const seedBatchGenerator = generateSeedBatches(seeds, batchSize);

for (const seedBatch of seedBatchGenerator) {
  const locationPerSeed: number[][] = [];
  for (const seed of seedBatch) {
    let nextVal = seed;

    nextVal = mapToNext(nextVal, seedToSoilMap);
    nextVal = mapToNext(nextVal, soilToFertilizerMap);
    nextVal = mapToNext(nextVal, fertilizerToWaterMap);
    nextVal = mapToNext(nextVal, waterToLightMap);
    nextVal = mapToNext(nextVal, lightToTemperatureMap);
    nextVal = mapToNext(nextVal, temperatureToHumidityMap);
    nextVal = mapToNext(nextVal, humidityToLocationMap);

    locationPerSeed.push([seed, nextVal]);
  }

  lowestLocation = Math.min(lowestLocation, ...locationPerSeed.map((seed) => seed[1]));
}

output = lowestLocation.toString();

console.log(output);
await writeOutput(output);
