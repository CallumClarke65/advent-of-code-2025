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