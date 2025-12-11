import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";

console.debug = () => { };

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

export interface GreenTilesPositioning {
    topLeft: boolean;
    topRight: boolean;
    bottomLeft: boolean;
    bottomRight: boolean;
}

export class Tile {
    public greenTiles: GreenTilesPositioning = {
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
    }

    constructor(
        readonly x: number,
        readonly y: number
    ) { }

    public distanceToOrigin(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    public findDirectionToTile(tile: Tile): 'Left' | 'Down' | 'Right' | 'Up' {
        // When we perform a walk between this tile and the input tile, in what direction do we walk?
        if (this.x > tile.x && this.y === tile.y) {
            return 'Left'
        }
        if (this.x < tile.x && this.y === tile.y) {
            return 'Right'
        }
        if (this.x === tile.x && this.y > tile.y) {
            return 'Up'
        }
        if (this.x === tile.x && this.y < tile.y) {
            return 'Down'
        }
        throw new Error(`Couldn't determine direction from ${JSON.stringify(this)} to ${JSON.stringify(tile)}`)
    }

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

    // We can rely on the redTiles being given as a walkabout route, ie. in "order"
    // By looking at the tiles immediately before and after us, we can figure out where green tiles appear around us
    // We can track this by imagining a quadrant around each red tile and calculating whether green tiles appear within each quadrant
    // By seeding this walk with the green tiles around the point we choose to start our route, we know which side of the line is the "interior"

    // Find the red tile closest to (0,0)- ie. the top left of our grid- via euclidean distance (D)
    // This tile MUST have green tiles *only* in the bottomRight
    // Proof-
    // If topRight, there exists a red tile with a lower y value and therefore a lower D
    // If bottomLeft, there exists a red tile with a lower x value and therefore a lower D
    // If topLeft, combine the above two
    const closestTileToOrigin = tiles.reduce((a, b) =>
        b.distanceToOrigin() < a.distanceToOrigin() ? b : a
    );
    let closestTileIndex = tiles.findIndex(t => {
        return t.x === closestTileToOrigin.x && t.y === closestTileToOrigin.y;
    });
    tiles[closestTileIndex].greenTiles.bottomRight = true;

    // Re-order our tiles array so that we start our walk from here
    tiles = tiles.slice(closestTileIndex).concat(tiles.slice(0, closestTileIndex));

    // Now walk through the tiles
    for (let i = 1; i < tiles.length; i++) {
        const currentTile = tiles[i]
        const previousTile = tiles[i - 1]
        const previousDirection = previousTile.findDirectionToTile(currentTile)
        const nextTile = (i != tiles.length - 1) ? tiles[i + 1] : tiles[0] // Walk wraps round to the start
        const nextDirection = currentTile.findDirectionToTile(nextTile)

        console.debug(`From (${previousTile.x},${previousTile.y}) to (${currentTile.x},${currentTile.y}) - ${previousDirection}`)
        console.debug(`From (${currentTile.x},${currentTile.y}) to (${nextTile.x},${nextTile.y}) - ${nextDirection}`)

        if (previousDirection === 'Down' && nextDirection === 'Left') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.bottomLeft;
        }

        if (previousDirection === 'Down' && nextDirection === 'Right') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.bottomLeft;
        }

        if (previousDirection === 'Down' && nextDirection === 'Down') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.bottomLeft;
        }

        if (previousDirection === 'Up' && nextDirection === 'Left') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topRight;
        }

        if (previousDirection === 'Up' && nextDirection === 'Right') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topLeft;
        }

        if (previousDirection === 'Up' && nextDirection === 'Up') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topLeft;
        }

        if (previousDirection === 'Left' && nextDirection === 'Down') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topLeft;
        }

        if (previousDirection === 'Left' && nextDirection === 'Up') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.bottomLeft;
        }

        if (previousDirection === 'Left' && nextDirection === 'Left') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topLeft;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomLeft;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topLeft;
        }

        if (previousDirection === 'Right' && nextDirection === 'Down') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topRight;
        }

        if (previousDirection === 'Right' && nextDirection === 'Up') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topRight;
        }

        if (previousDirection === 'Right' && nextDirection === 'Right') {
            currentTile.greenTiles.topRight = previousTile.greenTiles.topRight;
            currentTile.greenTiles.bottomRight = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.bottomLeft = previousTile.greenTiles.bottomRight;
            currentTile.greenTiles.topLeft = previousTile.greenTiles.topRight;
        }
    }

    return tiles
}

export function rectangleArea(a: Tile, b: Tile): number {
    return Math.abs((Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1))
}

export function getAllPossibleTileRectangesAreas(tiles: Tile[]): number[] {
    let rectangleAreas: number[] = []

    tiles.forEach((tileA, index) => {
        if (tileA.x === 94880) { console.log(tileA) }
        for (let i = index + 1; i < tiles.length; i++) {
            const tileB = tiles[i]

            if (!isRectangleValid(tileA, tileB, tiles)) {
                continue;
            }

            rectangleArea(tileA, tileB) === 2248344 ? console.log(`${tileA.coords()} - ${tileB.coords()} - ${rectangleArea(tileA, tileB)}`) : null
            rectangleAreas.push(rectangleArea(tileA, tileB))
        }
    })
    return rectangleAreas
}

export function isRectangleValid(tileA: Tile, tileB: Tile, tiles: Tile[]): boolean {
    // If there are any red tiles inside our rectangle (not on the edge) then it's invalid since green tiles must be missing in at least one quadrant of that tile
    if (tiles.some((t) => {
        return (tileA.x - t.x) * (tileB.x - t.x) < 0 && (tileA.y - t.y) * (tileB.y - t.y) < 0
    })) {
        return false;
    }

    // Otherwise, we either have a TL/BR pair or a TR/BL pair
    let tileTL: Tile | undefined
    let tileTR: Tile | undefined
    let tileBL: Tile | undefined
    let tileBR: Tile | undefined
    if (tileA.x > tileB.x && tileA.y > tileB.y) {
        tileTL = tileB
        tileBR = tileA
    }
    if (tileA.x > tileB.x && tileA.y < tileB.y) {
        tileTR = tileA
        tileBL = tileB
    }
    if (tileA.x < tileB.x && tileA.y > tileB.y) {
        tileTR = tileB
        tileBL = tileA
    }
    if (tileA.x < tileB.x && tileA.y < tileB.y) {
        tileTL = tileA
        tileBR = tileB
    }

    // For our given pair, identify whether green tiles exi
    // st in the quadrant directions created by this rectangle
    if (tileTL && !(tileTL?.greenTiles.bottomRight && tileBR?.greenTiles.topLeft)) {
        return false;
    }
    if (tileTR && !(tileTR?.greenTiles.bottomLeft && tileBL?.greenTiles.topRight)) {
        return false;
    }

    // We also need to check for any edges which our rectangle might intersect with (think of a 'c' shape for example)
    if (tileTL && tileBR) {
        if (tiles.some((t) => t.y < tileTL.y && tileBR.x > t.x && t.x > tileTL.x && !t.greenTiles.bottomRight)) { return false; }
        if (tiles.some((t) => t.y > tileBR.y && tileBR.x > t.x && t.x > tileTL.x && !t.greenTiles.topLeft)) { return false; }
        if (tiles.some((t) => t.x < tileTL.x && tileBR.y > t.y && t.y > tileTL.y && !t.greenTiles.bottomRight)) { return false; }
        if (tiles.some((t) => t.x > tileBR.x && tileBR.y > t.y && t.y > tileTL.y && !t.greenTiles.topLeft)) { return false; }
    }
    if (tileBL && tileTR) {
        if (tiles.some((t) => t.y < tileTR.y && tileBL.x < t.x && t.x < tileTR.x && !t.greenTiles.bottomLeft)) { return false; }
        if (tiles.some((t) => t.y > tileBL.y && tileBL.x < t.x && t.x < tileTR.x && !t.greenTiles.topRight)) { return false; }
        if (tiles.some((t) => t.x > tileTR.x && tileBL.y > t.y && t.y > tileTR.y && !t.greenTiles.bottomLeft)) { return false; }
        if (tiles.some((t) => t.x < tileBL.x && tileBL.y > t.y && t.y > tileTR.y && !t.greenTiles.topRight)) { return false; }
    }
    return true;
}

// Walk through the tile list and decide if each tile can start a rectangle in a given direction
// (Essentially figuring out which quadrants around us are green or not)
// Then the rectangles we create from A/B must be allowed to be created in that direction

main()