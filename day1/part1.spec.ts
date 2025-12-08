import { doRotation, doManyRotations } from './part1'
import { expect, test } from 'vitest'

const testInputCodes = [
    {
        start: 50,
        inputCode: "L68",
        end: 82
    },
    {
        start: 82,
        inputCode: "L30",
        end: 52
    },
    {
        start: 52,
        inputCode: "R48",
        end: 0
    },
    {
        start: 0,
        inputCode: "L5",
        end: 95
    },
    {
        start: 95,
        inputCode: "R60",
        end: 55
    },
    {
        start: 55,
        inputCode: "L55",
        end: 0
    },
    {
        start: 0,
        inputCode: "L1",
        end: 99
    },
    {
        start: 99,
        inputCode: "L99",
        end: 0
    },
    {
        start: 0,
        inputCode: "R14",
        end: 14
    },
    {
        start: 14,
        inputCode: "L82",
        end: 32
    },
]

test.each(testInputCodes)(
  "doRotation(%i, %s) should return %i",
  async (i) => {
    const result = await doRotation(i.start, i.inputCode)
    expect(result).toBe(i.end)
  }
)

test("doManyRotations for testInputCodes should return 3", async () => {
    const result = await doManyRotations(50, testInputCodes.map((i) => i.inputCode))
    expect(result).toBe(3)
})