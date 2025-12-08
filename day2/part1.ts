import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const inputIDs = (await getInputRaw(2)).split(',')
    const invalidIDs = await findInvalidIDsInRanges(inputIDs)
    const invalidIDsum = await sumInvalidIDValues(invalidIDs)

    console.log(`The sum of the invalid IDs is ${invalidIDsum}`)
}

export async function findInvalidIDsInRanges(ranges: string[]): Promise<number[]> {
    let allInvalidIDs: number[] = []

    for(const range of ranges) {
        await findInvalidIDsInRange(range).then((invalidIds) => {
            invalidIds.forEach((id) => allInvalidIDs.push(id))
        })
    }

    return allInvalidIDs
}

export async function findInvalidIDsInRange(range: string): Promise<number[]> {

    const startOfRange = Number(range.split('-')[0])
    const endOfRange = Number(range.split('-')[1])

    let invalidIDs = []

    for (let i = startOfRange; i <= endOfRange; i++) {
        // We can take advantage of the fact that a duplicate follows the pattern {X}{X} without any other digits hidden
        // Therefore if the first half of the number matches the second half (via string comparison), jobs a good'un

        const iString = i.toString()

        if (iString.length % 2 != 0) {
            continue;
        }

        if (iString.substring(0, iString.length / 2) === iString.substring(iString.length / 2)) {
            invalidIDs.push(i)
        }
    }
    return invalidIDs
}

export async function sumInvalidIDValues(IDs: number[]): Promise<number> {
    return IDs.reduce((sum, current) => sum + current)
}

main()