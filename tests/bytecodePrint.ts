import * as bcp from "../src/bytecode/print"
import * as read from "../src/bytecode/read"
import { execSync } from "child_process"
import fs from "fs"
import * as path from "path"
import { U8 } from "../src/bytecode/primitive"

const luaJitPath = "/mnt/e/luajit-decomp/LuaJIT-2.0.4/src"

class BufferStream {
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


const cases = ["./tests/cases/hello.lua"]

const modify = (out: string): string => {
    return out.replace(/^(-- BYTECODE --).+$/, "$1").replace(/;.+$/, "")
}

describe.each(cases)("read bytecode %s", (filename) => {
    test("print same instructions", () => {
        const lua = path.resolve(filename)
        const compiled = `${lua}.bc`
        const stdout = execSync(`cd ${luaJitPath} && ./luajit -bg ${lua} ${compiled} && ./luajit -bl ${compiled}`).toString()

        try {
            let buf = ""
            const write = (s: string) => (buf += s)
    
            const stream = new BufferStream(fs.readFileSync(compiled))
            const bc = read.bytecode(stream)
    
            bcp.bytecode(write, bc)
    
            expect(buf).toBe(modify(stdout))
        } finally {
            // execSync(`rm ${compiled}`)
        }
    })
})
