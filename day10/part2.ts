import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Coefficients, Constraint, equalTo, Model, solve } from "yalps";

console.debug = () => { };

async function main() {
    const rawInput = await getInputRaw(10)
    const machineModels = parseMachineDefinitions(rawInput)
    const sln = solveMultipleMachines(machineModels)

    console.log(`The number of button presses required for all machines is ${sln}`)
}

// In retrospect this is actually a pretty easy task when you imagine it as a series of linear equations
// I don't feel like writing all the complicated matrix reduction logic for that, so I'll permit myself to use a package to solve LPs for me
// Therefore this task changes to parsing each machine into a linear problem ready for the package to solve

export function parseMachineDefinitions(machineDefinitions: string): Model[] {
    const rows = machineDefinitions.split('\n')
    return rows.map((r) => translateMachineDefinitionToLP(r))
}

export function translateMachineDefinitionToLP(machineDefinition: string): Model {
    const buttonStrings = [...machineDefinition.matchAll(/\(([^)]*)\)/g)].map(m => m[1]);
    const joltageStrings = machineDefinition.match(/\{(.*)\}/)?.[1].split(',') ?? null;

    if (!joltageStrings) {
        throw new Error('Failed to parse joltages')
    }

    // We'll call the number of times we press the first button b0, then b1, etc.
    // We need integer solutions for each of these variables
    const integers = Array.from({ length: buttonStrings.length }, (_, i) => `b${i}`);

    // The joltage amounts are constraints
    const constraints: Record<string, Constraint> = {};
    for (let i = 0; i < joltageStrings.length; i++) {
        constraints[`eq${i}`] = equalTo(Number(joltageStrings[i]));
    }

    // Now the hard part- for each button, identify the series of linear equations that correspond to the output joltages
    const variables: Record<string, Coefficients> = {};
    buttonStrings.forEach((v, index) => {
        const buttonName = integers[index];
        const buttonEffects = v.split(',').map((v) => Number(v))
        const temp: { total: number } & Record<string, number> = { total: 1 }
        for (const effect of buttonEffects) {
            temp[`eq${effect}`] = 1
        }
        variables[buttonName] = temp
    })

    let model: Model = {
        direction: "minimize" as const,
        objective: "total",
        constraints: constraints,
        variables: variables,
        integers: integers,
    }

    return model
}

export function solveMultipleMachines(machines: Model[]): number {
    // We want to sum the result from each machine
    let minimumButtonPresses: number = 0
    for (const machine of machines) {
        const result = solve(machine)
        console.debug(`Solved machine - result ${result.result}`)
        minimumButtonPresses += result.result
    }
    return minimumButtonPresses
}

main()