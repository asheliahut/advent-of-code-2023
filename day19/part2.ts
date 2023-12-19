// read the input from puzzleInput.txt
// Advent of Code 2023 day 19 part 2

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

// Begin day 19 part 2 code

type Rule = {
  param: string;
  operator: "<" | ">";
  value: number;
  nextWorkflow: string;
};

type Workflow = {
  rules: Rule[];
  defaultWorkflow: string;
};

type Range = Record<string, [number, number]>;

function parseWorkflows(rules: string[]): Map<string, Workflow> {
  const workflows = new Map<string, Workflow>();

  for (let line of rules) {
    const name: string = line.substring(0, line.indexOf("{"));
    const rules = line
      .substring(line.indexOf("{") + 1, line.indexOf("}"))
      .split(",");
    const workflowRules: Rule[] = [];
    let defaultWorkflow = rules.pop()!;

    for (let rule of rules) {
      const [condition, nextWorkflow] = rule.split(":");
      workflowRules.push({
        param: condition.substring(0, 1),
        operator: condition.substring(1, 2) as "<" | ">",
        value: parseInt(condition.substring(2, condition.length)),
        nextWorkflow,
      });
    }

    workflows.set(name, { rules: workflowRules, defaultWorkflow });
  }

  return workflows;
}

function copyRange(range: Range): Range {
  return JSON.parse(JSON.stringify(range));
}

const getRanges = (
  workflows: Map<string, Workflow>,
  currentWorkflow: string,
  range: Range,
): Range[] => {
  if (currentWorkflow === "R") return [];
  if (currentWorkflow === "A") return [copyRange(range)];

  const workflow: Workflow = workflows.get(currentWorkflow)!;

  const ranges: Range[] = [];

  for (const rule of workflow.rules) {
    if (rule.operator === "<") {
      const newRange = copyRange(range);
      newRange[rule.param][1] = rule.value - 1;

      ranges.push(...getRanges(workflows, rule.nextWorkflow, newRange));

      range[rule.param][0] = rule.value;
    }

    if (rule.operator === ">") {
      const newRange = copyRange(range);
      newRange[rule.param][0] = rule.value + 1;

      ranges.push(...getRanges(workflows, rule.nextWorkflow, newRange));

      range[rule.param][1] = rule.value;
    }
  }

  ranges.push(...getRanges(workflows, workflow.defaultWorkflow, range));

  return ranges;
};

const endOfRules: number = lines.indexOf("");
const workflows = parseWorkflows(lines.splice(0, endOfRules));
const baseRanges: Range = {
  x: [1, 4000],
  m: [1, 4000],
  a: [1, 4000],
  s: [1, 4000],
};

let totalOfRatingNumbersOfAcceptedParts: number = getRanges(
  workflows,
  "in",
  baseRanges,
)
  .map((range) => {
    console.log(range);
    return Object.values(range).reduce(
      (acc, [min, max]) => acc * (max - min + 1),
      1,
    );
  })
  .reduce((acc: number, v: number) => acc + v, 0);

output = totalOfRatingNumbersOfAcceptedParts.toString();

console.log(output);
await writeOutput(output);
