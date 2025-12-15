import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";
import { Stopwatch } from "../shared/stopwatch";

//console.debug = () => { };

async function main() {
    const sw = new Stopwatch()
    sw.start()
    const rawInput = await getInputRaw(11)
    const serverRack = parseServerRack(rawInput)

    // Part 2 has us look at a graph that is *a lot* bigger than in part 1. So big in fact that straight DFS isn't going to cut it
    // Thankfully, we have some shortcuts. Look at the visualisation of the graph
    // The server rack has a few bottlenecks. We can do DFS between each of these bottlenecks and then multiply the path counts
    // The server rack can be simplified thus:-

    // START - svr
    // Section 1
    // Bottleneck 1 - fbo, het, kfq, jja, fme
    // Section 2 (Includes fft)
    // Bottleneck 2 - iad, dgc, rdq
    // Section 3 
    // Bottleneck 3 - uye, rmg, hvd, wqa, vas
    // Section 4
    // Bottleneck 4 - mqy, eoi, xvr, tbw, xcj
    // Section 5 (Includes dac)
    // Bottleneck 5 - rup, oau, you, gdx, foi
    // Section 6
    // END - out

    const sln = solveServerRack(serverRack)

    console.log(`The number of paths from \'svr\' to \'out\' via \'dac\' and \'fft\' is ${sln}`)
    console.log(`Elapsed time - ${sw.stop()}`)
    // Elapsed time - 00:00.826
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

function solveServerRack(serverRack: Node[]): number {
    // START (svr)
    // Section 1
    const b1 = ['fbo', 'het', 'kfq', 'jja', 'fme']
    // Section 2 (Includes fft)
    const b2 = ['iad', 'dgc', 'rdq']
    // Section 3
    const b3 = ['uye', 'rmg', 'hvd', 'wqa', 'vas']
    // Section 4
    const b4 = ['mqy', 'eoi', 'xvr', 'tbw', 'xcj']
    // Section 5 (Includes dac)
    const b5 = ['rup', 'oau', 'you', 'gdx', 'foi']
    // Section 6
    // END (out)

    const validRoutesToNode: Map<string,number> = new Map<string,number>()

    // Section 1
    for (const endNode of b1) {
        const otherNodesInBottleneck = b1.filter((n) => n != endNode)
        const routes = findPathsFromAtoBincludingCnotViaD(serverRack, 'svr', endNode, [], otherNodesInBottleneck).length
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    // Section 2
    for (const endNode of b2) {
        const otherNodesInBottleneck = b2.filter((n) => n != endNode)

        let routes: number = 0
        for (const startNode of b1) {
            const routesTohere = validRoutesToNode.get(startNode)
            routes += (routesTohere ?? 0) * findPathsFromAtoBincludingCnotViaD(serverRack, startNode, endNode, ['fft'], otherNodesInBottleneck).length
        }
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    // Section 3
    for (const endNode of b3) {
        const otherNodesInBottleneck = b3.filter((n) => n != endNode)

        let routes: number = 0
        for (const startNode of b2) {
            const routesTohere = validRoutesToNode.get(startNode)
            routes += (routesTohere ?? 0) * findPathsFromAtoBincludingCnotViaD(serverRack, startNode, endNode, [], otherNodesInBottleneck).length
        }
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    // Section 4
    for (const endNode of b4) {
        const otherNodesInBottleneck = b4.filter((n) => n != endNode)

        let routes: number = 0
        for (const startNode of b3) {
            const routesTohere = validRoutesToNode.get(startNode)
            routes += (routesTohere ?? 0) * findPathsFromAtoBincludingCnotViaD(serverRack, startNode, endNode, [], otherNodesInBottleneck).length
        }
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    // Section 5
    for (const endNode of b5) {
        const otherNodesInBottleneck = b5.filter((n) => n != endNode)

        let routes: number = 0
        for (const startNode of b4) {
            const routesTohere = validRoutesToNode.get(startNode)
            routes += (routesTohere ?? 0) * findPathsFromAtoBincludingCnotViaD(serverRack, startNode, endNode, ['dac'], otherNodesInBottleneck).length
        }
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    // Section 6
    for (const endNode of ['out']) {

        let routes: number = 0
        for (const startNode of b5) {
            const routesTohere = validRoutesToNode.get(startNode)
            routes += (routesTohere ?? 0) * findPathsFromAtoBincludingCnotViaD(serverRack, startNode, endNode, [], []).length
        }
        console.log(`${routes} valid routes from svr to ${endNode}`)
        validRoutesToNode.set(endNode, routes)
    }

    return validRoutesToNode.get('out') ?? 0
}

export function findPathsFromAtoBincludingCnotViaD(serverRack: Node[], A: string, B: string, C: string[], D: string[]): Path[] {
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

        if (node.index === B) {
            const includesTargetNode = C.map((targetNode) => {
                return currentPath.includes(targetNode)
            })
            if (includesTargetNode.every((b) => b === true)) {
                paths.push({ nodeIndexes: currentPath });
                //console.log(`Added path ${currentPath}, found so far ${paths.length}`)
            }
            return;
        }

        if (D.includes(node.index)) {
            return;
        }

        for (const successorIndex of node.successorIndexes ?? []) {
            depthFirstSearch(serverRack.find((n) => n.index == successorIndex), currentPath);
        }
    }

    depthFirstSearch(startNode, []);

    // Filter paths for those that include the mandatory nodes


    return paths;
}

main()