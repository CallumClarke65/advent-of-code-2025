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

    let invalidIDs: number[] = []

    for (let i = startOfRange; i <= endOfRange; i++) {
        // Now we need to split into more than just two parts. We can take advantage of there never being any digits outside of our
        // duplicate expression still. Just now we need to search each string for multiple possible sequences

        const iString = i.toString()

        const allFactorsOfStringLength = await findFactors(iString.length)
        const possibleExpressionLengths = allFactorsOfStringLength.filter(f => f !== iString.length)

        for(const expressionLength of possibleExpressionLengths) {
            let expressionParts: string[] = [];
            for(let j = 0; j < iString.length; j+= expressionLength) {
                expressionParts.push(iString.substring(j, j + expressionLength))
            }
            // If every part of the cut up string is deeply equal, then we must have found an invalid ID
            expressionParts?.every((e) => e == expressionParts[0]) && !invalidIDs.includes(i) ? invalidIDs.push(i) : null
        }
    }
    return invalidIDs
}

export async function sumInvalidIDValues(IDs: number[]): Promise<number> {
    return IDs.reduce((sum, current) => sum + current)
}

export async function findFactors(n: number): Promise<number[]> {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

main()