// read the input from puzzleInput.txt
// Advent of Code 2023 day 19 part 1

import { join as pathJoin } from "node:path";

const dirname: string = import.meta.dir;

const readInput = async (): Promise<string> => {
  // return Bun.file(pathJoin(dirname, "example.txt")).text();
  return Bun.file(pathJoin(dirname, "puzzleInput.txt")).text();
};

const writeOutput = async (output: string): Promise<void> => {
  await Bun.write(pathJoin(dirname, "part1.txt"), output);
};

const input: string = await readInput();
const lines: string[] = input.split("\n");
let output: string = "";

// Begin day 19 part 1 code

// x Extremely cool looking
// m Musical (noise when hit)
// a Aerodynamic
// s Shiny

type Rule = {
  category: "x" | "m" | "a" | "s";
  valueCheckOperator: "<" | ">";
  valueCheckValue: number;
  whereToSend: "A" | "R" | string;
};

type DefaultRule = {
  whereToSend: "A" | "R" | string;
};

type RuleSet = {
  defaultRule: DefaultRule;
  rules: Rule[];
};

type PartRating = {
  category: "x" | "m" | "a" | "s";
  value: number;
};

class Workflow {
  public rules: RuleSet;
  public name: string;

  constructor(rules: RuleSet, name: string) {
    this.rules = rules;
    this.name = name;
  }
}

function parseDefaultRule(rule: string): DefaultRule {
  const whereToSend: "A" | "R" | string = rule as "A" | "R" | string;
  return {
    whereToSend,
  };
}

// get all the workflows until we hit a blank line
// an example workflow: px{a<2006:qkq,m>2090:A,rfg}
// px = name, { = start of rules, } = end of rules
// a = category, < = value check operator, 2006 = value check value, qkq = where to send , is end of rule
// if at end there is no valid category then send to default rule the final value
const baseWorkflows: Workflow[] = [];
const endOfRules: number = lines.indexOf("");
for (let i = 0; i < endOfRules; i++) {
  const line: string = lines[i];
  const name: string = line.substring(0, line.indexOf("{"));
  const rulesArr: string[] = line
    .substring(line.indexOf("{") + 1, line.indexOf("}"))
    .split(",");
  const rules: RuleSet = {
    defaultRule: parseDefaultRule(rulesArr.pop()!),
    rules: [],
  };
  for (const rule of rulesArr) {
    const category: "x" | "m" | "a" | "s" = rule.substring(0, 1) as
      | "x"
      | "m"
      | "a"
      | "s";
    const valueCheckOperator: "<" | ">" = rule.substring(1, 2) as "<" | ">";
    const valueCheckValue: number = parseInt(
      rule.substring(2, rule.indexOf(":")),
    );
    const whereToSend: "A" | "R" | string = rule.substring(
      rule.indexOf(":") + 1,
      rule.length,
    ) as "A" | "R" | string;

    rules.rules.push({
      category,
      valueCheckOperator,
      valueCheckValue,
      whereToSend,
    });
  }
  baseWorkflows.push(new Workflow(rules, name));
}

const partRatings: PartRating[][] = [];
const partRatingsInput: string[] = lines.splice(endOfRules + 1, lines.length);

for (const pr of partRatingsInput) {
  const categories: string[] = pr.substring(1, pr.length - 1).split(",");
  const partRating: PartRating[] = [];
  for (const category of categories) {
    const cat: "x" | "m" | "a" | "s" = category.substring(0, 1) as
      | "x"
      | "m"
      | "a"
      | "s";
    const value: number = parseInt(category.substring(2, category.length));

    partRating.push({
      category: cat,
      value,
    });
  }

  partRatings.push(partRating);
}

// return whether or not the part is accepted
function processPartAccepted(
  workflowQueue: Workflow[],
  partRating: PartRating[],
): boolean {
  while (workflowQueue.length > 0) {
    const workflow: Workflow = workflowQueue.shift()!;
    const rules: RuleSet = workflow.rules;
    let rulesChecked: boolean = false;

    // console.log(workflow.name);
    // console.log(rules);

    for (const rule of rules.rules) {
      const partRatingForCategory: PartRating | undefined = partRating.find(
        (pr) => pr.category === rule.category,
      );
      if (partRatingForCategory) {
        if (rule.valueCheckOperator === "<") {
          if (partRatingForCategory.value < rule.valueCheckValue) {
            if (rule.whereToSend === "A") {
              return true;
            } else if (rule.whereToSend === "R") {
              return false;
            } else {
              workflowQueue.push(
                baseWorkflows.find((w) => w.name === rule.whereToSend)!,
              );
              rulesChecked = true;
              break;
            }
          }
        } else if (rule.valueCheckOperator === ">") {
          if (partRatingForCategory.value > rule.valueCheckValue) {
            if (rule.whereToSend === "A") {
              return true;
            } else if (rule.whereToSend === "R") {
              return false;
            } else {
              // console.log("Sending to " + rule.whereToSend);
              workflowQueue.push(
                baseWorkflows.find((w) => w.name === rule.whereToSend)!,
              );
              rulesChecked = true;
              break;
            }
          }
        }
      }
    }

    if (!rulesChecked) {
      // if we get here then we need to send to default rule
      if (rules.defaultRule.whereToSend === "A") {
        // console.log("Error: default rule is A");
        return true;
      } else if (rules.defaultRule.whereToSend === "R") {
        // console.log("Error: default rule is R")
        return false;
      } else {
        // console.log("Sending to default rule");
        workflowQueue.push(
          baseWorkflows.find((w) => w.name === rules.defaultRule.whereToSend)!,
        );
      }
    }
  }

  console.log("Error: workflowQueue is empty");
  return false;
}

let totalOfRatingNumbersOfAcceptedParts: number = 0;

for (const pr of partRatings) {
  const workflowQueue: Workflow[] = [
    baseWorkflows.find((w) => w.name === "in")!,
  ];

  if (processPartAccepted(workflowQueue, pr)) {
    totalOfRatingNumbersOfAcceptedParts += pr.reduce(
      (acc, cur) => acc + cur.value,
      0,
    );
  }
}

output = totalOfRatingNumbersOfAcceptedParts.toString();

console.log(output);
await writeOutput(output);
