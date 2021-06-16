import {
    Magic,
    MagicVal,
    Bytecode,
    BcFlags,
    Prototype,
    PtFlags,
    Instruction,
    Upvalue,
    ConstantData,
    ConstantNumber,
    DebugInfo,
    LineInfo,
    VarInfo,
    Var,
    Table,
    TableItem,
} from "."
import { ByteStream } from "./bytestream"
import { tuple, cond, call, count, map, peek } from "./combinator"
import {
    U8,
    Uleb128,
    U32,
    U16,
    U14,
    U15,
    Uleb128_33,
    F64,
    I64,
    U64,
} from "./primitive"
import * as iconv from "iconv-lite"
import { buildInstruction } from "./instructions"

function u8(input: ByteStream): U8 {
    return input.take_one()
}

function uleb128(input: ByteStream): Uleb128 {
    let val = u8(input).value
    if (val > 0x7f) {
        let shift = 0
        val &= 0x7f

        let b
        do {
            b = u8(input).value
            shift += 7
            val |= (b & 0x7f) << shift
        } while (b < 0x7f)
    }

    return new Uleb128(val)
}

function uleb128_33(input: ByteStream): Uleb128_33 {
    let val = u8(input).value >> 1

    if (val > 0x3f) {
        let shift = -1
        val &= 0x7f

        let b
        do {
            b = u8(input).value
            shift += 7
            val |= (b & 0x7f) << shift
        } while (b < 0x7f)
    }

    return new Uleb128_33(val)
}

function u16(input: ByteStream): U16 {
    return new U16(tuple(u8, u8)(input))
}

function u32(input: ByteStream): U32 {
    return new U32(tuple(u8, u8, u8, u8)(input))
}

function f64(input: ByteStream): F64 {
    const [lo, hi] = tuple(uleb128, uleb128)(input)

    return two_part_f64(lo.value, hi.value)
}

function two_part_f64(lo: number, hi: number): F64 {
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setBigUint64(0, BigInt(lo << 32) + BigInt(hi), true)

    return new F64(view.getFloat64(0, true))
}

function u64(input: ByteStream): U64 {
    const v = f64(input)

    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setFloat64(v.value, 0, true)

    return new U64(view.getBigUint64(0, true))
}

function i64(input: ByteStream): I64 {
    const v = f64(input)

    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setFloat64(v.value, 0, true)

    return new I64(view.getBigInt64(0, true))
}

function len_start_string(input: ByteStream, encoding: string): string {
    const len = uleb128(input).value
    return len_string(input, len, encoding)
}

function len_string(input: ByteStream, len: number, encoding: string): string {
    return iconv.decode(Buffer.from(input.take(len)), encoding)
}

function null_end_string(input: ByteStream, encoding: string): string {
    const v = []
    for (;;) {
        const b = u8(input).value
        if (b === 0) {
            return iconv.decode(Buffer.from(v), encoding)
        }

        v.push(b)
    }
}

function signature(input: ByteStream): Magic {
    const magic = input.take(3)
    if (magic[0] == 0x1b && magic[1] == 0x4c && magic[2] === 0x4a) {
        return MagicVal
    } else {
        throw new Error("mismatched magic number")
    }
}

export function bytecode(input: ByteStream, encoding = "utf8"): Bytecode {
    const [magic, version, flag] = tuple(
        signature,
        u8,
        map(uleb128, (n) => new BcFlags(n))
    )(input)

    const striped = flag.contains(BcFlags.IS_STRIPPED)

    const [filename_, root] = tuple(
        cond(striped, call(len_start_string, encoding)),
        call(prototype_root, striped, encoding)
    )(input)

    return {
        magic,
        version,
        flag,
        filename: filename_,
        root,
    }
}

function prototype_root(
    input: ByteStream,
    striped: boolean,
    encoding: string
): Prototype {
    const stack = []

    for (;;) {
        const pt = prototype(input, striped, stack, encoding)
        if (pt === undefined) {
            // There must be only one prototype in stack when encountered eof. Otherwise something is wrong
            if (stack.length !== 1) {
                throw new Error("")
            }
            return stack[0]
        }

        stack.push(pt)
    }
}

function prototype(
    input: ByteStream,
    striped: boolean,
    stack: Prototype[],
    encoding: string
): Prototype | undefined {
    const len = uleb128(input).value

    // An empty prototype(0 length) must be at the end of input
    if (len === 0) {
        if (!input.end) {
            throw new Error("")
        }
        return
    }

    const [
        flags,
        params_num,
        frame_size,
        upvalues_num,
        kgc_num,
        kn_num,
        inst_num,
    ] = tuple(
        map(u8, (v) => new PtFlags(v)),
        u8,
        u8,
        u8,
        uleb128,
        uleb128,
        uleb128
    )(input)

    // debug info
    const dbg = cond(!striped, tuple(uleb128, uleb128, uleb128))(input)

    const [instructions, upvalues, constant_data, constant_numbers] = tuple(
        count(inst_num, instruction),
        count(upvalues_num, upvalue),
        count(kgc_num, call(constantData, stack, encoding)),
        count(kn_num, constantNumber)
    )(input)

    let debug_info
    if (!striped) {
        if (dbg === undefined) {
            throw new Error("unreachable")
        }
        const [sz, first_line, line_num] = dbg
        debug_info = call(
            debugInfo,
            sz,
            first_line,
            line_num,
            upvalues_num,
            inst_num,
            encoding
        )(input)
    }

    return {
        type: "Prototype",
        flags,
        params_num,
        frame_size,
        instructions,
        upvalues,
        constant_data,
        constant_numbers,
        debug_info,
    }
}

function instruction(input: ByteStream): Instruction {
    // TODO: Support BE
    return buildInstruction(tuple(u8, u8, u8, u8)(input))
}

function upvalue(input: ByteStream): Upvalue {
    const UV_LOCAL_MASK = 0x8000
    const UV_IMMUTABLE_MASK = 0x4000
    const LOCAL_UV_VAL_MASK = ~UV_LOCAL_MASK & ~UV_IMMUTABLE_MASK
    const OUTER_UV_VAL_MASK = ~UV_LOCAL_MASK

    // TODO: Support BE
    const val = u16(input)

    if ((val.value & UV_LOCAL_MASK) !== 0) {
        return {
            type: "LocalUpvalue",
            mutable: (val.value & UV_IMMUTABLE_MASK) !== 0,
            slot: new U14(val.value & LOCAL_UV_VAL_MASK),
        }
    } else {
        return {
            type: "OuterUpvalue",
            ref: new U15(val.value & OUTER_UV_VAL_MASK),
        }
    }
}

function tableItem(input: ByteStream, encoding: string): TableItem {
    const kind = uleb128(input).value

    let item: TableItem
    if (kind === 0) {
        item = { type: "Nil" }
    } else if (kind === 1) {
        item = { type: "False" }
    } else if (kind === 2) {
        item = { type: "True" }
    } else if (kind === 3) {
        item = uleb128(input)
    } else if (kind === 4) {
        item = f64(input)
    } else {
        item = len_string(input, kind - 5, encoding)
    }

    return item
}

function table(input: ByteStream, encoding: string): Table {
    const [array_num, hash_num] = tuple(uleb128, uleb128)(input)

    const item = call(tableItem, encoding)

    const [array, hash] = tuple(
        count(array_num, item),
        count(hash_num, tuple(item, item))
    )(input)

    return {
        type: "Table",
        array,
        hash,
    }
}

function constantData(
    input: ByteStream,
    stack: Prototype[],
    encoding: string
): ConstantData {
    const kind = uleb128(input).value

    if (kind === 0) {
        const top = stack.pop()
        if (top === undefined) {
            throw new Error("empty stack")
        } else {
            return top
        }
    } else if (kind === 1) {
        return table(input, encoding)
    } else if (kind === 2) {
        return i64(input)
    } else if (kind === 3) {
        return u64(input)
    } else if (kind === 4) {
        return {
            type: "Complex",
            x: f64(input),
            y: f64(input),
        }
    } else {
        return call(len_string, kind - 5, encoding)(input)
    }
}

function constantNumber(input: ByteStream): ConstantNumber {
    const is_int = map(peek(u8), (n) => (n.value & 0b10000000) === 0)(input)
    const lo = uleb128_33(input)

    if (is_int) {
        return lo
    } else {
        const hi = uleb128(input)
        return two_part_f64(lo.value, hi.value)
    }
}

function lineInfo(
    input: ByteStream,
    first_line: Uleb128,
    line_num: Uleb128,
    inst_num: Uleb128
): LineInfo {
    // TODO: Support BE
    let int
    if (U8.inRange(line_num.value)) {
        int = u8
    } else if (U16.inRange(line_num.value)) {
        int = u16
    } else {
        int = u32
    }

    const v = []
    for (let i = 0; i < inst_num.value; i++) {
        v.push(first_line.value + int(input).value)
    }

    return {
        map: v,
    }
}

function varInfo(input: ByteStream, encoding: string): VarInfo[] {
    const v: VarInfo[] = []
    let pc = 0

    for (;;) {
        const n = u8(input).value

        let kind:
            | "ForIndex"
            | "ForStop"
            | "ForStep"
            | "ForGeneraor"
            | "ForState"
            | "ForControl"
            | Var
        if (n === 0) {
            return v
        } else if (n === 1) {
            kind = "ForIndex"
        } else if (n === 2) {
            kind = "ForStop"
        } else if (n === 3) {
            kind = "ForStep"
        } else if (n === 4) {
            kind = "ForGeneraor"
        } else if (n === 5) {
            kind = "ForState"
        } else if (n === 6) {
            kind = "ForControl"
        } else {
            kind = {
                type: "VarName",
                name: null_end_string(input, encoding),
            }
        }

        const [gap, range] = tuple(uleb128, uleb128)(input)

        pc += gap.value

        v.push({
            type: "VarInfo",
            kind,
            start: new Uleb128(pc),
            range,
        })
    }
}

function debugInfo(
    input: ByteStream,
    sz: Uleb128,
    first_line: Uleb128,
    line_num: Uleb128,
    upvalues_num: U8,
    inst_num: Uleb128,
    encoding: string
): DebugInfo {
    // TODO: Verify the size of debug info
    const [line_info, upvalue_names, var_info] = tuple(
        call(lineInfo, first_line, line_num, inst_num),
        count(upvalues_num, call(null_end_string, encoding)),
        call(varInfo, encoding)
    )(input)

    return {
        first_line,
        line_num,
        line_info,
        upvalue_names,
        var_info,
    }
}
