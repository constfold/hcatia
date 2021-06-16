import { Bytecode, Prototype, Instruction } from "."

import { sprintf } from "sprintf-js"

type Write = (s: string) => void

export function bytecode(write: Write, bc: Bytecode): void {
    const c = bc.root.constant_data[0]
    if (typeof c !== "string") {
        c.type
    }
    for (const pt of prototypes(bc.root)) {
        prototype(write, pt)
    }
}

/**
 * All jumps in instructions, will be used for print "=>"
 */
function jumpTable(instructions: Instruction[]): number[] {
    const v = new Array(instructions.length)

    let pc = 0
    for (const inst of instructions) {
        if (inst.type === "AD") {
            if (inst.D.type === "jump") {
                v[jumpTarget(inst.D.val.value, pc)] = true
            }
        } else {
            // @ts-expect-error Currently no jump operand exsits in operand C
            inst.C.type === "jump"
        }

        pc++
    }

    return v
}

function jumpTarget(v: number, pc: number): number {
    return pc + 1 + v - 0x8000
}

function instruction(
    write: Write,
    instructions: Instruction[],
    pc: number,
    prefix = "  "
): void {
    const op = instructions[pc]

    let s = sprintf(
        "%04d %s %-6s %3s ",
        pc,
        prefix,
        op.name,
        op.A.type === "none" ? "" : op.A.val.value
    )

    // TODO: Write extra instruction comments

    if (op.type === "AD") {
        if (op.D.type === "jump") {
            s = sprintf("%s=> %04d\n", s, op.D.val.value)
        } else if (op.D.type === "none") {
            // do nothing
        } else if (op.D.type === "lits" && op.D.val.value > 0x7fff) {
            // Write sign if have
            s = sprintf("%s%3d\n", s, op.D.val.value - 0x10000)
        } else {
            s = sprintf("%s%3d\n", s, op.D.val.value)
        }
    } else {
        s = sprintf("%s%3d %3d\n", s, op.B.val.value, op.C.val.value)
    }

    write(s)
}

function prototype(write: Write, pt: Prototype): void {
    // Write the header
    // TODO: Also write the filename and debug infomation as luaJIT did
    write("-- BYTECODE --")

    const instructions = pt.instructions

    const table = jumpTable(instructions)

    for (let pc = 0; pc < instructions.length; pc++) {
        let prefix
        // Add "=>" if current pc is a jump target
        if (table[pc]) {
            prefix = "=>"
        }

        instruction(write, instructions, pc, prefix)
    }
}

function allChildren(root: Prototype): Prototype[] {
    const data = root.constant_data

    const v = []
    for (const c of data) {
        if (typeof c !== "string" && c.type === "Prototype") {
            v.push(c)
        }
    }

    // The order need to be from first to last
    return v.reverse()
}

/**
 * Rebuild the original prototype stack from the prototype tree with DFS
 * @param root
 * @returns
 */
function prototypes(root: Prototype): Prototype[] {
    const stack: Prototype[] = []
    const v: Prototype[] = []

    stack.push(root)

    while (stack.length !== 0) {
        const pt = stack.pop()

        // It's impossible since stack.length !== 0
        if (pt === undefined) {
            throw new Error("unreachable")
        }

        v.push(pt)

        for (const child of allChildren(pt)) {
            stack.push(child)
        }
    }

    // Reverse the stack since the order is from bottom to top
    return v.reverse()
}
