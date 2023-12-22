// read the input from puzzleInput.txt
// Advent of Code 2023 day 20 part 1

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  return Bun.file(pathJoin(dirname, "example.txt")).text();
  // return Bun.file(pathJoin(dirname, "example2.txt")).text();
  // return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 20 part 1 code

type PulseType = "HIGH" | "LOW";
type Graph = Map<string, [Module, string[]]>;

abstract class Module {
  public abstract prefix: string;
  public name: string;
  public destinationModules: Module[] = [];
  public pulse: PulseType = "LOW";

  constructor(name: string) {
    this.name = name;
  }

  public abstract receivePulse(pulse: PulseType): void;

  public setDestinationModules(destinationModules: Module[]): void {
    this.destinationModules = destinationModules;
  }
}

// prefix %
class FlipFlopModule extends Module {
  // false is off and true is on
  public state: boolean = false;
  public prefix: string = "%";

  public receivePulse(pulse: PulseType): void {
    if (pulse === "LOW") {
      this.state = !this.state;
    }
    this.pulse = this.state ? "HIGH" : "LOW";
  }

  public getStateReadable(): string {
    return this.state ? "ON" : "OFF";
  }
}

// prefix &
class ConjunctionModule extends Module {
  public prefix: string = "&";
  public inputModules: Map<Module, number> = new Map<Module, number>();
  public seenModules: Map<Module, number> = new Map<Module, number>();
  public get isReadyForNextPulse(): boolean {
    for (const [module, timesNeededToSee] of this.inputModules) {
      if (!this.seenModules.has(module)) {
        return false;
      }

      if (this.seenModules.get(module)! < timesNeededToSee) {
        return false;
      }
    }

    return true;
  }
  private mostRecentPulses: PulseType[] = ["LOW"];

  // a conjunction module is ready for the next pulse when it has received a pulse from all of its input modules
  public receivePulse(pulse: PulseType): void {
    this.mostRecentPulses.push(pulse);

    if (this.isReadyForNextPulse) {
      this.seenModules.clear();
      if (this.mostRecentPulses.every((pulse) => pulse === "HIGH")) {
        this.pulse = "LOW";
      }

      this.pulse = "HIGH";
    }
  }

  public addInputModule(inputModule: Module): void {
    if (this.inputModules.has(inputModule)) {
      this.inputModules.set(
        inputModule,
        this.inputModules.get(inputModule)! + 1,
      );
    } else {
      this.inputModules.set(inputModule, 1);
    }

    console.log(this.inputModules);
  }
}

class BroadcastModule extends Module {
  public prefix: string = "";
  private initialPulse: PulseType = "LOW";

  // should only receive one pulse from the button module
  public receivePulse(pulse: PulseType): void {
    this.initialPulse = pulse;
    this.pulse = this.initialPulse;
  }
}

function parseInput(lines: string[]): [Graph, Module[]] {
  const modules: Module[] = [];
  const moduleMap: Graph = new Map<string, [Module, string[]]>();

  for (const line of lines) {
    const [prefixAndName, destinations] = line.split(" -> ");

    if (prefixAndName === "broadcaster") {
      const module: Module = new BroadcastModule(prefixAndName);
      moduleMap.set(prefixAndName, [module, destinations.split(", ")]);
      continue;
    }

    const prefix = prefixAndName[0];
    const name = prefixAndName.substring(1, prefixAndName.length);

    // create the module
    if (prefix === "%") {
      const module: Module = new FlipFlopModule(name);
      moduleMap.set(name, [module, destinations.split(", ")]);
    } else if (prefix === "&") {
      const module: Module = new ConjunctionModule(name);
      moduleMap.set(name, [module, destinations.split(", ")]);
    } else {
      throw new Error("Invalid prefix");
    }
  }

  for (const [_, [module, destinations]] of moduleMap) {
    const destinationModules: Module[] = [];
    for (const destination of destinations) {
      const [destinationModule, _] = moduleMap.get(destination)!;
      destinationModules.push(destinationModule);

      if (destinationModule instanceof ConjunctionModule) {
        destinationModule.addInputModule(module);
      }
    }

    module.setDestinationModules(destinationModules);
    modules.push(module);
  }

  // return modules with broadcaster at the front
  return [
    moduleMap,
    modules.sort((a, b) => {
      return a.name === "broadcaster" ? -1 : 1;
    }),
  ];
}

// This function takes in a broadcaster and a list of modules and determines the number of high and low pulses per cycle
// a ConjunctionModule waits until it receives input from all of the modules pointing to it before it outputs a pulse
// a FlipFlopModule outputs a pulse every time it receives a pulse
// the BroadcasterModule outputs the initial pulse to start the cycle with a PulseType of ["LOW"]
// the cycle ends when the state of all flip flop modules is the same as it was at the beginning of the cycle
// function determineNumHighAndLowPerCycle(
//   initialModule: Module,
//   modules: Module[],
//   finalModuleInLoop: Module,
//   numHigh: number,
//   numLow: number,
// ): [number, number] {
//   const initialStates = getStatesOfFlipFlopModules(modules);
//   const modulesSeenPerDepth: Map<number, string[]> = new Map<
//     number,
//     string[]
//   >();
//   let hasSeenFinalLoop = false;
//   let currentDepth = 0;

//   // Using a queue for BFS with depth tracking
//   let queue: [Module, PulseType, number][] = [[initialModule, "LOW", 0]]; // The third element in the tuple is the depth

//   while (queue.length > 0) {
//     let [currentModule, pulse, depth] = queue.shift()!;

//     if (depth > currentDepth) {
//       console.log(`Depth increased from ${currentDepth} to ${depth}`);
//       currentDepth = depth;
//       modulesSeenPerDepth.clear();
//     }

//     if (
//       modulesSeenPerDepth.has(depth) &&
//       modulesSeenPerDepth.get(depth)!.includes(currentModule.name)
//     ) {
//       continue;
//     } else {
//       modulesSeenPerDepth.set(
//         depth,
//         modulesSeenPerDepth.has(depth)
//           ? [...modulesSeenPerDepth.get(depth)!, currentModule.name]
//           : [currentModule.name],
//       );
//     }

//     if (currentModule instanceof ConjunctionModule) {
//       console.log(currentModule.seenModules);
//       console.log(currentModule.inputModules);
//     }

//     // Process the current module
//     if (
//       (currentModule instanceof ConjunctionModule &&
//         currentModule.isReadyForNextPulse) ||
//       !(currentModule instanceof ConjunctionModule)
//     ) {
//       console.log(
//         `Processing ${currentModule.name} with pulse ${pulse} at depth ${depth}`,
//       );
//       let [newNumHigh, newNumLow, childModules] = processModule(
//         pulse,
//         currentModule,
//       );
//       numHigh += newNumHigh;
//       numLow += newNumLow;

//       // Enqueue child modules with incremented depth
//       for (const childModule of childModules) {
//         childModule.receivePulse(pulse);
//         queue.push([childModule, currentModule.pulse, depth + 1]);
//       }
//     }

//     if (currentModule === finalModuleInLoop) {
//       depth = 1;
//       hasSeenFinalLoop = true;
//       modulesSeenPerDepth.clear();

//       if (currentModule.destinationModules.length === 0) {
//         queue.push([initialModule, "LOW", 0]);
//       }
//     }

//     if (hasSeenFinalLoop) {
//       // Check states at the end of each level
//       const currentStates = getStatesOfFlipFlopModules(modules);
//       if (statesEqual(initialStates, currentStates)) {
//         console.log(`States are equal at depth ${depth}`);
//         return [numHigh, numLow];
//       }
//     }
//   }

//   return [numHigh, numLow];
// }

// function processModule(
//   pulse: PulseType,
//   currentModule: Module,
// ): [number, number, Module[]] {
//   let numHigh = 0,
//     numLow = 0;

//   if (pulse === "HIGH") numHigh++;
//   else numLow++;

//   const childModules = [];

//   // Add the destination modules to the list of child modules
//   for (const destination of currentModule.destinationModules) {
//     if (destination instanceof ConjunctionModule) {
//       if (destination.seenModules.has(currentModule)) {
//         destination.seenModules.set(
//           currentModule,
//           destination.seenModules.get(currentModule)! + 1,
//         );
//       } else {
//         destination.seenModules.set(currentModule, 1);
//       }

//       if (!destination.isReadyForNextPulse) {
//         continue;
//       }
//     }

//     childModules.push(destination);
//   }

//   return [numHigh, numLow, childModules];
// }

function getStatesOfFlipFlopModules(
  modules: Module[],
): Map<FlipFlopModule, boolean> {
  const states: Map<FlipFlopModule, boolean> = new Map<
    FlipFlopModule,
    boolean
  >();

  for (const module of modules) {
    if (module instanceof FlipFlopModule) {
      states.set(module, module.state);
    }
  }

  return states;
}

function statesEqual(
  states1: Map<FlipFlopModule, boolean>,
  states2: Map<FlipFlopModule, boolean>,
): boolean {
  for (const [module, state] of states1) {
    if (states2.get(module) !== state) {
      return false;
    }
  }

  return true;
}

const [graph, modules] = parseInput(lines);
const broadcaster = modules.shift() as BroadcastModule;
const timesButtonPressed = 1000;
const [numHighPerCycle, numLowPerCycle] = pressTheButton(graph, timesButtonPressed);

if (!finalLoopNode) {
  throw new Error("No final loop detected");
}

const [numHighPerCycle, numLowPerCycle] = determineNumHighAndLowPerCycle(
  broadcaster,
  modules,
  finalLoopNode,
  0,
  0,
);

const total =
  numHighPerCycle * timesButtonPressed * (numLowPerCycle * timesButtonPressed);

output = `Total: ${total} (numHighPerCycle: ${numHighPerCycle}, numLowPerCycle: ${numLowPerCycle})`;
console.log(output);
await writeOutput(output);
