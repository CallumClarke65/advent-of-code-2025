import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

console.debug = () => {};

async function main() {
    const inputBatteryBanks = (await getInputRaw(3)).split('\n')
    const totalMaxJoltage = await findTotalMaxJoltage(inputBatteryBanks)

    console.log(`The total output joltage is ${totalMaxJoltage} jolts`)
}

export async function findTotalMaxJoltage(batteryBanks: string[]): Promise<number> {
    const results = await Promise.all(
        batteryBanks.map((b) => findMaxJoltage(b))
    );
    return results.reduce((sum, v) => sum + v, 0);
}

export async function findMaxJoltage(batteryBank: string): Promise<number> {
    
    const batteryBankStringArray = batteryBank.split('')
    const batteryBankNumberArray = batteryBankStringArray.map((v) => Number(v))

    let batteryValues = Array<number>(12).fill(0)

    for(let i = 0; i < batteryBankNumberArray.length; i++) {
        // Find the first valid position that we can use this battery if its better than what we've seen
        console.debug(`Looking at number ${batteryBankNumberArray[i]} from position ${i} in the bank`)
        for(let j = 0; j < batteryValues.length; j++) {
            console.debug(`Can this number go in position ${j}?`)
            if(batteryBankNumberArray.length - i < (batteryValues.length - j)) {
                console.debug(`No - there's not enough batteries left after this one`)
                continue;
            }

            if(batteryBankNumberArray[i] > batteryValues[j]) {
                batteryValues[j] = batteryBankNumberArray[i];
                for (let k = j + 1; k < batteryValues.length; k++) {
                    batteryValues[k] = 0;
                }
               
                console.debug(`Yes! - Placed number ${i} (${batteryBankNumberArray[i]}) in position ${j}`)
                break;
            } else {
                console.debug(`No - current number ${batteryBankNumberArray[i]} is not bigger than our battery in this position (${batteryValues[j]})`)
            }
        }
    }

    let totalJoltageValue = 0;
    for(let i = 0; i < batteryValues.length; i++) {
        totalJoltageValue += Math.pow(10,(batteryValues.length - i - 1)) * batteryValues[i]
    }
    return totalJoltageValue
}

main()