import {
    False,
    Nil,
    True,
    ConstantData,
    ConstantNumber,
    Prototype,
    Upvalue as UpvalueDetail,
} from "../bytecode"

/**
 * The Lua file
 */
export interface File {
    name: string | undefined
    fn: Fn
}

// TODO: Use debuginfo
export interface Fn {
    type: "Fn"
    parent: Fn | undefined
    paramsNum: number
    variadic: boolean
    constants: Constant
    instructions: Instruction[]
}

export interface Constant {
    data: (Exclude<ConstantData, Prototype> | Fn)[]
    upvalues: UpvalueDetail[]
    numbers: ConstantNumber[]
}

export type Instruction = If | Assign | Call | Loop | Ret | Jump | IfThenAssign

/**
 * ```lua
 * if `cond` then
 *   goto `thenBranch`
 * else
 *   goto `next instruction`
 * end
 * ```
 */
export interface If {
    type: "If"
    cond: Cond
    thenBranch: number
}

/** 
 * `ISTC` and `ISFC` both have side-effects, so while transforming it needs to be generated as three instructions
 * (`If`, `Jump`, `Assign`) from two BcInsts(`ISTC`, `JMP`) which makes jump mapping and subsequent operations a
 * little bit inconvenient. So I added this to IR, hoping this will make it easier to handle.
 */
export interface IfThenAssign {
    type: "IfThenAssign"
    cond: Cond
    assign: Assign
    thenBranch: number
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
    f: Src
    args: Src[]
}

export type Ret = RetVar | RetCall

export interface RetVar {
    type: "RetVar"
    values: Src[]
}

export interface RetCall {
    type: "RetCall"
    call: Call
}

/**
 * According to the LuaJIT wiki, the `for ... in ...` loop will always emit `JMP` `body`
 * `ITERC` `ITERL`. So I assume that a `ITER*` will always followed by a `*ITERL`,
 * which constitutes a `ForIn`.
 *
 * The `for i = ...` loop will emit `FORI` `body` `FORL`, which constitutes `ForNumInit`
 * and `ForNumEnd`.
 *
 * The `LOOP` instruction that `while` and `repeat` loop use is represented
 * as `GenericLoop`.
 *
 * All of these loops mentioned above will be detected while CFA.
 */
export type Loop = ForNumInit | ForNumEnd | ForIn | GenericLoop

export interface Jump {
    type: "Jump"
    target: number
}

export type Cond = BoolCoercion | CondCompare | LogicalOp | LogicalNotOp

/**
 * `LogicalOp`s is only used when some condition optimizing passes and will never be generated directly
 * from bytecode since the `NOT` instcruction will be treated as a normal `UnaryOp`.
 */
export interface LogicalOp {
    type: "And" | "Or"
    left: Cond
    right: Cond
}

export interface LogicalNotOp {
    type: "LogicalNot"
    expr: Cond
}

/**
 * In lua's bool context, `nil` and `false` are considered `false`, other values are considered `true`.
 * But when doing comparisions, only the `true`/`false` itself equals to itself. So the code below
 * ```lua
 * if 1 then print(1 == true) end
 * ```
 * will print `false`. It's the reason why this special IR is needed.
 */
export interface BoolCoercion {
    type: "ImplicitTrue" | "ImplicitFalse"
    src: Src
}

export interface CondCompare {
    type: "Lt" | "Ge" | "Le" | "Gt" | "Eq" | "Ne"
    left: Src
    right: Src
}

export type Dst = MultRes | Var | Upvalue | Table | Global | VarList

export type Src =
    | MultRes
    | Varg
    | Var
    | Upvalue
    | Table
    | Global
    | Lit
    | ChildFunc
    | StringConst
    | CDataConst
    | NumConst
    | Pri
    | TableConst
    | Call
    | Cat
    | NewTable
    | Op
    | SrcList

/**
 * Correspond to LuaJIT's internal variable `MULTRES` that set by `*CALL*` or `VARG` and used by `*M`s.
 * This will be eliminated after IR to lua AST transform and never shown up in lua code.
 */
export interface MultRes {
    type: "MultRes"
}

/**
 * Variadic arguments(`...`)
 */
export interface Varg {
    type: "Varg"
}

export interface SrcList {
    type: "SrcList"
    srcs: Src[]
}

export interface VarList {
    type: "VarList"
    vars: Var[]
}

export interface Var {
    type: "Var" | "Arg"
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

export interface ChildFunc {
    type: "ChildFunc"
    idx: number
}

export interface StringConst {
    type: "StringConst"
    idx: number
}

/**
 * Constant data including `I64 | U64 | Complex`
 */
export interface CDataConst {
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
    vars: VarList
}

export interface NewTable {
    type: "NewTable"
    arraySize: number
    hashSize: number
}

export type Op = BinaryOp | UnaryOp

export interface BinaryOp {
    type: "Add" | "Sub" | "Mul" | "Div" | "Mod" | "Pow"
    left: Src
    right: Src
}

export interface UnaryOp {
    type: "Not" | "Unm" | "Len"
    expr: Src
}

export interface ForNumInit {
    type: "ForNumInit"
    /**
     * A+3 = A
     * ```lua
     * if (step > 0 and var <= limit) or (step <= 0 and var >= limit) then
     *  local v = var
     * else
     *  break
     * end
     * ```
     */
    checkThenInit: IfThenAssign
}

export interface ForNumEnd {
    type: "ForNumEnd"
    /**
     * A = A + A+2
     * ```lua
     * var = var + step
     * ```
     */
    reduce: Assign
    /**
     * ```lua
     * if (step > 0 and var <= limit) or (step <= 0 and var >= limit) then
     *  local v = var
     * else
     *  break
     * end
     * ```
     */
    checkThenAssign: IfThenAssign
}

export interface ForIn {
    type: "ForIn"
    /**
     * A, A+1, A+2 = A-3, A-2, A-1
     * ```lua
     * local f, s, var = explist
     * ```
     */
    init: Assign
    /**
     * A, ..., A+B-2 = A(A+1, A+2)
     * ```lua
     * local var_1, ···, var_n = f(s, var)
     * ```
     */
    callIter: Assign
    /**
     * A-1 = A
     * ```lua
     * var = var_1
     * ```
     */
    reduce: Assign
    /**
     * if A != nil goto D
     * ```lua
     * if var == nil then break end
     * ```
     */
    check: If
}

/**
 * According to LuaJIT wiki: "The *LOOP instructions are actually no-ops(except for
 * hotspot detection) and don't branch."
 * 
 * We kept this in IR in order to direct loop detection, although it's a no-op.
 */
export interface GenericLoop {
    type: "GenericLoop"
}
