// read the input from puzzleInput.txt
// Advent of Code 2023 day 5 part 1

import { join as pathJoin } from "node:path";

const dirname = import.meta.dir;

const readInput = async () => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  // return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string) => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

const input = await readInput();
const lines = input.split("\n");
let output: string = "";

// Begin day 5 part 1 code
const trimmedLines = lines.filter((line) => line.trim() !== "");

const seeds = trimmedLines[0].split(": ")[1].split(" ");
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
  const ranges = trimmedLines[lineIndex].trim().split(" ");
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

const createLookupTable = (maps: number[][]) => {
  const lookupTable = new Map();
  for (const map of maps) {
    for (let i = 0; i < map[2]; i++) {
      lookupTable.set(map[1] + i, map[0] + i);
    }
  }
  return lookupTable;
};

const seedToSoilLookup = createLookupTable(seedToSoilMap);
const soilToFertilizerLookup = createLookupTable(soilToFertilizerMap);
const fertilizerToWaterLookup = createLookupTable(fertilizerToWaterMap);
const waterToLightLookup = createLookupTable(waterToLightMap);
const lightToTemperatureLookup = createLookupTable(lightToTemperatureMap);
const temperatureToHumidityLookup = createLookupTable(temperatureToHumidityMap);
const humidityToLocationLookup = createLookupTable(humidityToLocationMap);

const mapToNext = (value: number, lookupTable: Map<number, number>): number => {
  return lookupTable.get(value) || value;
};

const locationPerSeed: Map<number, number> = new Map();

for (const seedStr of seeds) {
  const seed = parseInt(seedStr);
  let nextVal = seed;

  nextVal = mapToNext(nextVal, seedToSoilLookup);
  nextVal = mapToNext(nextVal, soilToFertilizerLookup);
  nextVal = mapToNext(nextVal, fertilizerToWaterLookup);
  nextVal = mapToNext(nextVal, waterToLightLookup);
  nextVal = mapToNext(nextVal, lightToTemperatureLookup);
  nextVal = mapToNext(nextVal, temperatureToHumidityLookup);
  nextVal = mapToNext(nextVal, humidityToLocationLookup);

  locationPerSeed.set(seed, nextVal);
}

// get the seed with the lowest location number
let lowestLocation = Infinity;
let lowestLocationSeed = -1;

for (const [seed, location] of locationPerSeed) {
  if (location < lowestLocation) {
    lowestLocation = location;
    lowestLocationSeed = seed;
  }
}

output = `The seed with the lowest location number is ${lowestLocationSeed} with a location number of ${lowestLocation}`;

console.log(output);
await writeOutput(output);
