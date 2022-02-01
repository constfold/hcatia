import { readdirSync, mkdirSync } from "fs"
import { execFileSync } from "child_process"
import * as path from "path"
import { U8 } from "../src/bytecode/primitive"

const luajitFile =
    process.env.LUAJIT || "D:\\dev\\LuaJIT-2.0.5\\src\\luajit.exe"
const luajitDir = path.dirname(luajitFile)

export class BufferStream {
    buf: Buffer
    cur: number
    len: number

    constructor(buffer: Buffer) {
        this.buf = buffer
        this.cur = 0
        this.len = buffer.length
    }
    take_one(): U8 {
        return new U8(this.buf[this.cur++])
    }

    take(n: number): Uint8Array {
        this.cur += n

        return this.buf.slice(this.cur - n, this.cur)
    }

    get end(): boolean {
        return this.len === this.cur
    }
}

/**
 * Prepare all test cases
 * @returns filenames of each test case
 */
export function prepareTestCases(): string[] {
    const luaCasesPath = "./tests/cases/"
    const compiledCasesPath = "./build/tests/cases/"

    const cases = readdirSync(luaCasesPath)
    .map((s) => path.join(luaCasesPath, s))
    .map(s => path.resolve(s))
    
    const v: string[] = []
    mkdirSync(compiledCasesPath, { recursive: true })
    for (const testLua of cases) {
        // path to stripped compiled LuaJIT bytecode
        const bytecode = path.resolve(
            path.join(compiledCasesPath, `${path.basename(testLua)}.bc`)
        )
        // path to un-stripped LuaJIT bytecode
        const withDbg = bytecode + ".dbg"

        execFileSync(luajitFile, ["-bs", testLua, bytecode], {
            cwd: luajitDir,
        })
        execFileSync(luajitFile, ["-bg", testLua, withDbg], {
            cwd: luajitDir,
        })

        v.push(bytecode, withDbg)
    }

    return v
}

/**
 * call `luajit -bl` for given filename
 * @param filename bytecode's filename
 * @returns the output of LuaJIT
 */
export function listLuajitBytecode(filename: string): string {
    return execFileSync(luajitFile, ["-bl", filename], {
        cwd: luajitDir,
    }).toLocaleString()
}
