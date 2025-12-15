import { expect, test } from 'vitest'
import { findPathsFromAtoB, parseServerRack } from './part1'

const testServerRackInput =
    'aaa: you hhh\nyou: bbb ccc\nbbb: ddd eee\nccc: ddd eee fff\nddd: ggg\neee: out\nfff: out\nggg: out\nhhh: ccc fff iii\niii: out'

test("testServerRack should have 5 paths from you to out", async () => {
    const serverRack = parseServerRack(testServerRackInput)
    const result = findPathsFromAtoB(serverRack, 'you', 'out')
    expect(result.length).toBe(5)
})
