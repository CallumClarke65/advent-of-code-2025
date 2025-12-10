import { expect, test } from 'vitest'
import { JunctionBox, Playground } from './shared'

const testPlaygroundRaw =
    '162,817,812\n57,618,57\n906,360,560\n592,479,940\n352,342,300\n466,668,158\n542,29,236\n431,825,988\n739,650,466\n52,470,668\n216,146,977\n819,987,18\n117,168,530\n805,96,715\n346,949,466\n970,615,88\n941,993,340\n862,61,35\n984,92,344\n425,690,689'

const testPlayground = new Playground(undefined,
    [
        new JunctionBox(0, 162, 817, 812),
        new JunctionBox(1, 57, 618, 57),
        new JunctionBox(2, 906, 360, 560),
        new JunctionBox(3, 592, 479, 940),
        new JunctionBox(4, 352, 342, 300),
        new JunctionBox(5, 466, 668, 158),
        new JunctionBox(6, 542, 29, 236),
        new JunctionBox(7, 431, 825, 988),
        new JunctionBox(8, 739, 650, 466),
        new JunctionBox(9, 52, 470, 668),
        new JunctionBox(10, 216, 146, 977),
        new JunctionBox(11, 819, 987, 18),
        new JunctionBox(12, 117, 168, 530),
        new JunctionBox(13, 805, 96, 715),
        new JunctionBox(14, 346, 949, 466),
        new JunctionBox(15, 970, 615, 88),
        new JunctionBox(16, 941, 993, 340),
        new JunctionBox(17, 862, 61, 35),
        new JunctionBox(18, 984, 92, 344),
        new JunctionBox(19, 425, 690, 689)
    ]
)

const testJunctionBoxDistances: { jba: JunctionBox; jbb: JunctionBox; distance: number }[] = [
    {
        jba: new JunctionBox(0, 162, 817, 812),
        jbb: new JunctionBox(1, 57, 618, 57),
        distance: 787.814064357828
    }
]

test("test playground should parse correctly", async () => {
    const playground = new Playground(testPlaygroundRaw)
    expect(playground).toEqual(testPlayground)
})


test.each(testJunctionBoxDistances)("($jba).distanceToJunctionBox($jbb) should return $distance", async ({ jba, jbb, distance }) => {
    const result = jba.distanceToJunctionBox(jbb)
    expect(result).toBe(distance)
})

test("test playground should produce a circuitProduct of 40", async () => {
    const playground = new Playground(testPlaygroundRaw)
    playground.connectMultiplePairs(10)
    expect(playground.findProductOfThreeLargestCircuits()).toBe(40)
})