import { expect, test } from 'vitest'
import { findPathsFromAtoBincludingC, parseServerRack } from './part2'

const testServerRackInput =
    'svr: aaa bbb\naaa: fft\nfft: ccc\nbbb: tty\ntty: ccc\nccc: ddd eee\nddd: hub\nhub: fff\neee: dac\ndac: fff\nfff: ggg hhh\nggg: out\nhhh: out'

test("testServerRack should have 2 paths from svr to out including dac and fft", async () => {
    const serverRack = parseServerRack(testServerRackInput)
    const result = findPathsFromAtoBincludingC(serverRack, 'svr', 'out', ['dac', 'fft'])
    expect(result.length).toBe(2)
})
