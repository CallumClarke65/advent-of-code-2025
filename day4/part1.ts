import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const rawInput = await getInputRaw(4)
    const grid = await convertRawInputToGrid(rawInput)
    const accessibleCount = await numberOfAccessibleRolls(grid)

    console.log(`There are ${accessibleCount} accessible paper rolls`)
}


export async function numberOfAccessibleRolls(grid: number[][]): Promise<number> {
    // Find how many rolls are in each of the 8 adjacent spots in our matrix

    if (grid.some((r) => r.length != grid.length)) {
        throw new Error(`Invalid grid format - not all rows have the same lengths as the columns!`)
    }

    let adjacencyCounts: number[][] = Array.from(
        { length: grid.length },
        () => Array(grid.length).fill(0)
    );

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // If there's no roll here, we don't care about adjacency
            if(grid[i][j] != 1) {
                adjacencyCounts[i][j] = -1;
                continue;
            }

            // Top Centre, Left Centre, Bottom Centre, Right Centre
            const TC = i != 0;
            const LC = j != 0;
            const BC = i != grid.length - 1;
            const RC = j != grid[i].length - 1;

            // Top Left, Top Right, Bottom Left, Bottom Right
            const TL = TC && LC
            const TR = TC && RC
            const BL = BC && LC
            const BR = BC && RC

            adjacencyCounts[i][j] += TC ? grid[i - 1][j] : 0
            adjacencyCounts[i][j] += TL ? grid[i - 1][j - 1] : 0
            adjacencyCounts[i][j] += LC ? grid[i][j - 1] : 0
            adjacencyCounts[i][j] += BL ? grid[i + 1][j - 1] : 0
            adjacencyCounts[i][j] += BC ? grid[i + 1][j] : 0
            adjacencyCounts[i][j] += BR ? grid[i + 1][j + 1] : 0
            adjacencyCounts[i][j] += RC ? grid[i][j + 1] : 0
            adjacencyCounts[i][j] += TR ? grid[i - 1][j + 1] : 0
        }
    }

    return adjacencyCounts.flat().filter(i => i < 4 && i != -1).length;
}


export async function convertRawInputToGrid(input: string): Promise<number[][]> {
    // Each row is separated by a newline
    // Each character within a row then represents whether there is a roll there or not
    // We'll represent a roll being in a position with a 1 and no roll with a 0
    return input.split('\n').map((r) => r.split('')).map((r) => r.map((v) => v == "@" ? 1 : 0))
}

main()