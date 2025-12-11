import { expect, test } from 'vitest'
import { getAllPossibleTileRectangesAreas, parseFloorDescriptionInput } from './part2'

const testFloorDescription =
    '7,1\n11,1\n11,7\n9,7\n9,5\n2,5\n2,3\n7,3'

test("testFloorDescription should give a max rectangle area of 24", async () => {
    const tiles = parseFloorDescriptionInput(testFloorDescription)
    const result = Math.max(...getAllPossibleTileRectangesAreas(tiles))
    expect(result).toEqual(24)
})
