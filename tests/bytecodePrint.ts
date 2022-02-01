import * as bcp from "../src/bytecode/print"
import * as read from "../src/bytecode/read"
import fs from "fs"
import os from "os"
import { BufferStream, listLuajitBytecode, prepareTestCases } from "./utils"

const modify = (out: string): string => {
    return out
        .replace(/^(-- BYTECODE --).+$/gm, "$1")
        // Remove comment string(not intend to support)
        .replaceAll(/^([A-Z0-9 =>]+\d)\s+;.+$/gm, "$1")
        // Fix line separator
        // Note: we only use `\n` as separator for consistency
        .replaceAll(os.EOL, "\n")
}

const cases: string[] = prepareTestCases()

describe.each(cases)("bytecode %s", (filename) => {
    test("print same instructions", () => {
        const bcList = modify(listLuajitBytecode(filename))

        let buf = ""
        const write = (s: string) => (buf += s)

        const stream = new BufferStream(fs.readFileSync(filename))
        const bc = read.bytecode(stream)

        bcp.bytecode(write, bc)

        expect(buf).toBe(bcList)
    })
})
