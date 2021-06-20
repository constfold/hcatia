import { False, Nil, True, ConstantData, ConstantNumber, Prototype } from "../bytecode"

/**
 * The Lua file
 */
export interface File {
    name: string
    fn: Fn
}

// TODO: Use debuginfo
interface Fn {
    parant: Fn | null
    paramsNum: number
    variadic: boolean
    symbols: Symbols
    instructions: Instruction[]
}

export interface Symbols {
    data: (Exclude<ConstantData, Prototype> | Fn)[]
    numbers: ConstantNumber[]
}

type Instruction = If | Assign | Call | Loop | Ret | Jump

interface If {
    type: "If"
    cond: Cond
    thenBranch: number
    elseBranch: number
}

interface Assign {
    type: "Assign"
    dst: Dst
    src: Src
}

/**
 * A normal function call. Call instructions that having extra infomation like `CALL`, `CALLT`
 * will be translated to `Assign` or `RetCall` plus this
 */
interface Call {
    type: "Call"
    f: Var
    args: Var[]
}

type Ret = RetVar | RetCall

interface RetVar {
    type: "RetVar"
    vars: Var[]
}

interface RetCall {
    type: "RetCall"
    call: Call
}

type Loop = ForNum | ForIn | While | Repeat

interface Jump {
    type: "Jump"
    target: number
}

interface Cond {
    type: "Lt" | "Ge" | "Le" | "Gt" | "Eq" | "Ne"
    left: number
    right: number
}

type Dst = Var | Upvalue | Table | Global | VarList

type Src =
    | Var
    | Upvalue
    | Table
    | Global
    | Lit
    | Func
    | StringConst
    | ConstData
    | NumConst
    | Pri
    | TableConst
    | Call
    | Cat
    | NewTable
    | Op
    | SrcSelf
    | SrcList

interface SrcList {
    type: "SrcList"
    srcs: Src[]
}

interface SrcSelf {
    type: "Src"
    src: Src
}

interface VarList {
    type: "VarList"
    vars: Var[]
}

interface Var {
    type: "Var"
    slot: number
}

interface Upvalue {
    type: "Upvalue"
    idx: number
}

interface Table {
    type: "Table"
    table: Src
    key: Src
}

interface Global {
    type: "Global"
    varName: StringConst
}

/**
 * Literal number including both unsigned and signed.
 */
interface Lit {
    type: "Lit"
    val: number
}

interface Func {
    type: "Func"
    idx: number
}

interface StringConst {
    type: "StringConst"
    idx: number
}

/**
 * Constant data including `I64 | U64 | Complex`
 */
interface ConstData {
    type: "CDataConst"
    idx: number
}

interface NumConst {
    type: "NumConst"
    idx: number
}

interface Pri {
    type: "Pri"
    val: True | False | Nil
}

interface TableConst {
    type: "TableConst"
    idx: number
}

interface Cat {
    type: "Cat"
    slotStart: number
    slotEnd: number
}

interface NewTable {
    type: "NewTable"
    arraySize: number
    hashSize: number
}

type Op = BinaryOp | UnaryOp

interface BinaryOp {
    type: "Add" | "Sub" | "Mul" | "Div" | "Mod" | "Pow"
    left: Var
    right: Src
}

interface UnaryOp {
    type: "Not" | "Unm" | "Len"
    expr: Src
}

interface ForNum {
    type: "ForNum"
    start: Src
    stop: Src
    step: Src
    idx: Src
    branch: number
}

interface ForIn {
    type: "ForIter"
    func: Src
    state: Src
    ctl: Src
    branch: number
}

interface While {
    type: "While"
    cond: Cond
    branch: number
}

interface Repeat {
    type: "Repeat"
    cond: Cond
    branch: number
}
