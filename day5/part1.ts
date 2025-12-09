import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { getIngredientsDefinition, IngredientsDefinition } from "./shared";

async function main() {
    const rawInput = await getInputRaw(5)
    const ingredientsDefinition = await getIngredientsDefinition(rawInput)
    const freshIngredients = await findFreshIngredients(ingredientsDefinition)

    console.log(`There are ${freshIngredients.length} fresh ingredients`)
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

export { getIngredientsDefinition };
