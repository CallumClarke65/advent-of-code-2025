import { expect, test } from 'vitest'
import { findMaxJoltage, findTotalMaxJoltage } from './part2'

const testBatteryBanks = [
    {
        batteryBank: '987654321111111',
        maxJoltage: 987654321111
    },
    {
        batteryBank: '811111111111119',
        maxJoltage: 811111111119
    },
    {
        batteryBank: '234234234234278',
        maxJoltage: 434234234278
    },
    {
        batteryBank: '818181911112111',
        maxJoltage: 888911112111
    },
]

test.each(testBatteryBanks)(
  "findMaxJoltage($batteryBank) should return $maxJoltage",
  async ({batteryBank, maxJoltage}) => {
    const result = await findMaxJoltage(batteryBank)
    expect(result).toBe(maxJoltage)
  }
)

test("findInvalidIDsInRanges(testBatteryBanks) should return 3121910778619", async () => {
    const result = await findTotalMaxJoltage(testBatteryBanks.map((v) => v.batteryBank))
    expect(result).toEqual(3121910778619)
})