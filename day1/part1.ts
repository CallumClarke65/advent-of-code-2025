import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const inputCodes = (await getInputRaw(1)).split('\n')
    const startPos = 50;
    const dialAtZeroCount = await doManyRotations(startPos, inputCodes)
    console.log(`The dial was at position 0 ${dialAtZeroCount} time${dialAtZeroCount > 0 ? 's' : ''}`)
}

export async function doRotation(startingPos: number, input: string): Promise<number> {
    const direction = input.substring(0,1)
    const rotationAmount = Number(input.substring(1))
    
    if (!["L","R"].includes(direction) || rotationAmount > 999 || rotationAmount < 0) {
        throw new Error(`Invalid input \"${input}\"`)
    }

    let newPosition = (direction == "L" ? 
        startingPos - rotationAmount :
        startingPos + rotationAmount) % 100

    // If we clicked past 0, we wrapped back around
    if (newPosition < 0) {
        newPosition = newPosition + 100
    }

    return newPosition
}

export async function doManyRotations(startingPos: number, inputCodes: string[]): Promise<number> {
    let currentPos = startingPos;
    let dialAtZeroCount = 0;

    for (let i = 0; i < inputCodes.length; i++) {

        currentPos = await doRotation(currentPos, inputCodes[i])
        if(currentPos == 0) {
            dialAtZeroCount++
        }
    }

    return dialAtZeroCount
}

main()