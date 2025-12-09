import { expect, test } from 'vitest'
import { IngredientsDefinition } from './shared'
import { findNumberOfFreshIngredientIDs } from './part2'

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
            start: 12,
            end: 13
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

test("findAllFreshIngredientIds(testIngredients) should return 14", async () => {
    const result = await findNumberOfFreshIngredientIDs(testIngredients)
    expect(result).toEqual([3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].length)
})

test.each([
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 480515045127383, end: 482200173770213 },
        { start: 477838399509974, end: 479478148266917 },
        { start: 478934701168874, end: 480918679935292 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 482200173770213 - 477838399509974 + 1
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 193216289423781, end: 193825062717958 },
        { start: 192919325855222, end: 193301919451154 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 193825062717958 - 192919325855222 + 1
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 282205680076538, end: 290805772733016 },
        { start: 285851766652934, end: 288204148365205 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 290805772733016 - 282205680076538 + 1
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 17, end: 18 },
        { start: 15, end: 20 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 6
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 17, end: 18 },
        { start: 18, end: 24 },
        { start: 15, end: 20 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 10
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 15, end: 16 },
        { start: 16, end: 16 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 2
  },
  {
    ingredientsDefinition: {
      freshRanges: [
        { start: 27, end: 27 },
        { start: 27, end: 28 },
      ],
      ingredientIDs: []
    },
    ingredientIDcount: 2
  },
])(
  "findAllFreshIngredientIds($ingredientsDefinition.freshRanges) should return $ingredientIDcount",
  async ({ ingredientsDefinition, ingredientIDcount }) => {
    const result = await findNumberOfFreshIngredientIDs(ingredientsDefinition);
    expect(result).toBe(ingredientIDcount);
  }
);