import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

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

    let firstBatteryValue = 0;
    let secondBatteryValue = 0;

    for(let i = 0; i < batteryBankNumberArray.length; i++) {
        // The last value in the array cannot be our first battery
        if (batteryBankNumberArray[i] > firstBatteryValue && i != batteryBankNumberArray.length - 1) {
            firstBatteryValue = batteryBankNumberArray[i]
            secondBatteryValue = 0
            continue;
        } 

        if (batteryBankNumberArray[i] > secondBatteryValue) {
            secondBatteryValue = batteryBankNumberArray[i]
        }
    }

    return firstBatteryValue * 10 + secondBatteryValue
}

main()