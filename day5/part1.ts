import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const rawInput = await getInputRaw(5)
    const ingredientsDefinition = await getIngredientsDefinition(rawInput)
    const freshIngredients = await findFreshIngredients(ingredientsDefinition)

    console.log(`There are ${freshIngredients.length} fresh ingredients`)
}

export type FreshRange = {
    start: number,
    end: number
}

export type IngredientsDefinition = {
    freshRanges: FreshRange[],
    ingredientIDs: number[]
}

export async function getIngredientsDefinition(rawInput: string): Promise<IngredientsDefinition> {
    // First split the input into the two information sources
    const allRows = rawInput.split('\n')
    const indexOfSpace = allRows.indexOf('')
    const freshRows = allRows.filter((v, i) => i < indexOfSpace)
    const ingredientIDrows = allRows.filter((v, i) => i > indexOfSpace)

    // Use the separated information to construct the return object
    const freshRanges: FreshRange[] = freshRows.map((v) => {
        const [start,end] = v.split('-')
        return { start: +start, end: +end };
    })
    const ingredientIDs = ingredientIDrows.map((v) => +v )

    return {
        freshRanges: freshRanges,
        ingredientIDs: ingredientIDs
    }
}

export async function findFreshIngredients(ingredientsDefinition: IngredientsDefinition): Promise<number[]> {
    let freshIngredientIds: number[] = []

    for (const ingredientID of ingredientsDefinition.ingredientIDs) {
        // Work through each fresh range and see if we're inside it
        for (const freshRange of ingredientsDefinition.freshRanges) {
            if (ingredientID >= freshRange.start && ingredientID <= freshRange.end && !freshIngredientIds.includes(ingredientID)) {
                freshIngredientIds.push(ingredientID)
            }
        }
    }

    return freshIngredientIds
}

main()