import { expect, test } from 'vitest'
import { defineMultipleMachines, trySolveMachines } from './part1'

const testMachineDefinitions =
    '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}\n[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}\n[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}'


test("testMachineDefinitions should require 7 total button presses", async () => {
    const machines = defineMultipleMachines(testMachineDefinitions)
    const result = trySolveMachines(machines)
    expect(result).toBe(7)
})
