import fs = require("fs")

const bcFilename = ".luajit/src/lj_bc.h"

const defaultImports = `import { 
    U16, 
    U8 
} from "./primitive"`

function isCommentOrBlank(s: string): boolean {
    return s.startsWith("/*") || s.startsWith("\\")
}

const buildType = `
type Operand<T extends OperandType, V> = {
    type: T
    val: V
}

type OperandType = "dst" | "var" | "str" | "num" | "pri" | "uv" | "lit" | "lits" | "cdata" | "jump" | "func" | "tab" | "base" | "rbase" | "none"

type BuildOp<
    OpName,
    TypeA extends OperandType,
    TypeB extends OperandType,
    TypeC extends OperandType,
    TypeD extends OperandType
> = {
    name: OpName
    A: Operand<TypeA, U8>
    B: Operand<TypeB, U8>
    C: Operand<TypeC, U8>
    D: Operand<TypeD, U16>
}

type BuildOpABC<
    OpName,
    TypeA extends OperandType,
    TypeB extends OperandType,
    TypeC extends OperandType
> = Omit<BuildOp<OpName, TypeA, TypeB, TypeC, never>, "D"> & { type: "ABC" }
type BuildOpAD<
    OpName,
    TypeA extends OperandType,
    TypeD extends OperandType
> = Omit<BuildOp<OpName, TypeA, never, never, TypeD>, "B" | "C"> & {
    type: "AD"
}
`

type OpKind = {
    A: string
    B: string
    C: string
}

function readOp(s: string): [string, OpKind, boolean] {
    const end = !s.endsWith("\\")

    if (!s.startsWith("_")) {
        throw new Error(`Unexpected line: ${s}`)
    }

    const pattern =
        /^_\(([A-Z0-9]+),\s+([_a-z]+),\s+([_a-z]+),\s+([_a-z]+),\s+([_a-z]+)\)( \\)?$/

    const cap = s.match(pattern)
    if (cap === null) {
        throw new Error(`match failed ${s}`)
    }
    /* eslint-disable */
    const [_, op, a, b, c, m] = cap
    /* eslint-enable */

    const mapNone = (s: string): string => {
        if (s === "___") {
            return "none"
        } else {
            return s
        }
    }

    const kind = {
        A: mapNone(a),
        B: mapNone(b),
        C: mapNone(c),
    }

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
    const types = []
    const ops = []
    const matches = []

    let i = 0
    for (const [op, kind] of v) {
        let type
        let match
        if (kind.B === "none") {
            // AD
            type = `export type ${op} = BuildOpAD<"${op}", "${kind.A}", "${kind.C}">`
            match = `type: "AD",
            D: {
                type: "${kind.C}",
                val: new U16([B, C])
            }`
        } else {
            type = `export type ${op} = BuildOpABC<"${op}", "${kind.A}", "${kind.B}", "${kind.C}">`
            match = `type: "ABC",
            B: {
                type: "${kind.B}",
                val: B
            },
            C: {
                type: "${kind.C}",
                val: C
            }`
        }
        ops.push(op)
        types.push(type)
        matches.push(`if (op.value === 0x${i.toString(16)}) {
            return {
                name: "${op}",
                A: {
                    type: "${kind.A}",
                    val: A
                },
                ${match}
            }
        } else`)

        i++
    }

    return `${defaultImports}
    ${buildType}
    ${types.join("\n")}
    export type Instruction = ${ops.join("|")}
    export function buildInstruction([op, A, B, C]: [U8, U8, U8, U8]): Instruction {
        ${matches.join(" ")} {
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
