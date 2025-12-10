import { expect, test } from 'vitest'
import { Manifold } from './part2'

const testManifoldDiagram =
    '.......S.......\n...............\n.......^.......\n...............\n......^.^......\n...............\n.....^.^.^.....\n...............\n....^.^...^....\n...............\n...^.^...^.^...\n...............\n..^...^.....^..\n...............\n.^.^.^.^.^...^.\n...............'

test("test manifold should have 40 timelines", async () => {
    const manifold = new Manifold(testManifoldDiagram)
    manifold.fireTheBeam()
    expect(manifold.timelines).toBe(40)
})