import * as bcp from "../src/bytecode/print"
import * as read from "../src/bytecode/read"
import { execSync } from "child_process"
import fs from "fs"
import { luaJitPath, BufferStream, compileCases } from "./utils"

const modify = (out: string): string => {
    return out
        .replace(/^(-- BYTECODE --).+$/gm, "$1")
        .replace(/^([A-Z0-9 =>]+\d)\s+;.+$/gm, "$1")
}

const cases = compileCases()

describe.each(cases)("read bytecode %s", (filename) => {
    test("print same instructions", () => {
        const stdout = execSync(
            `cd ${luaJitPath} && ./luajit -bl ${filename}`
        ).toString()

        let buf = ""
        const write = (s: string) => (buf += s)

        const stream = new BufferStream(fs.readFileSync(filename))
        const bc = read.bytecode(stream)

        bcp.bytecode(write, bc)

        expect(buf).toBe(modify(stdout))
    })
})
