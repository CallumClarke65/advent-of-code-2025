import { expect, test } from 'vitest'
import { parsePuzzles, Puzzle, solvePuzzle } from './part1'

const testPuzzlesRaw =
    '123 328  51 64 \n 45 64  387 23 \n  6 98  215 314\n*   +   *   +  '

const testPuzzles: { puzzle: Puzzle; answer: number }[] = [
    {
        puzzle: {
            numbers: [123, 45, 6],
            operation: '*',
        },
        answer: 33210
    },
    {
        puzzle: {
            numbers: [328, 64, 98],
            operation: '+'
        },
        answer: 490
    },
    {
        puzzle: {
            numbers: [51, 387, 215],
            operation: '*'
        },
        answer: 4243455
    },
    {
        puzzle: {
            numbers: [64, 23, 314],
            operation: '+'
        },
        answer: 401
    },
]

test("parsePuzzles(testPuzzlesRaw) should parse correctly", async () => {
    const result = await parsePuzzles(testPuzzlesRaw)
    expect(result).toEqual(testPuzzles.map((p) => p.puzzle))
})

test.each(testPuzzles)("solvePuzzle($puzzle) should return $answer", async ({ puzzle, answer }) => {
    const result = await solvePuzzle(puzzle)
    expect(result).toBe(answer)
})