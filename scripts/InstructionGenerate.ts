import fs = require("fs")

const bcFilename = ".luajit/src/lj_bc.h"

const defaultImports = `import { 
    U16, 
    U8 
} from "./primitive"`

function isCommentOrBlank(s: string): boolean {
    return s.startsWith("/*") || s.startsWith("\\")
}

const AD = "\"A\" | \"D\""
const ABC = "\"A\" | \"B\" | \"C\""
type OpKind = typeof AD | typeof ABC

function readOp(s: string): [string, OpKind, boolean] {
    const end = !s.endsWith("\\")

    if (!s.startsWith("_")) {
        throw new Error(`Unexpected line: ${s}`)
    }

    const pattern = /^_\(([A-Z0-9]+),\s+([_a-z]+),\s+([_a-z]+),\s+([_a-z]+),\s+([_a-z]+)\)( \\)?$/

    const cap = s.match(pattern)
    if (cap === null) {
        throw new Error(`match failed ${s}`)
    }
    /* eslint-disable */
    const [_, op, a, b, c, m] = cap
    /* eslint-enable */

    const kind = b === "___" ? AD : ABC

    return [op, kind, end]
}

function generateInstructions(data: Buffer): string {
    const s = data.toString("utf-8")
    const bcDef = s.substr(s.indexOf("#define BCDEF(_) \\"))
    // skip the first line ( #define )
    const lines = bcDef
        .split(/\r\n|\r|\n/)
        .slice(1)
        .map((s) => s.trim())

    const instructions: [string, OpKind][] = []

    for (const line of lines) {
        if (isCommentOrBlank(line)) {
            continue
        }

        const [op, kind, end] = readOp(line)

        instructions.push([op, kind])

        if (end) {
            break
        }
    }

    return generate(instructions)
}

function generate(v: [string, OpKind][]): string {
    let types = ""
    let inst = "export type Instruction = never"

    for (const [op, kind] of v) {
        types += `export type ${op} = Pick<{
            name: "${op}",
            A: U8,
            B: U8,
            C: U8,
            D: U16
        }, "name" | ${kind}>
        `
        inst += `| ${op}`
    }

    let body = ""
    let i = 0
    for (const [op, kind] of v) {
        let s: string
        if (kind === AD) {
            s = "D: new U16([B, C])"
        } else {
            s = `B,
            C`
        }
        body += `if (op.value === 0x${i.toString(16)}) {
            return {
                name: "${op}",
                A,
                ${s}
            }
        } else `
        i++
    }

    return `${defaultImports}
    ${types}
    ${inst}
    export function buildInstruction([op, A, B, C]: [U8, U8, U8, U8]): Instruction {
        ${body}{
            throw new Error(\`unknown op \${op.value}\`)
        }
    }
    `
}

function main() {
    fs.readFile(bcFilename, (err, data) => {
        if (err === null) {
            console.log(generateInstructions(data))
        } else {
            throw err
        }
    })
}

main()
