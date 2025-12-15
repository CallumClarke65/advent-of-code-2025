import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

//console.debug = () => { };

async function main() {
    const rawInput = await getInputRaw(11)
    const serverRack = parseServerRack(rawInput)
    const paths = findPathsFromAtoB(serverRack, 'you', 'out')

    console.log(`The number of paths from \'you\' to \'out\' is ${paths.length}`)
}

export class Node {
    constructor(readonly index: string, readonly successorIndexes: string[]) { }
}

export interface Path {
    nodeIndexes: string[]
}

export function parseServerRack(input: string): Node[] {
    const nodeRows = input.split('\n')

    let serverRack: Node[] = []
    for (const row of nodeRows) {
        serverRack.push(new Node(row.split(': ')[0], row.split(': ')[1].split(' ')))
    }

    // Any node that has no successors needs adding too
    const successorIndexes = serverRack.map((n) => n.successorIndexes).flat()
    successorIndexes.forEach((n) => {
        if (!serverRack.some((node) => node.index === n)) {
            serverRack.push(new Node(n, []))
        }
    })

    return serverRack
}

export function findPathsFromAtoB(serverRack: Node[], A: string, B: string): Path[] {
    // We can't be sure that every route through the tree starting at A ends at B :(
    // Use a recursive function to iterate through every possible path starting at A
    // Then filter out paths that don't end at B
    // For all this we'll use Node indexes rather than Nodes just to reduce the overhead
    // This assumes that node indexes are unique, which I'm not enforcing but I know it's true

    const startNode = serverRack.find((n) => n.index === A)
    const targetNode = serverRack.find((n) => n.index === B)
    if (!startNode) {
        throw new Error(`Node ${A} doesn't exist`)
    }
    if (!targetNode) {
        throw new Error(`Node ${B} doesn't exist`)
    }

    let paths: Path[] = []

    function depthFirstSearch(node: Node | undefined, path: string[]) {
        if (!node) {
            return;
        }

        const currentPath = [...path, node.index];

        // Found target
        if (node.index === B) {
            paths.push({ nodeIndexes: currentPath });
            return;
        }

        // Recurse into children
        for (const successorIndex of node.successorIndexes ?? []) {
            depthFirstSearch(serverRack.find((n) => n.index == successorIndex), currentPath);
        }
    }

    depthFirstSearch(startNode, []);
    return paths;
}

main()