import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Puzzle, solvePuzzle } from "./shared";

async function main() {
    const rawInput = await getInputRaw(6)
    const puzzles = await parsePuzzles(rawInput)

    let total = 0;
    for (const p of puzzles) {
        total += await solvePuzzle(p);
    }
    console.log(`The grand total of all the puzzle solutions is ${total}`);
}

export async function parsePuzzles(rawInput: string): Promise<Puzzle[]> {
    const rows = rawInput.split('\n')

    // Parse the operationsRow separately to numbers
    let operations: Array<'+' | '*'> = [];
    const operationsRow = rows.find((v) => v.includes('+'))
    if (!operationsRow) {
        throw new Error(`Failed to find the operations row`)
    }
    operations = operationsRow.split('').filter((v) => v != ' ').map((v) => {
        if (v !== '+' && v !== '*') {
            throw new Error(`Invalid operation: ${v}`);
        }
        return v;
    });

    // Create a matrix of every individual digit and transpose it into a matrix in the "Cephalopod maths" orientation
    const numberRows = rows.filter((v) => !v.includes('+'))
    const digits: string[][] = numberRows.map((r) => r.split(''))
    const transposedMatrix = digits[0].map((_, colIndex) => digits.map((r) => r[colIndex]));


    // Group transposed number sets into the puzzles they belong to 
    const numberSets: string[][][] = [];
    let currentSet: string[][] = [];
    for (const numberColumnArray of transposedMatrix) {
        // If there are no numbers in the current column, we've reach a delimiter between puzzles
        if(await arraysEqual(numberColumnArray, Array(numberColumnArray.length).fill(' '))) {
            numberSets.push(currentSet)
            currentSet = []
        } else {
            currentSet.push(numberColumnArray)
        }
    }
    // Add the current chunk (which doesn't have a final delimiter following!)
    numberSets.push(currentSet);

    // Transform number sets into "human math" numbers
    let puzzleNumbers: number[][] = [];
    for(let i = 0; i < numberSets.length; i++) {
        const sanitizedPuzzleNumberSets = numberSets[i].map((s) => s.filter((v) => v != ' '))
        let currentPuzzleNumbers: number[] = [];
        for(let j = 0; j < sanitizedPuzzleNumberSets.length; j++) {
            const val = Number(sanitizedPuzzleNumberSets[j].reduce((s, v) => s + Number(v)))
            currentPuzzleNumbers.push(val)
        }
        puzzleNumbers.push(currentPuzzleNumbers.reverse())
    }

    // Construct the puzzle objects
    let puzzles: Puzzle[] = [];
    for (let i = 0; i < operations.length; i++) {
        puzzles.push({
            numbers: puzzleNumbers[i],
            operation: operations[i]
        })
    }

    return puzzles
    
}

export async function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

main()