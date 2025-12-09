import { expect, test } from 'vitest'
import { parsePuzzles } from './part2'
import { Puzzle } from './shared';

const testPuzzlesRaw =
    '123 328  51 64 \n 45 64  387 23 \n  6 98  215 314\n*   +   *   +  '

const testPuzzles: { puzzle: Puzzle; answer: number }[] = [
    {
        puzzle: {
            numbers: [356, 24, 1],
            operation: '*',
        },
        answer: 8544
    },
    {
        puzzle: {
            numbers: [8, 248, 369],
            operation: '+'
        },
        answer: 625
    },
    {
        puzzle: {
            numbers: [175, 581, 32],
            operation: '*'
        },
        answer: 3253600
    },
    {
        puzzle: {
            numbers: [4, 431, 623],
            operation: '+'
        },
        answer: 1058
    },
]

test("parsePuzzles(testPuzzlesRaw) should parse correctly", async () => {
    const result = await parsePuzzles(testPuzzlesRaw)
    expect(result).toEqual(testPuzzles.map((p) => p.puzzle))
})
