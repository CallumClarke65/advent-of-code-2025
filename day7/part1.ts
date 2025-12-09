import "dotenv/config"
import { getInputRaw } from "../shared/getInputRaw";

async function main() {
    const rawInput = await getInputRaw(7)
    const manifold = new Manifold(rawInput)
    manifold.fireTheBeam()
    console.log(`The number of splits performed was ${manifold.splitsPerformed}`)
}

export class Manifold {

    private rows: Array<'.' | '^' | '|'>[] = [];
    private currentTachyonBeamRow: number = 1;
    public splitsPerformed: number = 0;

    constructor(manifoldDiagram: string) {
        this.constructManifold(manifoldDiagram)
    }

    private constructManifold(manifoldDiagram: string) {
        const rows = manifoldDiagram.split('\n')
        for (const row of rows) {
            this.rows.push(row.split('').map((v) => {
                // Simplify the Source by pretending the beam is already there
                if (v === 'S') {
                    v = '|'
                }
                if (v !== '.' && v !== '^' && v !== '|') {
                    throw new Error(`Invalid diagram entry: ${v}`);
                }
                return v;
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
            if (this.rows[this.currentTachyonBeamRow][i] == '.' && this.rows[this.currentTachyonBeamRow - 1][i] == '|') {
                this.rows[this.currentTachyonBeamRow][i] = '|'
            }

            // If we're a splitter with a beam above it
            if (
                this.rows[this.currentTachyonBeamRow][i] == '^'
                && this.rows[this.currentTachyonBeamRow - 1][i] == '|'
            ) {
                if (this.rows[this.currentTachyonBeamRow][i - 1] == '.') {
                    this.rows[this.currentTachyonBeamRow][i - 1] = '|'
                }
                if (this.rows[this.currentTachyonBeamRow][i + 1] == '.') {
                    this.rows[this.currentTachyonBeamRow][i + 1] = '|'
                }
                this.splitsPerformed++;
            }
        }
    }

    public prettyPrint(): string {
        return this.rows.map(row => row.join('')).join('\n');
    }
}

main()