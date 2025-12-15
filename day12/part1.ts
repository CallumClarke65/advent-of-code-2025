import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

//console.debug = () => { };

async function main() {
    const rawInput = await getInputRaw(12)
    const problems = parseProblems(rawInput)

    // Define a function quickCheckSpace() that knows nothing of the present orientations, and just of the total space taken up by each present (when accounting for holes)
    // A quick check shows that when only 80% of the space under the tree is available, the number of problems with a solution is the same as when 100% of space is available

    const quick100 = problems.filter((p) => p.quickCheckSpace(1) === true).length
    const quick80 = problems.filter((p) => p.quickCheckSpace(0.8) === true).length

    console.log(`There are ${quick100} problems that might have a solution if 100% of the rectangular space is available`)
    console.log(`There are ${quick80} problems that might have a solution if 80% of the rectangular space is available`)

    // Even if we do something totally non-optimal, with a good 25% of headroom, we should be confident we can fit all these presents in!
}

function parseProblems(rawInput: string): Problem[] {
    // Ignore the present shapes for now

    const rows = rawInput.split('\n')
    const problemRows = rows.filter((r) => r.includes('x'))

    let problems: Problem[] = []
    for (const row of problemRows) {
        const area = row.split(': ')[0].split('x').map((v) => Number(v))
        const shapeCounts = row.split(': ')[1].split(' ').map((v) => Number(v))
        problems.push(new Problem({ x: area[0], y: area[1]}, shapeCounts))
    }
    return problems
}

export class Problem {
    constructor(readonly area: { x: number, y: number }, readonly presentCounts: number[]) {}

    totalSpace(): number {
        return this.area.x * this.area.y
    }

    presentSpace(): number {
        return (
            7 * this.presentCounts[0]
            + 5 * this.presentCounts[1]
            + 7 * this.presentCounts[2]
            + 7 * this.presentCounts[3]
            + 6 * this.presentCounts[4]
            + 7 * this.presentCounts[5]
        )
    }

    quickCheckSpace(percentageSpaceNeeded: number): boolean {
        const totalSpace = this.totalSpace()
        const presentSpace = this.presentSpace()
        const enoughSpace = totalSpace * percentageSpaceNeeded >= presentSpace
        return enoughSpace
    }
}


main()