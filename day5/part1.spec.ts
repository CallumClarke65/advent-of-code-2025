import { expect, test } from 'vitest'
import { findFreshIngredients } from './part1'
import { getIngredientsDefinition, IngredientsDefinition } from './shared'

const testIngredientsRawInput = 
'3-5\n10-14\n16-20\n12-18\n\n1\n5\n8\n11\n17\n32'

const testIngredients: IngredientsDefinition = {
    freshRanges: [
        {
            start: 3,
            end: 5
        },
        {
            start: 10,
            end: 14
        },
        {
            start: 16,
            end: 20
        },
        {
            start: 12,
            end: 18
        }
    ],
    ingredientIDs: [
        1,
        5,
        8,
        11,
        17,
        32
    ]
}

test("getIngredientsDefinition(testIngredientsRawInput) should parse correctly", async () => {
    const result = await getIngredientsDefinition(testIngredientsRawInput)
    expect(result).toEqual(testIngredients)
})

test("findFreshIngredients(testIngredients) should return (5, 11, 17)", async () => {
    const result = await findFreshIngredients(testIngredients)
    expect(result).toEqual([5, 11, 17])
})