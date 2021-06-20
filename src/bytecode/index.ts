import { U8, Uleb128, I64, F64, U14, U15, U64, Uleb128_33 } from "./primitive"
import type { Instruction as Instructions } from "./instructions"

export type Magic = typeof MagicVal
export const MagicVal: [0x1b, 0x4c, 0x4a] = [0x1b, 0x4c, 0x4a]

export class BcFlags {
    static readonly IS_BIG_ENDIAN: BcFlags = new this(new Uleb128(0b00000001))
    static readonly IS_STRIPPED: BcFlags = new this(new Uleb128(0b00000010))
    static readonly HAS_FFI: BcFlags = new this(new Uleb128(0b00000100))

    private _bits: number

    get bits(): number {
        return this._bits
    }

    constructor(bits: Uleb128) {
        const sum = 0b00000111
        if (bits.value > sum) {
            throw new Error(`${bits.value} > ${sum}`)
        }
        this._bits = bits.value
    }

    contains(flags: this): boolean {
        return (this._bits & flags._bits) === flags._bits
    }

    set(flags: this): void {
        this._bits |= flags._bits
    }

    remove(flags: this): void {
        this._bits &= ~flags._bits
    }
}

export class PtFlags {
    static readonly CHILD: PtFlags = new this(new U8(0b00000001))
    static readonly VARIADIC: PtFlags = new this(new U8(0b00000010))
    static readonly FFI: PtFlags = new this(new U8(0b00000100))
    static readonly NO_JIT: PtFlags = new this(new U8(0b00001000))
    static readonly HAS_ILOOP: PtFlags = new this(new U8(0b00010000))

    private _bits: number

    get bits(): number {
        return this._bits
    }

    constructor(bits: U8) {
        const sum = 0b00011111
        if (bits.value > sum) {
            throw new Error(`${bits.value} > ${sum}`)
        }
        this._bits = bits.value
    }

    contains(flags: this): boolean {
        return (this._bits & flags._bits) === flags._bits
    }

    set(flags: this): void {
        this._bits |= flags._bits
    }

    remove(flags: this): void {
        this._bits &= ~flags._bits
    }
}

export interface Bytecode {
    magic: Magic
    version: U8
    flag: BcFlags
    filename: string
    root: Prototype
}

export interface Prototype {
    type: "Prototype"
    flags: PtFlags
    params_num: U8
    frame_size: U8
    instructions: Instruction[]
    upvalues: Upvalue[]
    constant_data: ConstantData[]
    constant_numbers: ConstantNumber[]
    debug_info?: DebugInfo
}

export type Instruction = Instructions

/**
 * ```lua
 * function f()
 *  local uv = 1
 *  function g()
 *    function h()
 *      print(uv) -- uv is a outer upvalue, since `h` is at the lower level with `uv`
 *    end
 *  end
 * end
 * ```
 */
export interface OuterUpvalue {
    type: "OuterUpvalue"
    ref: U15
}

/**
 * ```lua
 * function f()
 *  local uv = 1
 *  function g()
 *    print(uv) -- uv is a local upvalue, since `g` is as the same level as `uv`
 *  end
 * end
 * ```
 */
export interface LocalUpvalue {
    type: "LocalUpvalue"
    mutable: boolean
    slot: U14
}

export type Upvalue = OuterUpvalue | LocalUpvalue

export interface Table {
    type: "Table"
    array: TableItem[]
    hash: [TableItem, TableItem][]
}

export type Nil = {
    type: "Nil"
}
export type False = {
    type: "False"
}
export type True = {
    type: "True"
}

export type TableItem = Nil | False | True | Uleb128 | F64 | string

export interface Complex {
    type: "Complex"
    x: F64
    y: F64
}

export type ConstantData = Prototype | Table | I64 | U64 | Complex | string

export type ConstantNumber = Uleb128_33 | F64

export interface DebugInfo {
    first_line: Uleb128
    line_num: Uleb128
    line_info: LineInfo
    upvalue_names: string[]
    var_info: VarInfo[]
}

/**
 * the type of `map` is `T` if the number of `DebugInfo.line_num` in the range of `T`
 */
export interface LineInfo {
    map: number[]
}

export interface Var {
    type: "VarName"
    name: string
}

export interface VarInfo {
    type: "VarInfo"
    kind:
        | "ForIndex"
        | "ForStop"
        | "ForStep"
        | "ForGeneraor"
        | "ForState"
        | "ForControl"
        | Var
    start: Uleb128
    range: Uleb128
}
