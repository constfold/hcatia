import fs from "fs"
import { execSync } from "child_process"
import * as path from "path"
import { U8 } from "../src/bytecode/primitive"

export const luaJitPath = process.env.LUAJIT_SRC

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

const casesPath = "./tests/cases/"
const compiledPath = "./build/tests/cases/"

export const cases = listCases()

export function compileCases(): string[] {
    fs.mkdirSync(compiledPath, { recursive: true })
    const v: string[] = []
    for (const cs of cases) {
        const lua = cs
        const compiled = path.resolve(
            path.join(compiledPath, `${path.basename(cs)}.bc`)
        )
        const stripped = compiled + ".dbg"
        execSync(
            `cd ${luaJitPath} && ./luajit -bg ${lua} ${compiled} && ./luajit -bs ${lua} ${stripped}`
        )
        v.push(compiled, stripped)
    }

    return v
}

export function listCases(): string[] {
    const cases = fs
        .readdirSync(casesPath)
        .map((f) => path.resolve(path.join(casesPath, f)))

    return cases
}
