import fs from "fs"
import * as bcread from "../src/bytecode/read"
import transform from "../src/ir/transform"
import { IrPrinter } from "../src/ir/print"
import { BufferStream, compileCases } from "./utils"

const cases = compileCases()

describe.each(cases)("bytecode: %s", (filename) => {
    test("no exception", () => {
        let buf = ""
        const write = (s: string) => (buf += s)

        const stream = new BufferStream(fs.readFileSync(filename))

        const bc = bcread.bytecode(stream)
        const ir = transform(bc)

        const printer = new IrPrinter(write)
        printer.visitFile(ir)

        console.log(buf)

        expect(buf).toBeTruthy()
    })
})
