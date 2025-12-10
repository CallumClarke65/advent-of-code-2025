import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";
import { Playground } from "./shared";

console.debug = () => {};

async function main() {
    const sw = new Stopwatch()
    sw.start()
    const rawInput = await getInputRaw(8)
    const playground = new Playground(rawInput)

    const lastConnection = playground.connectAllJunctionBoxes()

    console.log(`The product of the x co-ords of the last connected jbs is ${lastConnection.jba.x * lastConnection.jbb.x}`)
    console.log(`Elapsed time - ${sw.stop()}`)
    // Elapsed time - 00:20.311
}

main()