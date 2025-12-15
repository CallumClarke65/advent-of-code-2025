import { writeFileSync } from "fs";
import { getInputRaw } from "../shared/getInputRaw";
import { Node, parseServerRack } from "./part2";

async function debug() {
    const rawInput = await getInputRaw(11)
    const serverRack = parseServerRack(rawInput)
    writeMermaidFile(serverRack)
}

function graphToMermaid(graph: Node[]): string {
    const lines: string[] = ["flowchart LR"];

    for (const node of graph) {
        for (const succ of node.successorIndexes) {
            lines.push(`  ${node.index} --> ${succ}`);
        }
    }

    return lines.join("\n");
}

function writeMermaidFile(
    graph: Node[],
    filename = "graph.mmd"
): void {
    const mermaid = graphToMermaid(graph);
    writeFileSync(filename, mermaid, "utf8");
}

debug()