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
    let puzzleNumbers: number[][] = [];
    let operationsRow: Array<'+' | '*'> = [];

    const rows = rawInput.split('\n')
    for (const row of rows) {
        const sanitizedRow = row.split(' ').filter((v) => v != '')

        if (sanitizedRow.some((v) => v === '+')) {
            // We're parsing the operations row
            operationsRow = sanitizedRow.map((v) => {
                if (v !== '+' && v !== '*') {
                    throw new Error(`Invalid operation: ${v}`);
                }
                return v;
            });
        } else {
            // We're parsing a puzzle numbers row
            puzzleNumbers.push(sanitizedRow.map((v) => Number(v)));
        }
    }

    // Check that we've parsed rows of equal length after sanitization
    if (puzzleNumbers.some((r) => r.length != operationsRow.length)) {
        throw new Error('Parsed rows incorrectly')
    }

    // Construct the puzzle objects
    let puzzles: Puzzle[] = [];
    for (let i = 0; i < operationsRow.length; i++) {
        let thisPuzzlesNumbers: number[] = []

        for (let j = 0; j < puzzleNumbers.length; j++) {
            thisPuzzlesNumbers.push(puzzleNumbers[j][i])
        }

        puzzles.push({
            numbers: thisPuzzlesNumbers,
            operation: operationsRow[i]
        })
    }

    return puzzles
}

main()