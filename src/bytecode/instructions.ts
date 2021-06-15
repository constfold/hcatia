import { U16, U8 } from "./primitive"
export type ISLT = Pick<
    {
        name: "ISLT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISGE = Pick<
    {
        name: "ISGE"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISLE = Pick<
    {
        name: "ISLE"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISGT = Pick<
    {
        name: "ISGT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISEQV = Pick<
    {
        name: "ISEQV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISNEV = Pick<
    {
        name: "ISNEV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISEQS = Pick<
    {
        name: "ISEQS"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISNES = Pick<
    {
        name: "ISNES"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISEQN = Pick<
    {
        name: "ISEQN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISNEN = Pick<
    {
        name: "ISNEN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISEQP = Pick<
    {
        name: "ISEQP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISNEP = Pick<
    {
        name: "ISNEP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISTC = Pick<
    {
        name: "ISTC"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISFC = Pick<
    {
        name: "ISFC"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type IST = Pick<
    {
        name: "IST"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ISF = Pick<
    {
        name: "ISF"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type MOV = Pick<
    {
        name: "MOV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type NOT = Pick<
    {
        name: "NOT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type UNM = Pick<
    {
        name: "UNM"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type LEN = Pick<
    {
        name: "LEN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ADDVN = Pick<
    {
        name: "ADDVN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type SUBVN = Pick<
    {
        name: "SUBVN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MULVN = Pick<
    {
        name: "MULVN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type DIVVN = Pick<
    {
        name: "DIVVN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MODVN = Pick<
    {
        name: "MODVN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type ADDNV = Pick<
    {
        name: "ADDNV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type SUBNV = Pick<
    {
        name: "SUBNV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MULNV = Pick<
    {
        name: "MULNV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type DIVNV = Pick<
    {
        name: "DIVNV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MODNV = Pick<
    {
        name: "MODNV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type ADDVV = Pick<
    {
        name: "ADDVV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type SUBVV = Pick<
    {
        name: "SUBVV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MULVV = Pick<
    {
        name: "MULVV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type DIVVV = Pick<
    {
        name: "DIVVV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type MODVV = Pick<
    {
        name: "MODVV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type POW = Pick<
    {
        name: "POW"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type CAT = Pick<
    {
        name: "CAT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type KSTR = Pick<
    {
        name: "KSTR"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type KCDATA = Pick<
    {
        name: "KCDATA"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type KSHORT = Pick<
    {
        name: "KSHORT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type KNUM = Pick<
    {
        name: "KNUM"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type KPRI = Pick<
    {
        name: "KPRI"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type KNIL = Pick<
    {
        name: "KNIL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type UGET = Pick<
    {
        name: "UGET"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type USETV = Pick<
    {
        name: "USETV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type USETS = Pick<
    {
        name: "USETS"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type USETN = Pick<
    {
        name: "USETN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type USETP = Pick<
    {
        name: "USETP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type UCLO = Pick<
    {
        name: "UCLO"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FNEW = Pick<
    {
        name: "FNEW"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type TNEW = Pick<
    {
        name: "TNEW"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type TDUP = Pick<
    {
        name: "TDUP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type GGET = Pick<
    {
        name: "GGET"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type GSET = Pick<
    {
        name: "GSET"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type TGETV = Pick<
    {
        name: "TGETV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TGETS = Pick<
    {
        name: "TGETS"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TGETB = Pick<
    {
        name: "TGETB"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TSETV = Pick<
    {
        name: "TSETV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TSETS = Pick<
    {
        name: "TSETS"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TSETB = Pick<
    {
        name: "TSETB"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type TSETM = Pick<
    {
        name: "TSETM"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type CALLM = Pick<
    {
        name: "CALLM"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type CALL = Pick<
    {
        name: "CALL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type CALLMT = Pick<
    {
        name: "CALLMT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type CALLT = Pick<
    {
        name: "CALLT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ITERC = Pick<
    {
        name: "ITERC"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type ITERN = Pick<
    {
        name: "ITERN"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type VARG = Pick<
    {
        name: "VARG"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "B" | "C"
>
export type ISNEXT = Pick<
    {
        name: "ISNEXT"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type RETM = Pick<
    {
        name: "RETM"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type RET = Pick<
    {
        name: "RET"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type RET0 = Pick<
    {
        name: "RET0"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type RET1 = Pick<
    {
        name: "RET1"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FORI = Pick<
    {
        name: "FORI"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JFORI = Pick<
    {
        name: "JFORI"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FORL = Pick<
    {
        name: "FORL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type IFORL = Pick<
    {
        name: "IFORL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JFORL = Pick<
    {
        name: "JFORL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ITERL = Pick<
    {
        name: "ITERL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type IITERL = Pick<
    {
        name: "IITERL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JITERL = Pick<
    {
        name: "JITERL"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type LOOP = Pick<
    {
        name: "LOOP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type ILOOP = Pick<
    {
        name: "ILOOP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JLOOP = Pick<
    {
        name: "JLOOP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JMP = Pick<
    {
        name: "JMP"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FUNCF = Pick<
    {
        name: "FUNCF"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type IFUNCF = Pick<
    {
        name: "IFUNCF"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JFUNCF = Pick<
    {
        name: "JFUNCF"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FUNCV = Pick<
    {
        name: "FUNCV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type IFUNCV = Pick<
    {
        name: "IFUNCV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type JFUNCV = Pick<
    {
        name: "JFUNCV"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FUNCC = Pick<
    {
        name: "FUNCC"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>
export type FUNCCW = Pick<
    {
        name: "FUNCCW"
        A: U8
        B: U8
        C: U8
        D: U16
    },
    "name" | "A" | "D"
>

export type Instruction =
    | never
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
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x1) {
        return {
            name: "ISGE",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2) {
        return {
            name: "ISLE",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x3) {
        return {
            name: "ISGT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4) {
        return {
            name: "ISEQV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x5) {
        return {
            name: "ISNEV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x6) {
        return {
            name: "ISEQS",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x7) {
        return {
            name: "ISNES",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x8) {
        return {
            name: "ISEQN",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x9) {
        return {
            name: "ISNEN",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xa) {
        return {
            name: "ISEQP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xb) {
        return {
            name: "ISNEP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xc) {
        return {
            name: "ISTC",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xd) {
        return {
            name: "ISFC",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xe) {
        return {
            name: "IST",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0xf) {
        return {
            name: "ISF",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x10) {
        return {
            name: "MOV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x11) {
        return {
            name: "NOT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x12) {
        return {
            name: "UNM",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x13) {
        return {
            name: "LEN",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x14) {
        return {
            name: "ADDVN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x15) {
        return {
            name: "SUBVN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x16) {
        return {
            name: "MULVN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x17) {
        return {
            name: "DIVVN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x18) {
        return {
            name: "MODVN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x19) {
        return {
            name: "ADDNV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1a) {
        return {
            name: "SUBNV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1b) {
        return {
            name: "MULNV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1c) {
        return {
            name: "DIVNV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1d) {
        return {
            name: "MODNV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1e) {
        return {
            name: "ADDVV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x1f) {
        return {
            name: "SUBVV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x20) {
        return {
            name: "MULVV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x21) {
        return {
            name: "DIVVV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x22) {
        return {
            name: "MODVV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x23) {
        return {
            name: "POW",
            A,
            B,
            C,
        }
    } else if (op.value === 0x24) {
        return {
            name: "CAT",
            A,
            B,
            C,
        }
    } else if (op.value === 0x25) {
        return {
            name: "KSTR",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x26) {
        return {
            name: "KCDATA",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x27) {
        return {
            name: "KSHORT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x28) {
        return {
            name: "KNUM",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x29) {
        return {
            name: "KPRI",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2a) {
        return {
            name: "KNIL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2b) {
        return {
            name: "UGET",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2c) {
        return {
            name: "USETV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2d) {
        return {
            name: "USETS",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2e) {
        return {
            name: "USETN",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x2f) {
        return {
            name: "USETP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x30) {
        return {
            name: "UCLO",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x31) {
        return {
            name: "FNEW",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x32) {
        return {
            name: "TNEW",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x33) {
        return {
            name: "TDUP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x34) {
        return {
            name: "GGET",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x35) {
        return {
            name: "GSET",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x36) {
        return {
            name: "TGETV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x37) {
        return {
            name: "TGETS",
            A,
            B,
            C,
        }
    } else if (op.value === 0x38) {
        return {
            name: "TGETB",
            A,
            B,
            C,
        }
    } else if (op.value === 0x39) {
        return {
            name: "TSETV",
            A,
            B,
            C,
        }
    } else if (op.value === 0x3a) {
        return {
            name: "TSETS",
            A,
            B,
            C,
        }
    } else if (op.value === 0x3b) {
        return {
            name: "TSETB",
            A,
            B,
            C,
        }
    } else if (op.value === 0x3c) {
        return {
            name: "TSETM",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x3d) {
        return {
            name: "CALLM",
            A,
            B,
            C,
        }
    } else if (op.value === 0x3e) {
        return {
            name: "CALL",
            A,
            B,
            C,
        }
    } else if (op.value === 0x3f) {
        return {
            name: "CALLMT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x40) {
        return {
            name: "CALLT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x41) {
        return {
            name: "ITERC",
            A,
            B,
            C,
        }
    } else if (op.value === 0x42) {
        return {
            name: "ITERN",
            A,
            B,
            C,
        }
    } else if (op.value === 0x43) {
        return {
            name: "VARG",
            A,
            B,
            C,
        }
    } else if (op.value === 0x44) {
        return {
            name: "ISNEXT",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x45) {
        return {
            name: "RETM",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x46) {
        return {
            name: "RET",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x47) {
        return {
            name: "RET0",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x48) {
        return {
            name: "RET1",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x49) {
        return {
            name: "FORI",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4a) {
        return {
            name: "JFORI",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4b) {
        return {
            name: "FORL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4c) {
        return {
            name: "IFORL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4d) {
        return {
            name: "JFORL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4e) {
        return {
            name: "ITERL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x4f) {
        return {
            name: "IITERL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x50) {
        return {
            name: "JITERL",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x51) {
        return {
            name: "LOOP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x52) {
        return {
            name: "ILOOP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x53) {
        return {
            name: "JLOOP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x54) {
        return {
            name: "JMP",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x55) {
        return {
            name: "FUNCF",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x56) {
        return {
            name: "IFUNCF",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x57) {
        return {
            name: "JFUNCF",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x58) {
        return {
            name: "FUNCV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x59) {
        return {
            name: "IFUNCV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x5a) {
        return {
            name: "JFUNCV",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x5b) {
        return {
            name: "FUNCC",
            A,
            D: new U16([B, C]),
        }
    } else if (op.value === 0x5c) {
        return {
            name: "FUNCCW",
            A,
            D: new U16([B, C]),
        }
    } else {
        throw new Error(`unknown op ${op.value}`)
    }
}
