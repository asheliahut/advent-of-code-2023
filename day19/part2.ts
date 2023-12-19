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

type ParsedCondition = {
  param: string;
  operator: "<" | ">";
  value: number;
};

type Rule = {
  condition: ParsedCondition;
  nextWorkflow: string;
};

type Workflow = {
  rules: Rule[];
  defaultWorkflow: string;
};

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
        condition: {
          param: condition.substring(0, 1),
          operator: condition.substring(1, 2) as "<" | ">",
          value: parseInt(condition.substring(2, condition.length)),
        },
        nextWorkflow,
      });
    }

    workflows.set(name, { rules: workflowRules, defaultWorkflow });
  }

  return workflows;
}

function evaluateCondition(
  condition: ParsedCondition,
  params: Record<string, number>,
): boolean {
  switch (condition.operator) {
    case "<":
      return params[condition.param] < condition.value;
    case ">":
      return params[condition.param] > condition.value;
    default:
      return false;
  }
}

function processPartAccepted(
  workflowName: string,
  params: Record<string, number>,
  workflows: Map<string, Workflow>,
): boolean {
  let currentWorkflow = workflows.get(workflowName);
  if (!currentWorkflow) return false;

  while (currentWorkflow) {
    let ruleMatched = false;

    for (let rule of currentWorkflow.rules) {
      if (evaluateCondition(rule.condition, params)) {
        if (rule.nextWorkflow === "A") return true;
        if (rule.nextWorkflow === "R") return false;
        currentWorkflow = workflows.get(rule.nextWorkflow);
        ruleMatched = true;
        break;
      }
    }

    if (!ruleMatched) {
      if (currentWorkflow!.defaultWorkflow === "A") return true;
      if (currentWorkflow!.defaultWorkflow === "R") return false;
      currentWorkflow = workflows.get(currentWorkflow!.defaultWorkflow);
    }
  }

  return false;
}

// Example usage

function findRelevantRanges(
  workflows: Map<string, Workflow>,
): Record<string, { min: number; max: number }> {
  const ranges: Record<string, { min: number; max: number }> = {
    x: { min: 4000, max: 1 },
    m: { min: 4000, max: 1 },
    a: { min: 4000, max: 1 },
    s: { min: 4000, max: 1 },
  };

  for (const workflow of workflows.entries()) {
    for (const rule of workflow[1].rules.entries()) {
      const valueCheckOperator: "<" | ">" = rule[1].condition.operator as
        | "<"
        | ">";
      const valueCheckValue: number = rule[1].condition.value;
      const param = rule[1].condition.param;

      if (valueCheckOperator === "<") {
        ranges[param].min = Math.min(valueCheckValue, ranges[param].min);
      } else if (valueCheckOperator === ">") {
        ranges[param].max = Math.max(valueCheckValue, ranges[param].max);
      }
    }
  }

  return ranges;
}

function* generateOptimizedCombinations(
  ranges: Record<string, { min: number; max: number }>,
): Generator<Record<string, number>> {
  for (let x = ranges.x.min; x <= ranges.x.max; x++) {
    for (let m = ranges.m.min; m <= ranges.m.max; m++) {
      for (let a = ranges.a.min; a <= ranges.a.max; a++) {
        for (let s = ranges.s.min; s <= ranges.s.max; s++) {
          yield { x, m, a, s };
        }
      }
    }
  }
}

const endOfRules: number = lines.indexOf("");
const workflows = parseWorkflows(lines.splice(0, endOfRules));

const ranges = findRelevantRanges(workflows);
// console.log(ranges);

let totalOfRatingNumbersOfAcceptedParts: number = 0;

for (const pr of generateOptimizedCombinations(ranges)) {
  if (processPartAccepted("in", pr, workflows)) {
    totalOfRatingNumbersOfAcceptedParts += pr.x + pr.m + pr.a + pr.s;
  }
}

output = totalOfRatingNumbersOfAcceptedParts.toString();

console.log(output);
await writeOutput(output);
