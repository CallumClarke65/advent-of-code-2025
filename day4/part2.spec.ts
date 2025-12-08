import { expect, test } from 'vitest'
import { convertRawInputToGrid, totalNumberOfAccessibleRolls } from './part2'

const testGrid = 
'..@@.@@@@.\n@@@.@.@.@@\n@@@@@.@.@@\n@.@@@@..@.\n@@.@@@@.@@\n.@@@@@@@.@\n.@.@.@.@@@\n@.@@@.@@@@\n.@@@@@@@@.\n@.@.@@@.@.'

test("totalNumberOfAccessibleRolls(testGrid) should return 43", async () => {
    const grid = await convertRawInputToGrid(testGrid)
    const result = await totalNumberOfAccessibleRolls(grid)
    expect(result).toEqual(43)
})