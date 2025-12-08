import { expect, test } from 'vitest'
import { findMaxJoltage, findTotalMaxJoltage } from './part1'

const testBatteryBanks = [
    {
        batteryBank: '987654321111111',
        maxJoltage: 98
    },
    {
        batteryBank: '811111111111119',
        maxJoltage: 89
    },
    {
        batteryBank: '234234234234278',
        maxJoltage: 78
    },
    {
        batteryBank: '818181911112111',
        maxJoltage: 92
    },
]

test.each(testBatteryBanks)(
  "findMaxJoltage($batteryBank) should return $maxJoltage",
  async ({batteryBank, maxJoltage}) => {
    const result = await findMaxJoltage(batteryBank)
    expect(result).toBe(maxJoltage)
  }
)

test("findInvalidIDsInRanges(testBatteryBanks) should return 357", async () => {
    const result = await findTotalMaxJoltage(testBatteryBanks.map((v) => v.batteryBank))
    expect(result).toEqual(357)
})