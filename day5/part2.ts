import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { FreshRange, getIngredientsDefinition, IngredientsDefinition } from "./shared";

async function main() {
    const rawInput = await getInputRaw(5)
    const ingredientsDefinition = await getIngredientsDefinition(rawInput)
    const numberOfFreshIngredientIDs = await findNumberOfFreshIngredientIDs(ingredientsDefinition)

    console.log(`There are ${numberOfFreshIngredientIDs} possible fresh ingredients`)
}

export async function findNumberOfFreshIngredientIDs(ingredientsDefinition: IngredientsDefinition): Promise<number> {
    // Can't use looping or Array.from due to the size of the ranges involved(!)

    let processedRanges: FreshRange[] = [];
    let numberOfFreshIngredientIDs: number = 0;

    // First sort our ranges so we can avoid cases where we have an already processed range entirely within the bounds of the range we're processing
    const orderedRanges = ingredientsDefinition.freshRanges.sort((a, b) => a.start - b.start)

    for (const freshRange of orderedRanges) {
        // Figure out if there's any overlaps with already processedRanges
        const overlappingRanges = processedRanges.filter((pfr) => {
            return (
                (freshRange.start >= pfr.start && freshRange.start <= pfr.end) ||
                (freshRange.end >= pfr.start && freshRange.end <= pfr.end)
            )
        })

        let unProcessedIDmin: number = freshRange.start;
        let unProcessedIDmax: number = freshRange.end;

        for (const or of overlappingRanges) {

            if(or.end === freshRange.start && or.end === unProcessedIDmin) {
                unProcessedIDmin++;
            }

            if(or.start === freshRange.end  && or.start === unProcessedIDmax) {
                unProcessedIDmax--;
            }

            if (or.start > freshRange.start && or.start < freshRange.end && or.start < unProcessedIDmax) {
                unProcessedIDmax = or.start - 1
            }

            if (or.end < freshRange.end && or.end > freshRange.start && or.end > unProcessedIDmin) {
                unProcessedIDmin = or.end + 1
            }

            if (or.start <= freshRange.start && or.end >= freshRange.end) {
                unProcessedIDmax = -1
                unProcessedIDmin = 0
                continue;
            }

        }

        if(unProcessedIDmax >= unProcessedIDmin) {
            numberOfFreshIngredientIDs += (unProcessedIDmax - unProcessedIDmin + 1)
        }

        processedRanges.push(freshRange)
    }

    return numberOfFreshIngredientIDs

}

main()