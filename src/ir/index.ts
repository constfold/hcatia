import { False, Nil, True, ConstantData, ConstantNumber, Prototype } from "../bytecode"

/**
 * The Lua file
 */
export interface File {
    name: string
    fn: Fn
}

// TODO: Use debuginfo
export interface Fn {
    type: "Fn"
    parent: Fn | undefined
    paramsNum: number
    variadic: boolean
    symbols: Symbols
    instructions: Instruction[]
}

export interface Symbols {
    data: (Exclude<ConstantData, Prototype> | Fn)[]
    numbers: ConstantNumber[]
}

export type Instruction = If | Assign | Call | Loop | Ret | Jump

export interface If {
    type: "If"
    cond: Cond
    thenBranch: number
    elseBranch: number
}

export interface Assign {
    type: "Assign"
    dst: Dst
    src: Src
}

/**
 * A normal function call. Call instructions that having extra infomation like `CALL`, `CALLT`
 * will be translated to `Assign` or `RetCall` plus this
 */
export interface Call {
    type: "Call"
    f: Var
    args: Var[]
}

type Ret = RetVar | RetCall

export interface RetVar {
    type: "RetVar"
    vars: Var[]
}

export interface RetCall {
    type: "RetCall"
    call: Call
}

export type Loop = ForNum | ForIn | While | Repeat

export interface Jump {
    type: "Jump"
    target: number
}

export interface Cond {
    type: "Lt" | "Ge" | "Le" | "Gt" | "Eq" | "Ne"
    left: number
    right: number
}

export type Dst = Var | Upvalue | Table | Global | VarList

export type Src =
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

export interface SrcList {
    type: "SrcList"
    srcs: Src[]
}

export interface SrcSelf {
    type: "Src"
    src: Src
}

export interface VarList {
    type: "VarList"
    vars: Var[]
}

export interface Var {
    type: "Var"
    slot: number
}

export interface Upvalue {
    type: "Upvalue"
    idx: number
}

export interface Table {
    type: "Table"
    table: Src
    key: Src
}

export interface Global {
    type: "Global"
    varName: StringConst
}

/**
 * Literal number including both unsigned and signed.
 */
export interface Lit {
    type: "Lit"
    val: number
}

export interface Func {
    type: "Func"
    idx: number
}

export interface StringConst {
    type: "StringConst"
    idx: number
}

/**
 * Constant data including `I64 | U64 | Complex`
 */
export interface ConstData {
    type: "CDataConst"
    idx: number
}

export interface NumConst {
    type: "NumConst"
    idx: number
}

export interface Pri {
    type: "Pri"
    val: True | False | Nil
}

export interface TableConst {
    type: "TableConst"
    idx: number
}

export interface Cat {
    type: "Cat"
    slotStart: number
    slotEnd: number
}

export interface NewTable {
    type: "NewTable"
    arraySize: number
    hashSize: number
}

export type Op = BinaryOp | UnaryOp

export interface BinaryOp {
    type: "Add" | "Sub" | "Mul" | "Div" | "Mod" | "Pow"
    left: Var
    right: Src
}

export interface UnaryOp {
    type: "Not" | "Unm" | "Len"
    expr: Src
}

export interface ForNum {
    type: "ForNum"
    start: Src
    stop: Src
    step: Src
    idx: Src
    branch: number
}

export interface ForIn {
    type: "ForIter"
    func: Src
    state: Src
    ctl: Src
    branch: number
}

export interface While {
    type: "While"
    cond: Cond
    branch: number
}

export interface Repeat {
    type: "Repeat"
    cond: Cond
    branch: number
}
