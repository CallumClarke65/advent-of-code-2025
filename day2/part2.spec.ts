import { expect, test } from "vitest"
import { findFactors, findInvalidIDsInRange, findInvalidIDsInRanges, sumInvalidIDValues } from "./part2"

const testIDRanges = [
    {
        range: "11-22",
        invalidIDs: [
            11,
            22
        ],
    },
    {
        range: "95-115",
        invalidIDs: [
            99, 111
        ],
    },
    {
        range: "998-1012",
        invalidIDs: [
            999, 1010,
        ],
    },
    {
        range: "1188511880-1188511890",
        invalidIDs: [
            1188511885,
        ],
    },
    {
        range: "222220-222224",
        invalidIDs: [
            222222,
        ],
    },
    {
        range: "1698522-1698528",
        invalidIDs: [
        ],
    },
    {
        range: "446443-446449",
        invalidIDs: [
            446446,
        ],
    },
    {
        range: "38593856-38593862",
        invalidIDs: [
            38593859,
        ],
    },
    {
        range: "565653-565659",
        invalidIDs: [
            565656
        ],
    },
    {
        range: "824824821-824824827",
        invalidIDs: [
            824824824
        ],
    },
    {
        range: "2121212118-2121212124",
        invalidIDs: [
            2121212121
        ],
    },
]

test.each(testIDRanges)(
  "findInvalidIDsInRange($range) should return $invalidIDs",
  async ({range, invalidIDs}) => {
    const result = await findInvalidIDsInRange(range)
    expect(result).toEqual(invalidIDs)
  }
)

test("findInvalidIDsInRanges(testIDRanges) should return a flat array of all invalidIds", async () => {
    const result = await findInvalidIDsInRanges(testIDRanges.map((v) => v.range))
    expect(result).toEqual(testIDRanges.flatMap((v) => v.invalidIDs))
})

test("sumInvalidIDValues(testIDRanges) should return 4174379265", async () => {
    const invalidIDs = await findInvalidIDsInRanges(testIDRanges.map((v) => v.range)) 
    const result = await sumInvalidIDValues(invalidIDs)
    expect(result).toBe(4174379265)
})

test.each([
    [ 5, [ 1, 5 ] ],
    [ 6, [ 1, 2, 3, 6 ] ],
])("findFactors(%i) should return %j",
    async(number, factors) => {
        const result = await findFactors(number)
        expect(result).toEqual(factors)
    }
)
