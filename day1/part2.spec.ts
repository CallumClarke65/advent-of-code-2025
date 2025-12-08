import { doRotation, doManyRotations } from './part2'
import { expect, test } from 'vitest'

const testInputCodes = [
    {
        start: 50,
        inputCode: "L68",
        end: 82,
        clicksPastZero: 1
    },
    {
        start: 82,
        inputCode: "L30",
        end: 52,
        clicksPastZero: 0
    },
    {
        start: 52,
        inputCode: "R48",
        end: 0,
        clicksPastZero: 0
    },
    {
        start: 0,
        inputCode: "L5",
        end: 95,
        clicksPastZero: 0
    },
    {
        start: 95,
        inputCode: "R60",
        end: 55,
        clicksPastZero: 1
    },
    {
        start: 55,
        inputCode: "L55",
        end: 0,
        clicksPastZero: 0
    },
    {
        start: 0,
        inputCode: "L1",
        end: 99,
        clicksPastZero: 0
    },
    {
        start: 99,
        inputCode: "L99",
        end: 0,
        clicksPastZero: 0
    },
    {
        start: 0,
        inputCode: "R14",
        end: 14,
        clicksPastZero: 0
    },
    {
        start: 14,
        inputCode: "L82",
        end: 32,
        clicksPastZero: 1
    },
]


test.each(testInputCodes)(
  "doRotation($start, $inputCode) should return { $end, $clicksPastZero }",
  async ({start, inputCode, end, clicksPastZero}) => {
    const result = await doRotation(start, inputCode)
    expect(result.newPosition).toBe(end)
    expect(result.clicksPastZero).toBe(clicksPastZero)
  }
)

test("doManyRotations for testInputCodes should return 6", async () => {
    const result = await doManyRotations(50, testInputCodes.map((i) => i.inputCode))
    expect(result).toBe(6)
})