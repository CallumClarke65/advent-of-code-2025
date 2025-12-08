import { expect, test } from 'vitest'
import { convertRawInputToGrid, numberOfAccessibleRolls } from './part1'

const testGrid = 
'..@@.@@@@.\n@@@.@.@.@@\n@@@@@.@.@@\n@.@@@@..@.\n@@.@@@@.@@\n.@@@@@@@.@\n.@.@.@.@@@\n@.@@@.@@@@\n.@@@@@@@@.\n@.@.@@@.@.'

test("numberOfAccessibleRolls(testGrid) should return 13", async () => {
    const grid = await convertRawInputToGrid(testGrid)
    const result = await numberOfAccessibleRolls(grid)
    expect(result).toEqual(13)
})