import { expect, test } from 'vitest'
import { Manifold } from './part1'

const testManifoldDiagram =
    '.......S.......\n...............\n.......^.......\n...............\n......^.^......\n...............\n.....^.^.^.....\n...............\n....^.^...^....\n...............\n...^.^...^.^...\n...............\n..^...^.....^..\n...............\n.^.^.^.^.^...^.\n...............'

test("test manifold should split 21 times", async () => {
    const manifold = new Manifold(testManifoldDiagram)
    manifold.fireTheBeam()
    expect(manifold.splitsPerformed).toBe(21)
})