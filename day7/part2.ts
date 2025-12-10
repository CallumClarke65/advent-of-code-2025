import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const rawInput = await getInputRaw(7)
    const manifold = new Manifold(rawInput)
    manifold.fireTheBeam()
    console.log(`The number of timelines is ${manifold.timelines}`)
}

export class Position {

    public beams: number;

    constructor(readonly hasSplitter: boolean, beams: number) {
        this.beams = beams;
    }
}

export class Manifold {

    private rows: Position[][] = [];
    private currentTachyonBeamRow: number = 1;
    public timelines: number = 1;

    constructor(manifoldDiagram: string) {
        this.constructManifold(manifoldDiagram)
    }

    private constructManifold(manifoldDiagram: string) {
        const rows = manifoldDiagram.split('\n')
        for (const row of rows) {
            this.rows.push(row.split('').map((v) => {
                // Simplify the Source by pretending the beam is already there
                if (v === 'S') {
                    return {
                        hasSplitter: false,
                        beams: 1
                    }
                }
                if (v !== '.' && v !== '^' && v !== '|') {
                    throw new Error(`Invalid diagram entry: ${v}`);
                }
                return {
                    hasSplitter: v === '^',
                    beams: 0
                };
            }))
        }
    }

    public fireTheBeam() {
        while (this.currentTachyonBeamRow != this.rows.length) {
            this.moveBeamToNextRow()
            this.currentTachyonBeamRow++
        }
    }

    private moveBeamToNextRow() {
        if (this.currentTachyonBeamRow == this.rows.length) {
            console.log(`Tachyon Beam reached bottom of manifold`)
            return;
        }

        // Re-calculate the current row
        for (let i = 0; i < this.rows[this.currentTachyonBeamRow].length; i++) {
            // If we're an empty space, and there's a beam above us
            if (!this.rows[this.currentTachyonBeamRow][i].hasSplitter && this.rows[this.currentTachyonBeamRow - 1][i].beams > 0) {
                this.rows[this.currentTachyonBeamRow][i].beams += this.rows[this.currentTachyonBeamRow - 1][i].beams
            }

            // If we're a splitter with a beam above it
            if (
                this.rows[this.currentTachyonBeamRow][i].hasSplitter
                && this.rows[this.currentTachyonBeamRow - 1][i].beams > 0
            ) {
                if (!this.rows[this.currentTachyonBeamRow][i - 1].hasSplitter) {
                    this.rows[this.currentTachyonBeamRow][i - 1].beams += this.rows[this.currentTachyonBeamRow - 1][i].beams
                }
                if (!this.rows[this.currentTachyonBeamRow][i + 1].hasSplitter) {
                    this.rows[this.currentTachyonBeamRow][i + 1].beams += this.rows[this.currentTachyonBeamRow - 1][i].beams
                }

            }
        }

        this.timelines = this.rows[this.rows.length - 1].reduce((s, v) => s + v.beams,0)
    }

    public prettyPrint(): string {
        return this.rows.map(row => row.map(p => {
            if (p.hasSplitter) return '^';
            if (p.beams === 0) return '.';
            return p.beams;
        }).join('')).join('\n');
    }
}

main()