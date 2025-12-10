import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";


async function main() {
    const sw = new Stopwatch()
    sw.start()
    const rawInput = await getInputRaw(9)
    const tiles = parseFloorDescriptionInput(rawInput)
    const allRectangleAreas = getAllPossibleTileRectangesAreas(tiles)


    console.log(`The area of the largest possible rectangle is ${Math.max(...allRectangleAreas)}`)
    console.log(`Elapsed time - ${sw.stop()}`)
    // Elapsed time - 00:00.380
}

export interface Tile {
    x: number,
    y: number
}

export function parseFloorDescriptionInput(input: string): Tile[] {
    const rows = input.split('\n')

    let tiles: Tile[] = []
    for (const row of rows) {
        const tileRaw = row.split(',')
        tiles.push({ x: Number(tileRaw[0]), y: Number(tileRaw[1])})
    }
    return tiles
}

export function rectangleArea(a: Tile, b: Tile): number {
    return Math.abs((a.x - b.x + 1) * (a.y - b.y + 1))
}

export function getAllPossibleTileRectangesAreas(tiles: Tile[]): number[] {
    let rectangleAreas: number[] = []

    tiles.forEach((tile, index) => {
        for (let i = index + 1; i < tiles.length; i++) {
            rectangleAreas.push(rectangleArea(tile, tiles[i]))
        }
    })
    return rectangleAreas
}

main()