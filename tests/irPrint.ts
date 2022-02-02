import fs from "fs"
import * as bcread from "../src/bytecode/read"
import transform from "../src/ir/transform"
import { IrPrinter } from "../src/ir/print"
import { validate } from "../src/ir/analysis/validator"
import { BufferStream, prepareTestCases } from "./utils"
import { Bytecode } from "../src/bytecode"

const cases: string[] = prepareTestCases()

describe.each(cases)("bytecode: %s", (filename) => {
    const fileBuffer = fs.readFileSync(filename)
    let stream: BufferStream
    let bc: Bytecode

    beforeEach(() => {
        stream = new BufferStream(fileBuffer)
        bc = bcread.bytecode(stream)
    })

    test("print without error", () => {
        let buf = ""
        const write = (s: string) => (buf += s)

        const ir = transform(bc)

        const printer = new IrPrinter(write)
        printer.visitFile(ir)

        fs.writeFileSync(filename + ".ir", buf)

        expect(buf).toBeTruthy()
    })

    test("validate", () => {
        const ir = transform(bc)

        expect(() => {
            validate(ir.fn)
        }).not.toThrow()
    })
})
