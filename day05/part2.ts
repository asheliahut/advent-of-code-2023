// read the input from puzzleInput.txt
// Advent of Code 2023 day 5 part 2

import { join as pathJoin } from "node:path";
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads";

function* generateSeedBatches(
  seeds: string[],
  batchSize: number,
  offset: number,
) {
  let currentSeed = parseInt(seeds[0]);
  let totalSeeds = 0;

  for (let i = 1; i < seeds.length; i += 2) {
    const endSeed = parseInt(seeds[i]) + currentSeed;
    for (let j = currentSeed; j < endSeed; j++) {
      if (offset >= totalSeeds) {
        yield j;
      }
      totalSeeds++;

      if (batchSize + offset <= totalSeeds) {
        return;
      }
    }
    if (i + 1 < seeds.length) {
      currentSeed = parseInt(seeds[i + 1]);
    }
  }

  // maybe remove?
  yield currentSeed;
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

const dirname = import.meta.dir;

const readInput = async () => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(import.meta.dir, "part2.txt"), output);
};

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

// Begin day 5 part 2 code

const trimmedLines = lines.filter((line) => line.trim() !== "");

const seeds = trimmedLines[0].split(": ")[1].split(" ");

if (isMainThread) {
  // This code is executed in the main thread

  // Split seeds into batches and create workers

  let lowestLocation = Infinity;
  const workerPromises = [];
  // compute the range of seeds to be processed by each worker from the ranges
  // [destinationRange, sourceRange, rangeLength]
  let totalSeeds = 0;

  for (let i = 0; i < seeds.length; i += 2) {
    const length = parseInt(seeds[i + 1]);
    totalSeeds += length;
  }

  console.log(totalSeeds);

  const batch = Math.ceil(totalSeeds / 24);

  for (let offset = 0; offset < totalSeeds + batch; offset += batch) {
    // console.log({ seedBatch, offsetWorkers });
    const workerPromise = new Promise<void>((resolve, reject) => {
      const worker = new Worker(import.meta.path, {
        workerData: {
          offset,
          batch: batch,
        },
      });

      worker.on("message", (location) => {
        lowestLocation = Math.min(lowestLocation, location);
      });

      worker.on("error", (err) => {
        console.error(err);
        reject(err);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(new Error(`Worker stopped with exit code ${code}`));
          reject(new Error(`Worker stopped with exit code ${code}`));
        } else {
          resolve();
        }
      });
    });

    workerPromises.push(workerPromise);
  }

  try {
    await Promise.all(workerPromises);
    console.log(`Lowest location is ${lowestLocation}`);
    await writeOutput(lowestLocation.toString());
  } catch (error) {
    console.error("An error occurred:", error);
  }
} else {
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

  // This code is executed in worker threads

  const { offset, batch } = workerData;

  const seedBatchGenerator = generateSeedBatches(seeds, batch, offset);

  let batchLowestLocation = Infinity;
  for (const seed of seedBatchGenerator) {
    let nextVal = seed;

    nextVal = mapToNext(nextVal, seedToSoilMap);
    nextVal = mapToNext(nextVal, soilToFertilizerMap);
    nextVal = mapToNext(nextVal, fertilizerToWaterMap);
    nextVal = mapToNext(nextVal, waterToLightMap);
    nextVal = mapToNext(nextVal, lightToTemperatureMap);
    nextVal = mapToNext(nextVal, temperatureToHumidityMap);
    nextVal = mapToNext(nextVal, humidityToLocationMap);

    batchLowestLocation = Math.min(batchLowestLocation, nextVal);
  }

  parentPort!.postMessage(batchLowestLocation);
}
