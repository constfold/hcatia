import { U16, U8 } from "./primitive"

export type Operand<T extends OperandType, V> = {
    type: T
    val: V
}

export type OperandType =
    | "dst"
    | "var"
    | "str"
    | "num"
    | "pri"
    | "uv"
    | "lit"
    | "lits"
    | "cdata"
    | "jump"
    | "func"
    | "tab"
    | "base"
    | "rbase"
    | "none"

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

export type ISLT = BuildOpAD<"ISLT", "var", "var">
export type ISGE = BuildOpAD<"ISGE", "var", "var">
export type ISLE = BuildOpAD<"ISLE", "var", "var">
export type ISGT = BuildOpAD<"ISGT", "var", "var">
export type ISEQV = BuildOpAD<"ISEQV", "var", "var">
export type ISNEV = BuildOpAD<"ISNEV", "var", "var">
export type ISEQS = BuildOpAD<"ISEQS", "var", "str">
export type ISNES = BuildOpAD<"ISNES", "var", "str">
export type ISEQN = BuildOpAD<"ISEQN", "var", "num">
export type ISNEN = BuildOpAD<"ISNEN", "var", "num">
export type ISEQP = BuildOpAD<"ISEQP", "var", "pri">
export type ISNEP = BuildOpAD<"ISNEP", "var", "pri">
export type ISTC = BuildOpAD<"ISTC", "dst", "var">
export type ISFC = BuildOpAD<"ISFC", "dst", "var">
export type IST = BuildOpAD<"IST", "none", "var">
export type ISF = BuildOpAD<"ISF", "none", "var">
export type MOV = BuildOpAD<"MOV", "dst", "var">
export type NOT = BuildOpAD<"NOT", "dst", "var">
export type UNM = BuildOpAD<"UNM", "dst", "var">
export type LEN = BuildOpAD<"LEN", "dst", "var">
export type ADDVN = BuildOpABC<"ADDVN", "dst", "var", "num">
export type SUBVN = BuildOpABC<"SUBVN", "dst", "var", "num">
export type MULVN = BuildOpABC<"MULVN", "dst", "var", "num">
export type DIVVN = BuildOpABC<"DIVVN", "dst", "var", "num">
export type MODVN = BuildOpABC<"MODVN", "dst", "var", "num">
export type ADDNV = BuildOpABC<"ADDNV", "dst", "var", "num">
export type SUBNV = BuildOpABC<"SUBNV", "dst", "var", "num">
export type MULNV = BuildOpABC<"MULNV", "dst", "var", "num">
export type DIVNV = BuildOpABC<"DIVNV", "dst", "var", "num">
export type MODNV = BuildOpABC<"MODNV", "dst", "var", "num">
export type ADDVV = BuildOpABC<"ADDVV", "dst", "var", "var">
export type SUBVV = BuildOpABC<"SUBVV", "dst", "var", "var">
export type MULVV = BuildOpABC<"MULVV", "dst", "var", "var">
export type DIVVV = BuildOpABC<"DIVVV", "dst", "var", "var">
export type MODVV = BuildOpABC<"MODVV", "dst", "var", "var">
export type POW = BuildOpABC<"POW", "dst", "var", "var">
export type CAT = BuildOpABC<"CAT", "dst", "rbase", "rbase">
export type KSTR = BuildOpAD<"KSTR", "dst", "str">
export type KCDATA = BuildOpAD<"KCDATA", "dst", "cdata">
export type KSHORT = BuildOpAD<"KSHORT", "dst", "lits">
export type KNUM = BuildOpAD<"KNUM", "dst", "num">
export type KPRI = BuildOpAD<"KPRI", "dst", "pri">
export type KNIL = BuildOpAD<"KNIL", "base", "base">
export type UGET = BuildOpAD<"UGET", "dst", "uv">
export type USETV = BuildOpAD<"USETV", "uv", "var">
export type USETS = BuildOpAD<"USETS", "uv", "str">
export type USETN = BuildOpAD<"USETN", "uv", "num">
export type USETP = BuildOpAD<"USETP", "uv", "pri">
export type UCLO = BuildOpAD<"UCLO", "rbase", "jump">
export type FNEW = BuildOpAD<"FNEW", "dst", "func">
export type TNEW = BuildOpAD<"TNEW", "dst", "lit">
export type TDUP = BuildOpAD<"TDUP", "dst", "tab">
export type GGET = BuildOpAD<"GGET", "dst", "str">
export type GSET = BuildOpAD<"GSET", "var", "str">
export type TGETV = BuildOpABC<"TGETV", "dst", "var", "var">
export type TGETS = BuildOpABC<"TGETS", "dst", "var", "str">
export type TGETB = BuildOpABC<"TGETB", "dst", "var", "lit">
export type TSETV = BuildOpABC<"TSETV", "var", "var", "var">
export type TSETS = BuildOpABC<"TSETS", "var", "var", "str">
export type TSETB = BuildOpABC<"TSETB", "var", "var", "lit">
export type TSETM = BuildOpAD<"TSETM", "base", "num">
export type CALLM = BuildOpABC<"CALLM", "base", "lit", "lit">
export type CALL = BuildOpABC<"CALL", "base", "lit", "lit">
export type CALLMT = BuildOpAD<"CALLMT", "base", "lit">
export type CALLT = BuildOpAD<"CALLT", "base", "lit">
export type ITERC = BuildOpABC<"ITERC", "base", "lit", "lit">
export type ITERN = BuildOpABC<"ITERN", "base", "lit", "lit">
export type VARG = BuildOpABC<"VARG", "base", "lit", "lit">
export type ISNEXT = BuildOpAD<"ISNEXT", "base", "jump">
export type RETM = BuildOpAD<"RETM", "base", "lit">
export type RET = BuildOpAD<"RET", "rbase", "lit">
export type RET0 = BuildOpAD<"RET0", "rbase", "lit">
export type RET1 = BuildOpAD<"RET1", "rbase", "lit">
export type FORI = BuildOpAD<"FORI", "base", "jump">
export type JFORI = BuildOpAD<"JFORI", "base", "jump">
export type FORL = BuildOpAD<"FORL", "base", "jump">
export type IFORL = BuildOpAD<"IFORL", "base", "jump">
export type JFORL = BuildOpAD<"JFORL", "base", "lit">
export type ITERL = BuildOpAD<"ITERL", "base", "jump">
export type IITERL = BuildOpAD<"IITERL", "base", "jump">
export type JITERL = BuildOpAD<"JITERL", "base", "lit">
export type LOOP = BuildOpAD<"LOOP", "rbase", "jump">
export type ILOOP = BuildOpAD<"ILOOP", "rbase", "jump">
export type JLOOP = BuildOpAD<"JLOOP", "rbase", "lit">
export type JMP = BuildOpAD<"JMP", "rbase", "jump">
export type FUNCF = BuildOpAD<"FUNCF", "rbase", "none">
export type IFUNCF = BuildOpAD<"IFUNCF", "rbase", "none">
export type JFUNCF = BuildOpAD<"JFUNCF", "rbase", "lit">
export type FUNCV = BuildOpAD<"FUNCV", "rbase", "none">
export type IFUNCV = BuildOpAD<"IFUNCV", "rbase", "none">
export type JFUNCV = BuildOpAD<"JFUNCV", "rbase", "lit">
export type FUNCC = BuildOpAD<"FUNCC", "rbase", "none">
export type FUNCCW = BuildOpAD<"FUNCCW", "rbase", "none">
export type Instruction =
    | ISLT
    | ISGE
    | ISLE
    | ISGT
    | ISEQV
    | ISNEV
    | ISEQS
    | ISNES
    | ISEQN
    | ISNEN
    | ISEQP
    | ISNEP
    | ISTC
    | ISFC
    | IST
    | ISF
    | MOV
    | NOT
    | UNM
    | LEN
    | ADDVN
    | SUBVN
    | MULVN
    | DIVVN
    | MODVN
    | ADDNV
    | SUBNV
    | MULNV
    | DIVNV
    | MODNV
    | ADDVV
    | SUBVV
    | MULVV
    | DIVVV
    | MODVV
    | POW
    | CAT
    | KSTR
    | KCDATA
    | KSHORT
    | KNUM
    | KPRI
    | KNIL
    | UGET
    | USETV
    | USETS
    | USETN
    | USETP
    | UCLO
    | FNEW
    | TNEW
    | TDUP
    | GGET
    | GSET
    | TGETV
    | TGETS
    | TGETB
    | TSETV
    | TSETS
    | TSETB
    | TSETM
    | CALLM
    | CALL
    | CALLMT
    | CALLT
    | ITERC
    | ITERN
    | VARG
    | ISNEXT
    | RETM
    | RET
    | RET0
    | RET1
    | FORI
    | JFORI
    | FORL
    | IFORL
    | JFORL
    | ITERL
    | IITERL
    | JITERL
    | LOOP
    | ILOOP
    | JLOOP
    | JMP
    | FUNCF
    | IFUNCF
    | JFUNCF
    | FUNCV
    | IFUNCV
    | JFUNCV
    | FUNCC
    | FUNCCW
export function buildInstruction([op, A, B, C]: [U8, U8, U8, U8]): Instruction {
    if (op.value === 0x0) {
        return {
            name: "ISLT",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x1) {
        return {
            name: "ISGE",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2) {
        return {
            name: "ISLE",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x3) {
        return {
            name: "ISGT",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4) {
        return {
            name: "ISEQV",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x5) {
        return {
            name: "ISNEV",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x6) {
        return {
            name: "ISEQS",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x7) {
        return {
            name: "ISNES",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x8) {
        return {
            name: "ISEQN",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "num",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x9) {
        return {
            name: "ISNEN",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "num",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xa) {
        return {
            name: "ISEQP",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "pri",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xb) {
        return {
            name: "ISNEP",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "pri",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xc) {
        return {
            name: "ISTC",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xd) {
        return {
            name: "ISFC",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xe) {
        return {
            name: "IST",
            A: {
                type: "none",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0xf) {
        return {
            name: "ISF",
            A: {
                type: "none",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x10) {
        return {
            name: "MOV",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x11) {
        return {
            name: "NOT",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x12) {
        return {
            name: "UNM",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x13) {
        return {
            name: "LEN",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x14) {
        return {
            name: "ADDVN",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x15) {
        return {
            name: "SUBVN",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x16) {
        return {
            name: "MULVN",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x17) {
        return {
            name: "DIVVN",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x18) {
        return {
            name: "MODVN",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x19) {
        return {
            name: "ADDNV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x1a) {
        return {
            name: "SUBNV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x1b) {
        return {
            name: "MULNV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x1c) {
        return {
            name: "DIVNV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x1d) {
        return {
            name: "MODNV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "num",
                val: C,
            },
        }
    } else if (op.value === 0x1e) {
        return {
            name: "ADDVV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x1f) {
        return {
            name: "SUBVV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x20) {
        return {
            name: "MULVV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x21) {
        return {
            name: "DIVVV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x22) {
        return {
            name: "MODVV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x23) {
        return {
            name: "POW",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x24) {
        return {
            name: "CAT",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "rbase",
                val: B,
            },
            C: {
                type: "rbase",
                val: C,
            },
        }
    } else if (op.value === 0x25) {
        return {
            name: "KSTR",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x26) {
        return {
            name: "KCDATA",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "cdata",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x27) {
        return {
            name: "KSHORT",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "lits",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x28) {
        return {
            name: "KNUM",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "num",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x29) {
        return {
            name: "KPRI",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "pri",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2a) {
        return {
            name: "KNIL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "base",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2b) {
        return {
            name: "UGET",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "uv",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2c) {
        return {
            name: "USETV",
            A: {
                type: "uv",
                val: A,
            },
            type: "AD",
            D: {
                type: "var",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2d) {
        return {
            name: "USETS",
            A: {
                type: "uv",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2e) {
        return {
            name: "USETN",
            A: {
                type: "uv",
                val: A,
            },
            type: "AD",
            D: {
                type: "num",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x2f) {
        return {
            name: "USETP",
            A: {
                type: "uv",
                val: A,
            },
            type: "AD",
            D: {
                type: "pri",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x30) {
        return {
            name: "UCLO",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x31) {
        return {
            name: "FNEW",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "func",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x32) {
        return {
            name: "TNEW",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x33) {
        return {
            name: "TDUP",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "tab",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x34) {
        return {
            name: "GGET",
            A: {
                type: "dst",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x35) {
        return {
            name: "GSET",
            A: {
                type: "var",
                val: A,
            },
            type: "AD",
            D: {
                type: "str",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x36) {
        return {
            name: "TGETV",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x37) {
        return {
            name: "TGETS",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "str",
                val: C,
            },
        }
    } else if (op.value === 0x38) {
        return {
            name: "TGETB",
            A: {
                type: "dst",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x39) {
        return {
            name: "TSETV",
            A: {
                type: "var",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "var",
                val: C,
            },
        }
    } else if (op.value === 0x3a) {
        return {
            name: "TSETS",
            A: {
                type: "var",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "str",
                val: C,
            },
        }
    } else if (op.value === 0x3b) {
        return {
            name: "TSETB",
            A: {
                type: "var",
                val: A,
            },
            type: "ABC",
            B: {
                type: "var",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x3c) {
        return {
            name: "TSETM",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "num",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x3d) {
        return {
            name: "CALLM",
            A: {
                type: "base",
                val: A,
            },
            type: "ABC",
            B: {
                type: "lit",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x3e) {
        return {
            name: "CALL",
            A: {
                type: "base",
                val: A,
            },
            type: "ABC",
            B: {
                type: "lit",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x3f) {
        return {
            name: "CALLMT",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x40) {
        return {
            name: "CALLT",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x41) {
        return {
            name: "ITERC",
            A: {
                type: "base",
                val: A,
            },
            type: "ABC",
            B: {
                type: "lit",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x42) {
        return {
            name: "ITERN",
            A: {
                type: "base",
                val: A,
            },
            type: "ABC",
            B: {
                type: "lit",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x43) {
        return {
            name: "VARG",
            A: {
                type: "base",
                val: A,
            },
            type: "ABC",
            B: {
                type: "lit",
                val: B,
            },
            C: {
                type: "lit",
                val: C,
            },
        }
    } else if (op.value === 0x44) {
        return {
            name: "ISNEXT",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x45) {
        return {
            name: "RETM",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x46) {
        return {
            name: "RET",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x47) {
        return {
            name: "RET0",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x48) {
        return {
            name: "RET1",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x49) {
        return {
            name: "FORI",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4a) {
        return {
            name: "JFORI",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4b) {
        return {
            name: "FORL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4c) {
        return {
            name: "IFORL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4d) {
        return {
            name: "JFORL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4e) {
        return {
            name: "ITERL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x4f) {
        return {
            name: "IITERL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x50) {
        return {
            name: "JITERL",
            A: {
                type: "base",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x51) {
        return {
            name: "LOOP",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x52) {
        return {
            name: "ILOOP",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x53) {
        return {
            name: "JLOOP",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x54) {
        return {
            name: "JMP",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "jump",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x55) {
        return {
            name: "FUNCF",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x56) {
        return {
            name: "IFUNCF",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x57) {
        return {
            name: "JFUNCF",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x58) {
        return {
            name: "FUNCV",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x59) {
        return {
            name: "IFUNCV",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x5a) {
        return {
            name: "JFUNCV",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "lit",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x5b) {
        return {
            name: "FUNCC",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else if (op.value === 0x5c) {
        return {
            name: "FUNCCW",
            A: {
                type: "rbase",
                val: A,
            },
            type: "AD",
            D: {
                type: "none",
                val: new U16([B, C]),
            },
        }
    } else {
        throw new Error(`unknown op ${op.value}`)
    }
}
