export type Puzzle = {
    numbers: number[],
    operation: '+' | '*'
}

export async function solvePuzzle(puzzle: Puzzle): Promise<number> {
    switch (puzzle.operation) {
        case '*':
            return puzzle.numbers.reduce((s, v) => s * v)
        case '+':
            return puzzle.numbers.reduce((s, v) => s + v)
    }
}