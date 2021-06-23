import {
    Assign,
    Call,
    Cond,
    ConstData,
    File,
    Fn,
    ForIn,
    ForNumEnd,
    ForNumInit,
    ChildFunc,
    GenericLoop,
    If,
    IfThenAssign,
    Instruction,
    Jump,
    Lit,
    MultRes,
    NumConst,
    Pri,
    RetCall,
    RetVar,
    Src,
    StringConst,
    Symbols,
    TableConst,
    Upvalue,
    Var,
    VarList,
} from "."
import {
    Bytecode,
    ConstantData,
    ConstantNumber,
    Prototype,
    PtFlags,
    Instruction as BcInst,
    False,
    True,
    Nil,
    Upvalue as UpvalueDetail,
} from "../bytecode"
import assert from "assert"
import { Operand } from "../bytecode/instructions"
import { U16, U8, Uleb128_33 } from "../bytecode/primitive"

export default function transform(bc: Bytecode): File {
    const filename = bc.filename

    const root = fn(bc.root)

    assert(root.parent === undefined)

    return {
        name: filename,
        fn: root,
    }
}

function fn(pt: Prototype): Fn {
    const variadic = pt.flags.contains(PtFlags.VARIADIC)
    const paramsNum = pt.params_num.value

    const symbols_ = symbols(pt.constant_data, pt.constant_numbers, pt.upvalues)

    const instructions_ = new InstructionTransformer(pt, symbols_).output()

    const f: Fn = {
        type: "Fn",
        // We can't set the parent of fn for now and will set it in `setParentForChildren`
        parent: undefined,
        variadic,
        paramsNum,
        symbols: symbols_,
        instructions: instructions_,
    }
    setParentForChildren(f)

    return f
}

function symbols(data: ConstantData[], numbers: ConstantNumber[], upvalues: UpvalueDetail[]): Symbols {
    const data_ = data.map((c) => {
        if (typeof c !== "string" && c.type === "Prototype") {
            return fn(c)
        } else {
            return c
        }
    })

    return {
        data: data_,
        upvalues,
        numbers,
    }
}

function setParentForChildren(fn: Fn) {
    for (const c of fn.symbols.data) {
        if (typeof c !== "string" && c.type === "Fn") {
            assert(c.parent === undefined)
            c.parent = fn
        }
    }
}

function range(start: number, end: number): number[] {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}

function rangeInclusive(start: number, end: number): number[] {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
}

class InstructionTransformer {
    pt
    pc
    syms
    zeroNumIdx
    pcMap: number[]
    buf: Instruction[]

    constructor(pt: Prototype, syms: Symbols) {
        this.pt = pt
        this.syms = syms
        this.pcMap = new Array(pt.instructions.length).fill(-1)
        this.buf = []
        this.pc = -1

        // Add an extra zero number for `forLoopCheck` even it's not used.
        this.zeroNumIdx = this.syms.numbers.findIndex((n) => n.value === 0)
        if (this.zeroNumIdx === -1) {
            this.zeroNumIdx = this.syms.numbers.length
            this.syms.numbers.push(new Uleb128_33(0))
        }
    }

    output(): Instruction[] {
        while (this.pc !== this.pcMap.length - 1) {
            this.tracePc(() => {
                const bcInst = this.nextBcInst()
                const inst: Instruction = this[bcInst.name](bcInst)
                this.buf.push(inst)
            })
        }

        return this.buf
    }

    private tracePc(f: () => void) {
        const start = this.pc
        f()
        const end = this.pc
        // FIXME: pc might be discontinuous
        for (let i = start + 1; i <= end; i++) {
            if (this.pcMap[i] !== -1) {
                throw new Error(`pc${i} were already filled`)
            } else {
                this.pcMap[i] = this.buf.length - 1
            }
        }
    }

    nextBcInst(): BcInst {
        return this.pt.instructions[++this.pc]
    }

    currentBcInst(): BcInst {
        return this.pt.instructions[this.pc]
    }

    /**
     * Get the target of a jump that refs to the number of the instrcution in bytecode. It will be
     * mapped to the number of the IR's instrcution later.
     */
    jumpTarget(jmp: Operand<"jump", U16>): number {
        return this.pc + 1 + jmp.val.value - 0x8000
    }

    var(oprand: Operand<"var", U8 | U16>): Var {
        return {
            type: "Var",
            slot: oprand.val.value,
        }
    }

    dst(oprand: Operand<"dst", U8>): Var {
        return {
            type: "Var",
            slot: oprand.val.value,
        }
    }

    str(oprand: Operand<"str", U8 | U16>): StringConst {
        const idx = oprand.val.value
        if (typeof this.syms.data[idx] !== "string") {
            throw new Error("Constant type mismatched")
        }
        return {
            type: "StringConst",
            idx,
        }
    }

    cdata(oprand: Operand<"cdata", U16>): ConstData {
        const idx = oprand.val.value
        const data = this.syms.data[idx]
        if (typeof data === "string" || data.type === "Fn") {
            throw new Error("Constant type mismatched")
        }
        return {
            type: "CDataConst",
            idx,
        }
    }

    num(oprand: Operand<"num", U16 | U8>): NumConst {
        return {
            type: "NumConst",
            idx: oprand.val.value,
        }
    }

    uv(oprand: Operand<"uv", U8 | U16>): Upvalue {
        return {
            type: "Upvalue",
            idx: oprand.val.value,
        }
    }

    func(oprand: Operand<"func", U16>): ChildFunc {
        const idx = oprand.val.value
        const data = this.syms.data[idx]
        if (typeof data === "string" || data.type !== "Fn") {
            throw new Error("Constant type mismatched")
        }
        return {
            type: "ChildFunc",
            idx,
        }
    }

    tab(oprand: Operand<"tab", U16>): TableConst {
        const idx = oprand.val.value
        const data = this.syms.data[idx]
        if (typeof data === "string" || data.type !== "Table") {
            throw new Error("Constant type mismatched")
        }
        return {
            type: "TableConst",
            idx,
        }
    }

    pri(oprand: Operand<"pri", U16>): Pri {
        let val: True | False | Nil
        if (oprand.val.value === 0) {
            val = { type: "Nil" }
        } else if (oprand.val.value === 1) {
            val = { type: "False" }
        } else if (oprand.val.value === 2) {
            val = { type: "True" }
        } else {
            throw new Error(`Unknown pri ${oprand.val.value}`)
        }
        return {
            type: "Pri",
            val,
        }
    }

    lits(oprand: Operand<"lits", U16>): Lit {
        return {
            type: "Lit",
            // Recover sign
            val: oprand.val.value - 0x10000,
        }
    }

    lit(oprand: Operand<"lit", U8 | U16>): Lit {
        return {
            type: "Lit",
            val: oprand.val.value,
        }
    }

    varList(
        start: Operand<"base" | "rbase", U8>,
        end: Operand<"base" | "rbase", U8 | U16>
    ): VarList {
        const vars: Var[] = []
        for (let i = start.val.value; i < end.val.value; i++) {
            vars.push({
                type: "Var",
                slot: i,
            })
        }
        return {
            type: "VarList",
            vars,
        }
    }

    call(
        A: Operand<"base", U8>,
        C: Operand<"lit", U8 | U16>,
        m: boolean
    ): Call {
        const fxiedArgsNum = C.val.value - 1
        const srcs: Src[] = []
        for (let i = 0; i < fxiedArgsNum; i++) {
            srcs.push({ type: "Var", slot: A.val.value + 1 + i })
        }
        if (m) {
            srcs.push({ type: "MultRes" })
        }
        return {
            type: "Call",
            f: {
                type: "Var",
                slot: A.val.value,
            },
            args: srcs,
        }
    }

    callOrAssign(
        A: Operand<"base", U8>,
        B: Operand<"lit", U8>,
        call: Call
    ): Call | Assign {
        const returns = B.val.value - 1
        if (returns === -1) {
            return {
                type: "Assign",
                dst: { type: "MultRes" },
                src: call,
            }
        } else if (returns === 0) {
            return call
        } else {
            const vars: Var[] = []
            for (let i = 0; i < returns; i++) {
                vars.push({
                    type: "Var",
                    slot: A.val.value + i,
                })
            }
            return {
                type: "Assign",
                dst: {
                    type: "VarList",
                    vars,
                },
                src: call,
            }
        }
    }

    retVar(
        A: Operand<"base" | "rbase", U8>,
        D: Operand<"lit", U16>,
        m: boolean
    ): RetVar {
        const fixedValuesNum = D.val.value
        const base = A.val.value

        const values: Src[] = range(base, base + fixedValuesNum).map((i) => {
            return { type: "Var", slot: i }
        })
        if (m) {
            values.push({ type: "MultRes" })
        }

        return {
            type: "RetVar",
            values,
        }
    }

    forIn(call: BcInst): ForIn {
        assert(call.name === "ITERC" || call.name === "ITERN")
        const loop = this.nextBcInst()
        assert(loop.name === "ITERL")

        const A1 = call.A.val.value
        const init: Assign = {
            type: "Assign",
            dst: {
                type: "VarList",
                vars: rangeInclusive(A1, A1 + 2).map((slot) => {
                    return { type: "Var", slot }
                }),
            },
            src: {
                type: "SrcList",
                srcs: rangeInclusive(A1 - 3, A1 - 1).map((slot) => {
                    return { type: "Var", slot }
                }),
            },
        }

        const B1 = call.B.val.value - 1
        const callIter: Assign = {
            type: "Assign",
            dst: {
                type: "VarList",
                vars: range(A1, A1 + B1).map((slot) => {
                    return { type: "Var", slot }
                }),
            },
            src: {
                type: "Call",
                f: { type: "Var", slot: A1 },
                args: [
                    { type: "Var", slot: A1 + 1 },
                    { type: "Var", slot: A1 + 1 },
                ],
            },
        }

        const A2 = loop.A.val.value
        const reduce: Assign = {
            type: "Assign",
            dst: { type: "Var", slot: A2 + 1 },
            src: { type: "Var", slot: A2 },
        }

        const check: If = {
            type: "If",
            cond: {
                type: "Ne",
                left: { type: "Var", slot: A2 },
                right: { type: "Pri", val: { type: "Nil" } },
            },
            thenBranch: this.jumpTarget(loop.D),
            elseBranch: this.pc + 1,
        }

        return {
            type: "ForIn",
            init,
            callIter,
            reduce,
            check,
        }
    }

    forLoopCheck(base: Operand<"base", U8>): Cond {
        const idx: Var = { type: "Var", slot: base.val.value }
        const limit: Var = { type: "Var", slot: idx.slot + 1 }
        const step: Var = { type: "Var", slot: idx.slot + 2 }
        // const v: Var = { type: "Var", slot: idx.slot + 3 }
        const cond: Cond = {
            type: "Or",
            left: {
                type: "And",
                left: {
                    type: "Gt",
                    left: step,
                    right: {
                        type: "NumConst",
                        idx: this.zeroNumIdx,
                    },
                },
                right: {
                    type: "Le",
                    left: idx,
                    right: limit,
                },
            },
            right: {
                type: "And",
                left: {
                    type: "Le",
                    left: step,
                    right: {
                        type: "NumConst",
                        idx: this.zeroNumIdx,
                    },
                },
                right: {
                    type: "Ge",
                    left: idx,
                    right: limit,
                },
            },
        }

        return cond
    }

    newTableSize(operand: Operand<"lit", U16>): {
        arraySize: number
        hashSize: number
    } {
        const val = operand.val.value
        return {
            // the lowest 11 bits give the array size
            arraySize: val & 0x7ff,
            // the upper 5 bits give the hash size as a power of two
            hashSize: 2 ** (val >> 11),
        }
    }

    nextJump(): Jump {
        const jmp = this.nextBcInst()
        assert(jmp.name === "JMP")
        return {
            type: "Jump",
            target: this.jumpTarget(jmp.D),
        }
    }

    ISLT(bcInst: BcInst): If {
        assert(bcInst.name === "ISLT")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISGE(bcInst: BcInst): If {
        assert(bcInst.name === "ISGE")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Ge",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISLE(bcInst: BcInst): If {
        assert(bcInst.name === "ISLE")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Le",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISGT(bcInst: BcInst): If {
        assert(bcInst.name === "ISGT")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Gt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISEQV(bcInst: BcInst): If {
        assert(bcInst.name === "ISEQV")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Eq",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISNEV(bcInst: BcInst): If {
        assert(bcInst.name === "ISNEV")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Ne",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISEQS(bcInst: BcInst): If {
        assert(bcInst.name === "ISEQS")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Eq",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISNES(bcInst: BcInst): If {
        assert(bcInst.name === "ISNES")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Ne",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISEQN(bcInst: BcInst): If {
        assert(bcInst.name === "ISEQN")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISNEN(bcInst: BcInst): If {
        assert(bcInst.name === "ISNEN")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISEQP(bcInst: BcInst): If {
        assert(bcInst.name === "ISEQP")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISNEP(bcInst: BcInst): If {
        assert(bcInst.name === "ISNEP")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.A.type](bcInst.A),
                right: this[bcInst.D.type](bcInst.D),
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISTC(bcInst: BcInst): IfThenAssign {
        assert(bcInst.name === "ISTC")

        const jump = this.nextJump()

        const assign: Assign = {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
        const ifAssign: IfThenAssign = {
            type: "IfThenAssign",
            cond: {
                type: "Eq",
                left: this[bcInst.D.type](bcInst.D),
                right: { type: "Pri", val: { type: "True" } },
            },
            assign,
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }

        return ifAssign
    }
    ISFC(bcInst: BcInst): IfThenAssign {
        assert(bcInst.name === "ISFC")
        const jump = this.nextJump()

        const assign: Assign = {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
        const ifAssign: IfThenAssign = {
            type: "IfThenAssign",
            cond: {
                type: "Eq",
                left: this[bcInst.D.type](bcInst.D),
                right: { type: "Pri", val: { type: "True" } },
            },
            assign,
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }

        return ifAssign
    }
    IST(bcInst: BcInst): If {
        assert(bcInst.name === "IST")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.D.type](bcInst.D),
                right: {
                    type: "Pri",
                    val: { type: "True" },
                },
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    ISF(bcInst: BcInst): If {
        assert(bcInst.name === "ISF")
        const jump = this.nextJump()
        return {
            type: "If",
            cond: {
                type: "Lt",
                left: this[bcInst.D.type](bcInst.D),
                right: {
                    type: "Pri",
                    val: { type: "False" },
                },
            },
            thenBranch: jump.target,
            elseBranch: this.pc + 1,
        }
    }
    MOV(bcInst: BcInst): Assign {
        assert(bcInst.name === "MOV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    NOT(bcInst: BcInst): Assign {
        assert(bcInst.name === "NOT")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Not",
                expr: this[bcInst.D.type](bcInst.D),
            },
        }
    }
    UNM(bcInst: BcInst): Assign {
        assert(bcInst.name === "UNM")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Unm",
                expr: this[bcInst.D.type](bcInst.D),
            },
        }
    }
    LEN(bcInst: BcInst): Assign {
        assert(bcInst.name === "LEN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Len",
                expr: this[bcInst.D.type](bcInst.D),
            },
        }
    }
    ADDVN(bcInst: BcInst): Assign {
        assert(bcInst.name === "ADDVN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    SUBVN(bcInst: BcInst): Assign {
        assert(bcInst.name === "SUBVN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Sub",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    MULVN(bcInst: BcInst): Assign {
        assert(bcInst.name === "MULVN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Mul",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    DIVVN(bcInst: BcInst): Assign {
        assert(bcInst.name === "DIVVN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Div",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    MODVN(bcInst: BcInst): Assign {
        assert(bcInst.name === "MODVN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Mod",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    ADDNV(bcInst: BcInst): Assign {
        assert(bcInst.name === "ADDNV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.C.type](bcInst.C),
                right: this[bcInst.B.type](bcInst.B),
            },
        }
    }
    SUBNV(bcInst: BcInst): Assign {
        assert(bcInst.name === "SUBNV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Sub",
                left: this[bcInst.C.type](bcInst.C),
                right: this[bcInst.B.type](bcInst.B),
            },
        }
    }
    MULNV(bcInst: BcInst): Assign {
        assert(bcInst.name === "MULNV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.C.type](bcInst.C),
                right: this[bcInst.B.type](bcInst.B),
            },
        }
    }
    DIVNV(bcInst: BcInst): Assign {
        assert(bcInst.name === "DIVNV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.C.type](bcInst.C),
                right: this[bcInst.B.type](bcInst.B),
            },
        }
    }
    MODNV(bcInst: BcInst): Assign {
        assert(bcInst.name === "MODNV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.C.type](bcInst.C),
                right: this[bcInst.B.type](bcInst.B),
            },
        }
    }
    ADDVV(bcInst: BcInst): Assign {
        assert(bcInst.name === "ADDVV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Add",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    SUBVV(bcInst: BcInst): Assign {
        assert(bcInst.name === "SUBVV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Sub",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    MULVV(bcInst: BcInst): Assign {
        assert(bcInst.name === "MULVV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Mul",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    DIVVV(bcInst: BcInst): Assign {
        assert(bcInst.name === "DIVVV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Div",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    MODVV(bcInst: BcInst): Assign {
        assert(bcInst.name === "MODVV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Mod",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    POW(bcInst: BcInst): Assign {
        assert(bcInst.name === "POW")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Pow",
                left: this[bcInst.B.type](bcInst.B),
                right: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    CAT(bcInst: BcInst): Assign {
        assert(bcInst.name === "CAT")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Cat",
                vars: this.varList(bcInst.B, bcInst.C),
            },
        }
    }
    KSTR(bcInst: BcInst): Assign {
        assert(bcInst.name === "KSTR")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    KCDATA(bcInst: BcInst): Assign {
        assert(bcInst.name === "KCDATA")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    KSHORT(bcInst: BcInst): Assign {
        assert(bcInst.name === "KSHORT")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    KNUM(bcInst: BcInst): Assign {
        assert(bcInst.name === "KNUM")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    KPRI(bcInst: BcInst): Assign {
        assert(bcInst.name === "KPRI")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    KNIL(bcInst: BcInst): Assign {
        assert(bcInst.name === "KNIL")
        return {
            type: "Assign",
            dst: this.varList(bcInst.A, bcInst.D),
            src: { type: "Pri", val: { type: "Nil" } },
        }
    }
    UGET(bcInst: BcInst): Assign {
        assert(bcInst.name === "UGET")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    USETV(bcInst: BcInst): Assign {
        assert(bcInst.name === "USETV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    USETS(bcInst: BcInst): Assign {
        assert(bcInst.name === "USETS")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    USETN(bcInst: BcInst): Assign {
        assert(bcInst.name === "USETN")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    USETP(bcInst: BcInst): Assign {
        assert(bcInst.name === "USETP")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    UCLO(bcInst: BcInst): Jump {
        assert(bcInst.name === "UCLO")
        // TODO: Find what "close upvalue" means
        return {
            type: "Jump",
            target: this.jumpTarget(bcInst.D),
        }
    }
    FNEW(bcInst: BcInst): Assign {
        assert(bcInst.name === "FNEW")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    TNEW(bcInst: BcInst): Assign {
        assert(bcInst.name === "TNEW")
        const { arraySize, hashSize } = this.newTableSize(bcInst.D)
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "NewTable",
                arraySize,
                hashSize,
            },
        }
    }
    TDUP(bcInst: BcInst): Assign {
        assert(bcInst.name === "TDUP")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: this[bcInst.D.type](bcInst.D),
        }
    }
    GGET(bcInst: BcInst): Assign {
        assert(bcInst.name === "GGET")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Global",
                varName: this[bcInst.D.type](bcInst.D),
            },
        }
    }
    GSET(bcInst: BcInst): Assign {
        assert(bcInst.name === "GSET")
        return {
            type: "Assign",
            dst: {
                type: "Global",
                varName: this[bcInst.D.type](bcInst.D),
            },
            src: this[bcInst.A.type](bcInst.A),
        }
    }
    TGETV(bcInst: BcInst): Assign {
        assert(bcInst.name === "TGETV")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    TGETS(bcInst: BcInst): Assign {
        assert(bcInst.name === "TGETS")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    TGETB(bcInst: BcInst): Assign {
        assert(bcInst.name === "TGETB")
        return {
            type: "Assign",
            dst: this[bcInst.A.type](bcInst.A),
            src: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
        }
    }
    TSETV(bcInst: BcInst): Assign {
        assert(bcInst.name === "TSETV")
        return {
            type: "Assign",
            dst: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
            src: this[bcInst.A.type](bcInst.A),
        }
    }
    TSETS(bcInst: BcInst): Assign {
        assert(bcInst.name === "TSETS")
        return {
            type: "Assign",
            dst: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
            src: this[bcInst.A.type](bcInst.A),
        }
    }
    TSETB(bcInst: BcInst): Assign {
        assert(bcInst.name === "TSETB")
        return {
            type: "Assign",
            dst: {
                type: "Table",
                table: this[bcInst.B.type](bcInst.B),
                key: this[bcInst.C.type](bcInst.C),
            },
            src: this[bcInst.A.type](bcInst.A),
        }
    }
    TSETM(bcInst: BcInst): Assign {
        assert(bcInst.name === "TSETM")
        return {
            type: "Assign",
            dst: {
                type: "Table",
                table: {
                    type: "Var",
                    slot: bcInst.A.val.value - 1,
                },
                key: { type: "MultRes" },
            },
            src: { type: "MultRes" },
        }
    }
    CALLM(bcInst: BcInst): Assign | Call {
        assert(bcInst.name === "CALLM")
        const call = this.call(bcInst.A, bcInst.C, true)
        return this.callOrAssign(bcInst.A, bcInst.B, call)
    }
    CALL(bcInst: BcInst): Assign | Call {
        assert(bcInst.name === "CALL")
        const call = this.call(bcInst.A, bcInst.C, false)
        return this.callOrAssign(bcInst.A, bcInst.B, call)
    }
    CALLMT(bcInst: BcInst): RetCall {
        assert(bcInst.name === "CALLMT")
        return {
            type: "RetCall",
            call: this.call(bcInst.A, bcInst.D, true),
        }
    }
    CALLT(bcInst: BcInst): RetCall {
        assert(bcInst.name === "CALLT")
        return {
            type: "RetCall",
            call: this.call(bcInst.A, bcInst.D, false),
        }
    }
    ITERC(bcInst: BcInst): ForIn {
        assert(bcInst.name === "ITERC")
        return this.forIn(bcInst)
    }
    ITERN(bcInst: BcInst): ForIn {
        assert(bcInst.name === "ITERN")
        return this.forIn(bcInst)
    }
    VARG(bcInst: BcInst): Assign {
        assert(bcInst.name === "VARG")

        const dstNum = bcInst.B.val.value - 1
        const base = bcInst.A.val.value

        let dst: MultRes | VarList

        if (dstNum <= 0) {
            dst = { type: "MultRes" }
        } else {
            dst = {
                type: "VarList",
                vars: range(base, base + dstNum).map((i) => {
                    return { type: "Var", slot: i }
                }),
            }
        }

        return {
            type: "Assign",
            dst,
            src: { type: "Varg" },
        }
    }
    ISNEXT(bcInst: BcInst): Jump {
        assert(bcInst.name === "ISNEXT")
        // `ISNEXT` is as same as a `JMP` but verifies the iterator. I have no idea if this infomation is useful later.
        return {
            type: "Jump",
            target: this.jumpTarget(bcInst.D),
        }
    }
    RETM(bcInst: BcInst): RetVar {
        assert(bcInst.name === "RETM")
        return this.retVar(bcInst.A, bcInst.D, true)
    }
    RET(bcInst: BcInst): RetVar {
        assert(bcInst.name === "RET")
        return this.retVar(bcInst.A, bcInst.D, false)
    }
    RET0(bcInst: BcInst): RetVar {
        assert(bcInst.name === "RET0")
        return this.retVar(bcInst.A, bcInst.D, false)
    }
    RET1(bcInst: BcInst): RetVar {
        assert(bcInst.name === "RET1")
        return this.retVar(bcInst.A, bcInst.D, false)
    }
    FORI(bcInst: BcInst): ForNumInit {
        assert(bcInst.name === "FORI")
        return {
            type: "ForNumInit",
            checkThenInit: {
                type: "IfThenAssign",
                cond: this.forLoopCheck(bcInst.A),
                assign: {
                    type: "Assign",
                    dst: { type: "Var", slot: bcInst.A.val.value + 3 },
                    src: { type: "Var", slot: bcInst.A.val.value },
                },
                thenBranch: this.pc + 1,
                elseBranch: this.jumpTarget(bcInst.D),
            },
        }
    }
    FORL(bcInst: BcInst): ForNumEnd {
        assert(bcInst.name === "FORL")
        return {
            type: "ForNumEnd",
            reduce: {
                type: "Assign",
                dst: { type: "Var", slot: bcInst.A.val.value },
                src: {
                    type: "Add",
                    left: { type: "Var", slot: bcInst.A.val.value },
                    right: { type: "Var", slot: bcInst.A.val.value + 2 },
                },
            },
            checkThenAssign: {
                type: "IfThenAssign",
                cond: this.forLoopCheck(bcInst.A),
                assign: {
                    type: "Assign",
                    dst: { type: "Var", slot: bcInst.A.val.value + 3 },
                    src: { type: "Var", slot: bcInst.A.val.value },
                },
                thenBranch: this.jumpTarget(bcInst.D),
                elseBranch: this.pc + 1,
            },
        }
    }
    LOOP(bcInst: BcInst): GenericLoop {
        assert(bcInst.name === "LOOP")
        return {
            type: "GenericLoop",
        }
    }
    ITERL(bcInst: BcInst): never {
        assert(bcInst.name === "ITERL")
        // A `ITERL` should follows a `ITERC` and be also handled there.
        throw new Error("Unexpected orphan `ITERL`")
    }

    /* These should never exist in bytecode */
    JFORI(bcInst: BcInst): never {
        assert(bcInst.name === "JFORI")
        throw new Error("Unpexpected JIT-generated instruction `JFORI`")
    }
    IFORL(bcInst: BcInst): never {
        assert(bcInst.name === "IFORL")
        throw new Error("Unpexpected JIT-generated instruction `IFORL`")
    }
    JFORL(bcInst: BcInst): never {
        assert(bcInst.name === "JFORL")
        throw new Error("Unpexpected JIT-generated instruction `JFORL`")
    }
    IITERL(bcInst: BcInst): never {
        assert(bcInst.name === "IITERL")
        throw new Error("Unpexpected JIT-generated instruction `IITERL`")
    }
    JITERL(bcInst: BcInst): never {
        assert(bcInst.name === "JITERL")
        throw new Error("Unpexpected JIT-generated instruction `JITERL`")
    }
    ILOOP(bcInst: BcInst): never {
        assert(bcInst.name === "ILOOP")
        throw new Error("Unpexpected JIT-generated instruction `ILOOP`")
    }
    JLOOP(bcInst: BcInst): never {
        assert(bcInst.name === "JLOOP")
        throw new Error("Unpexpected JIT-generated instruction `JLOOP`")
    }
    JMP(bcInst: BcInst): Jump {
        assert(bcInst.name === "JMP")
        return {
            type: "Jump",
            target: this.jumpTarget(bcInst.D),
        }
    }

    /* These pseudo-headers should be never emitted? */
    FUNCF(): never {
        throw new Error("Unexpected pseudo-headers instruction `FUNCF`")
    }
    IFUNCF(): never {
        throw new Error("Unexpected pseudo-headers instruction `IFUNCF`")
    }
    JFUNCF(): never {
        throw new Error("Unexpected pseudo-headers instruction `JFUNCF`")
    }
    FUNCV(): never {
        throw new Error("Unexpected pseudo-headers instruction `FUNCV`")
    }
    IFUNCV(): never {
        throw new Error("Unexpected pseudo-headers instruction `IFUNCV`")
    }
    JFUNCV(): never {
        throw new Error("Unexpected pseudo-headers instruction `JFUNCV`")
    }
    FUNCC(): never {
        throw new Error("Unexpected pseudo-headers instruction `FUNCC`")
    }
    FUNCCW(): never {
        throw new Error("Unexpected pseudo-headers instruction `FUNCCW`")
    }
}
