import { expect, test } from 'vitest'
import { Playground } from './shared'

const testPlaygroundRaw =
    '162,817,812\n57,618,57\n906,360,560\n592,479,940\n352,342,300\n466,668,158\n542,29,236\n431,825,988\n739,650,466\n52,470,668\n216,146,977\n819,987,18\n117,168,530\n805,96,715\n346,949,466\n970,615,88\n941,993,340\n862,61,35\n984,92,344\n425,690,689'

test("test playground should connect (216,146,977) and (117,168,530) last", async () => {
    const playground = new Playground(testPlaygroundRaw)
    const lastConnection = playground.connectAllJunctionBoxes()
    expect(lastConnection.jba.x).toBe(216)
    expect(lastConnection.jba.y).toBe(146)
    expect(lastConnection.jba.z).toBe(977)
    expect(lastConnection.jbb.x).toBe(117)
    expect(lastConnection.jbb.y).toBe(168)
    expect(lastConnection.jbb.z).toBe(530)
})