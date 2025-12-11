import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";

console.debug = () => { };

async function main() {
    const sw = new Stopwatch()
    sw.start()
    const rawInput = await getInputRaw(9)
    const tiles = parseFloorDescriptionInput(rawInput)
    const allRectangleAreas = getAllPossibleTileRectangleAreas(tiles)


    console.log(`The area of the largest possible rectangle is ${Math.max(...allRectangleAreas)}`)
    console.log(`Elapsed time - ${sw.stop()}`)
    // Elapsed time - 00:00.380
}

export class Tile {
    constructor(
        readonly x: number,
        readonly y: number
    ) { }

    public coords(): string {
        return `(${this.x},${this.y})`
    }
}

export function parseFloorDescriptionInput(input: string): Tile[] {
    const rows = input.split('\n')

    let tiles: Tile[] = []
    for (const row of rows) {
        const tileRaw = row.split(',')
        tiles.push(new Tile(Number(tileRaw[0]), Number(tileRaw[1])))
    }
    return tiles
}

export function rectangleArea(a: Tile, b: Tile): number {
    return Math.abs((Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1))
}

export function getAllPossibleTileRectangleAreas(tiles: Tile[]): number[] {
    // Look at floor.png. There's a massive shortcut we can do here
    // Since the floor is *basically* a circle with a big cutout, we know for sure that one of the corner points of the cutout is guaranteed to be part of the rectangle
    // Looking at the raw input, we can find those tiles are
    // 94880,50218
    // 94880,48563
    const possibleCornerA = tiles.find((t) => t.x === 94880 && t.y === 50218)
    const possibleCornerB = tiles.find((t) => t.x === 94880 && t.y === 48563)

    if (!possibleCornerA || !possibleCornerB) {
        throw new Error('Need to git gud at looking at circles')
    }

    let rectangleAreas: number[] = []
    for (const tile of tiles) {
        if (tile.x > possibleCornerA.x) {
            continue; // Any tile to the right of the cutout isn't going to help us
        }

        // The "A" rectangle (formed from possibleCornerA) is in the "bottom half" of the circle
        if (tile.y > possibleCornerA.y) {
            if (!tilesInsideRectangle(tile, possibleCornerA, tiles)) {
                rectangleAreas.push(rectangleArea(tile, possibleCornerA))
            }
        }

        // The "B" rectangle (formed from possibleCornerB) is in the "top half" of the circle
        if (tile.y < possibleCornerB.y) {
            if (!tilesInsideRectangle(tile, possibleCornerB, tiles)) {
                rectangleAreas.push(rectangleArea(tile, possibleCornerB))
            }
        }
    }
    return rectangleAreas
}

export function tilesInsideRectangle(tileA: Tile, tileB: Tile, tiles: Tile[]): boolean {
    const minX = Math.min(tileA.x, tileB.x);
    const maxX = Math.max(tileA.x, tileB.x);
    const minY = Math.min(tileA.y, tileB.y);
    const maxY = Math.max(tileA.y, tileB.y);

    return tiles.some(t => t.x > minX && t.x < maxX && t.y > minY && t.y < maxY)
}

main()