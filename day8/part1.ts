import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";

console.debug = () => {};

async function main() {
    const sw = new Stopwatch()
    sw.start()
    const rawInput = await getInputRaw(8)
    const playground = new Playground(rawInput)

    playground.connectMultiplePairs(1000)

    console.log(`The product of the sizes of the three largest circuits is ${playground.findProductOfThreeLargestCircuits()}`)
    console.log(`Elapsed time - ${sw.stop()}`)
    // Elapsed time - 00:04.892
}


export class JunctionBox {
    constructor(
        readonly id: number,
        readonly x: number,
        readonly y: number,
        readonly z: number) {
    }

    public distanceToJunctionBox(jb: JunctionBox): number {
        return Math.sqrt(Math.pow(jb.x - this.x, 2) + Math.pow(jb.y - this.y, 2) + Math.pow(jb.z - this.z, 2))
    }
}

export interface JunctionBoxDistance {
    a: JunctionBox;
    b: JunctionBox;
    distance: number;
}

export class Circuit {
    public junctionBoxes: JunctionBox[]

    constructor(junctionBoxes: JunctionBox[]) {
        this.junctionBoxes = junctionBoxes
    }

    public connectJunctionBox(jb: JunctionBox) {
        this.junctionBoxes.push(jb)
        console.debug(`Connected ${JSON.stringify(jb)} to circuit ${JSON.stringify(this.junctionBoxes)}. New length ${this.junctionBoxes.length}`)
    }

    public mergeWithCircuit(c: Circuit) {
        for(const jb of c.junctionBoxes) {
            this.junctionBoxes.push(jb)
        }
    }
}

export class Playground {
    public junctionBoxes: JunctionBox[] = []
    public circuits: Circuit[] = []
    private junctionBoxDistances: JunctionBoxDistance[] = []

    constructor(junctionBoxPositions?: string, junctionBoxes?: JunctionBox[]) {
        if(junctionBoxPositions) {
            this.parseRawInput(junctionBoxPositions)
        }
        
        if(junctionBoxes) {
            this.junctionBoxes = junctionBoxes
        }
        this.calcJunctionBoxDistances()
    }

    private parseRawInput(junctionBoxPositions: string) {
        const rows = junctionBoxPositions.split('\n')
        let id = 0;
        for(const row of rows) {
            const jbRaw = row.split(',')
            this.junctionBoxes.push(
                new JunctionBox(id, Number(jbRaw[0]), Number(jbRaw[1]), Number(jbRaw[2]))
            )
            id++;
        }
        console.debug(`Constructed playground with ${this.junctionBoxes.length} junction boxes`)
    }

    private calcJunctionBoxDistances() {
        for (const jba of this.junctionBoxes) {
            for (let i = jba.id + 1; i < this.junctionBoxes.length; i++) {
                const jbb = this.junctionBoxes.find((jb) => jb.id === i)

                if(!jbb) {
                    throw new Error(`Unsuccessfully attempted to find a junction box with id ${i}`)
                }

                this.junctionBoxDistances.push({
                    a: jba,
                    b: jbb,
                    distance: jba.distanceToJunctionBox(jbb)
                })
            }
            console.debug(`Calculated distances for ${jba.id} of ${this.junctionBoxes.length} junction boxes`)
        }
    }

    public tryConnectNextPair() {
        // Find the next minimum distance
        const minIndex = this.junctionBoxDistances.reduce((minIdx, rec, idx, arr) =>
            rec.distance < arr[minIdx].distance ? idx : minIdx,
            0
        );
        const minDistPair = this.junctionBoxDistances[minIndex];
        
        // Remove this distance from our list so we don't retry it
        this.junctionBoxDistances.splice(minIndex, 1);

        console.debug(`Trying to connect ${JSON.stringify(minDistPair.a)} and ${JSON.stringify(minDistPair.b)} - distance ${minDistPair.distance.toFixed(2)}`)

        // Figure out whether a or b are in circuits already
        const aCircuit = this.circuits.find((c) => c.junctionBoxes.includes(minDistPair.a))
        const bCircuit = this.circuits.find((c) => c.junctionBoxes.includes(minDistPair.b))

        // If a & b are in the same circuit already, don't connect them
        if(aCircuit && bCircuit && bCircuit.junctionBoxes.some((jb) => minDistPair.a.id === jb.id)){
            console.debug(`${JSON.stringify(minDistPair.a)} and ${JSON.stringify(minDistPair.b)} are in the same circuit. Ignoring`)
            return;
        }

        // If a & b are both in circuits, connect them and merge the circuits
        if(aCircuit && bCircuit) {
            aCircuit.mergeWithCircuit(bCircuit)
            console.debug(`Connected ${JSON.stringify(minDistPair.b)} to circuit ${JSON.stringify(aCircuit)} and merged circuits. New length ${aCircuit.junctionBoxes.length}`)
            this.circuits = this.circuits.filter((c) => c != bCircuit)
            return;
        }

        // If neither of a & b are in a circuit, make a new circuit starting with these two
        if (!aCircuit && !bCircuit) {
            console.debug(`Connected ${JSON.stringify(minDistPair.a)} and ${JSON.stringify(minDistPair.b)} in new circuit. Length 2`)
            this.circuits.push(new Circuit([minDistPair.a, minDistPair.b]))
            return;
        }

        // If exactly one of a & b are in a circuit, add the other to that circuit
        else {
            if(aCircuit) {
                aCircuit.connectJunctionBox(minDistPair.b)
            }
            if(bCircuit) {
                bCircuit.connectJunctionBox(minDistPair.a)
            }
            return;
        }
    }

    public connectMultiplePairs(numberToConnect: number) {
        let connectionsMade = 0;

        while(connectionsMade < numberToConnect) {
            this.tryConnectNextPair()
            connectionsMade++;
        }
    }

    public findProductOfThreeLargestCircuits(): number {
        let a = 1, b = 1, c = 1;

        for (const circuit of this.circuits) {
            if (circuit.junctionBoxes.length > a) {
                c = b;
                b = a;
                a = circuit.junctionBoxes.length;
                continue;
            }
            if (circuit.junctionBoxes.length > b) {
                c = b;
                b = circuit.junctionBoxes.length;
                continue;
            }
            if (circuit.junctionBoxes.length > c) {
                c = circuit.junctionBoxes.length;
                continue;
            }
        }
        console.debug(`Three largest circuits have sizes ${a}, ${b}, ${c}`)

        return a * b * c;
    }

}

main()