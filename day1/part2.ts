import "dotenv/config"
import { getInputCodes } from "./getInputCodes";

async function main() {
    const inputCodes = await getInputCodes()
    const startPos = 50;
    const dialAtZeroCount = await doManyRotations(startPos, inputCodes)
    console.log(`The dial clicked past 0 ${dialAtZeroCount} time${dialAtZeroCount > 0 ? 's' : ''}`)
}

export async function doRotation(startingPos: number, input: string): Promise<{ newPosition: number, clicksPastZero: number }> {
    const direction = input.substring(0,1)
    const rotationAmount = Number(input.substring(1))
    
    if (!["L","R"].includes(direction) || rotationAmount > 999 || rotationAmount < 0) {
        throw new Error(`Invalid input \"${input}\"`)
    }

    let clicksPastZero = 0

    // Any rotation of over 100 will result in a number of clicks
    clicksPastZero = clicksPastZero + Math.floor(rotationAmount / 100)
    const newRotationAmount = rotationAmount % 100

    let newPosition = (direction == "L" ? 
        startingPos - newRotationAmount :
        startingPos + newRotationAmount) % 100

    // If we have a negative new position, we must have clicked around
    if (newPosition < 0) {
        newPosition = newPosition + 100
        if (startingPos != 0) {
            clicksPastZero++;
        }
    }

    // If we ended up at a lower number than we started at having turned Right, we must have clicked around
    if(newPosition < startingPos && newPosition != 0 && direction === "R") {
        clicksPastZero++;
    }
    
    return {
        newPosition: newPosition,
        clicksPastZero: clicksPastZero
    }
}

export async function doManyRotations(startingPos: number, inputCodes: string[]): Promise<number> {
    let currentPos = startingPos;
    let dialAtZeroCount = 0;

    for (let i = 0; i < inputCodes.length; i++) {

        const rotationResult = await doRotation(currentPos, inputCodes[i])
        if(rotationResult.newPosition === 0) {
            dialAtZeroCount++
        }
        dialAtZeroCount = dialAtZeroCount + rotationResult.clicksPastZero
        currentPos = rotationResult.newPosition
    }

    return dialAtZeroCount
}

main()