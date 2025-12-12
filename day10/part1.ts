import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

console.debug = () => { };

async function main() {
    const rawInput = await getInputRaw(10)
    const machines = defineMultipleMachines(rawInput)
    const sln = trySolveMachines(machines)

    console.log(`The number of button presses required for all machines is ${sln}`)
}

export function trySolveMachines(machines: Machine[]): number {

    const maxButtonPresses = 10; // Arbitrary limit
    const buttonPressCombinations: {
        buttons: number,
        presses: number,
        combinations: number[][]
    }[] = [] // Cache these so we're not constantly doing re-calculation
    let totalPressesToSolve: number = 0;

    machinesLoop:
    for (const machine of machines) {
        // Solve one machine at a time
        const numberOfButtons = machine.numberOfButtons()

        for (let i = 1; i <= maxButtonPresses; i++) {
            // Starting with one button press, try all the possible unique combinations for i button presses
            let combinations = buttonPressCombinations.find((c) => c.buttons === numberOfButtons && c.presses === i)?.combinations
            if (!combinations) {
                combinations = findUniqueWaysToPressXButtonsYTimes(numberOfButtons, i)
                buttonPressCombinations.push({
                    buttons: numberOfButtons,
                    presses: i,
                    combinations: combinations
                })
            }

            const solution = machine.tryButtonCombinations(combinations)

            if (solution) {
                console.debug(`Found solution for machine ${machine.displayTarget.map((b) => b.state).join("")} - ${JSON.stringify(solution)}`)
                totalPressesToSolve += i;
                continue machinesLoop;
            }
        }

        throw new Error('Couldn\'t solve machine after 10 button presses')
    }

    return totalPressesToSolve
}

export function defineMultipleMachines(rawInput: string): Machine[] {
    let machines: Machine[] = []
    for (const row of rawInput.split('\n')) {
        machines.push(new Machine(row))
    }
    return machines
}

export interface Button {
    displaySwitches: number[]
}

export class DisplayBit {
    public state: '.' | '#' // off | on

    constructor(state: '.' | '#' = '.') {
        this.state = state
    }

    public toggleState() {
        this.state = (this.state = '.') ? '#' : '.'
    }
}

export class Machine {

    private displayCurrent: DisplayBit[] = [];
    public displayTarget: DisplayBit[] = [];
    private buttons: Button[] = [];

    constructor(machineDefinitionString: string) {
        this.parseInput(machineDefinitionString)
    }

    private parseInput(definition: string) {
        const displayTargetString = definition.match(/\[(.*)\]/)?.[1] ?? null;
        const buttonStrings = [...definition.matchAll(/\(([^)]*)\)/g)].map(m => m[1]);

        buttonStrings.forEach((bs) => {
            this.buttons.push({displaySwitches: bs.split(',').map((v) => Number(v))})
        })

        displayTargetString?.split('').forEach((b) => {
            if (b != '#' && b != '.') {
                throw new Error(`Invalid symbol when parsing target display - ${b}`)
            }
            this.displayTarget.push(new DisplayBit(b))
            this.displayCurrent.push(new DisplayBit())
        })
    }

    public prettyPrintDisplay() {
        console.debug(`Machine with target ${this.displayTarget.map((b) => b.state).join("")} - current display ${this.displayCurrent.map((b) => b.state).join("")} `)
    }

    private resetDisplay() {
        this.displayCurrent.forEach((b) => b.state = '.')
    }

    public pressButtons(buttonIndexes: number[]) {
        console.debug(`Pressing buttons ${JSON.stringify(this.buttons.filter((b, index) => buttonIndexes.includes(index)).map((b) => b.displaySwitches))}`)

        // We only want to toggle a display bit's state a maximum of once, else with rapid toggling we might get the wrong output

        let displayBitToggleTimes: {
            displayBitIndex: number
            timesToToggle: number
        }[] = []

        for (const index of buttonIndexes) {
            for (const displayBitIndex of this.buttons[index].displaySwitches) {
                const dbtt = displayBitToggleTimes.find((dbtt) => dbtt.displayBitIndex === displayBitIndex)
                if (dbtt) {
                    dbtt.timesToToggle++;
                } else {
                    displayBitToggleTimes.push({ displayBitIndex: displayBitIndex, timesToToggle: 1 })
                }
            }
        }

        for (const dbtt of displayBitToggleTimes) {
            if (dbtt.timesToToggle % 2 === 1) {
                this.displayCurrent[dbtt.displayBitIndex].toggleState()
            }
        }
    }

    public numberOfButtons(): number { return this.buttons.length }

    public displayIsAtTarget() {
        return this.displayCurrent.every((db, index) => String(this.displayTarget[index].state) === String(db.state))
    }

    public tryButtonCombinations(buttonCombinations: number[][]): number[] | undefined {
        for (const combination of buttonCombinations) {
            this.resetDisplay()
            this.pressButtons(combination)
            this.prettyPrintDisplay()
            if (this.displayIsAtTarget()) { return combination }
        }
        return undefined; // None of the combinations set the display to the display target 
    }
}

export function findUniqueWaysToPressXButtonsYTimes(numberOfButtons: number, pressTimes: number): number[][] {
    // This depends only on how many buttons we have, and not what the buttons do
    // Pressing a button eg. 3 or 5 times is the same as pressing it once since its a bit
    // Therefore we either press a button or we don't
    const results: number[][] = [];
    function helper(startIndex: number, buttonCombination: number[]) {
        if (buttonCombination.length === pressTimes) {
            results.push([...buttonCombination]);
            return;
        }
        for (let i = startIndex; i < numberOfButtons; i++) {
            buttonCombination.push(i);
            helper(i + 1, buttonCombination);
            buttonCombination.pop();
        }
    }
    helper(0, []);

    console.debug(`Found ${results.length} ways to press ${numberOfButtons} buttons ${pressTimes} times`)
    return results;
}


// Find all the unique ways to press buttons X times
// Note that 

// Note a constraint based on each display- if it needs to be off then buttons that contain that bit can be pressed an even number of times

// Loop through unique button press combos to see if any one of them gives us the desired solution
// Break at the point that we have the desired solution

main()