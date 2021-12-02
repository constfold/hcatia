import {
    Assign,
    BinaryOp,
    BoolCoercion,
    Call,
    Cat,
    CDataConst,
    ChildFunc,
    CondCompare,
    File,
    Fn,
    ForIn,
    ForNumEnd,
    ForNumInit,
    GenericLoop,
    Global,
    If,
    IfThenAssign,
    Instruction,
    Jump,
    Lit,
    LogicalNotOp,
    LogicalOp,
    MultRes,
    NewTable,
    NumConst,
    Op,
    Pri,
    RetCall,
    RetVar,
    SrcList,
    StringConst,
    Table,
    TableConst,
    UnaryOp,
    Upvalue,
    Var,
    Varg,
    VarList,
} from "."
import { Visitor } from "./visitor"
import assert from "assert"

const INDENT: string = " ".repeat(4)

export class IrPrinter extends Visitor {
    write
    indentLv
    pc
    fn: Fn | undefined
    fnCount
    fnId
    componentHierarchy

    constructor(write: (s: string) => void) {
        super()
        this.write = write
        this.indentLv = 0
        this.fn = undefined
        this.pc = 0
        this.fnCount = 0
        this.fnId = 0
        this.componentHierarchy = 1
    }

    private writeWithIndent(s?: string): void {
        this.write(`${INDENT}|`.repeat(this.indentLv))
        if (s !== undefined) {
            this.write(s)
        }
    }

    private writeComponent(s: string, visit?: () => void) {
        this.writeNewLineWithIndent(
            `${" ".repeat(4 + this.componentHierarchy)}+ `
        )
        this.write(s)
        if (visit !== undefined) {
            this.componentHierarchy += 2
            visit()
            this.componentHierarchy -= 2
        }
    }

    private writeNewLineWithIndent(s?: string): void {
        this.write("\n")
        this.writeWithIndent(s)
    }

    visitFile(file: File): void {
        this.write(`|< ${file.name ? file.name : "STRIPPED"} >|`)
        super.visitFile(file)
    }

    visitFn(fn: Fn): void {
        this.fn = fn

        if (fn.parent === undefined) {
            this.write("\n<-- ROOT -->")
            super.visitFn(fn)
        } else {
            let params = Array.from({ length: fn.paramsNum })
                .map((_, i) => `arg${i}`)
                .join(", ")
            if (fn.variadic) {
                params += ", ..."
            }

            this.write(`Function (${params})`)
            this.writeNewLineWithIndent("$")

            this.indentLv += 1
            super.visitFn(fn)
            this.indentLv -= 1

            this.writeNewLineWithIndent("$")
        }
    }

    visitInstruction(node: Instruction): void {
        this.writeNewLineWithIndent()
        this.write(this.pc.toString().padEnd(4))
        this.write("> ")
        super.visitInstruction(node)
        this.pc += 1
    }

    visitIf(node: If): void {
        this.write("If (")
        this.visitCond(node.cond)
        this.write(")")
        this.writeComponent(`then -> ${node.thenBranch}`)
        this.writeComponent(`else -> ${this.pc + 1}`)
    }
    visitAssign(node: Assign): void {
        this.visitDst(node.dst)
        this.write(" = ")
        this.visitSrc(node.src)
    }
    visitCall(node: Call): void {
        this.write("Call (")
        super.visitSrc(node.f)
        this.write(") ")
        this.visitSrcList({ type: "SrcList", srcs: node.args })
    }
    visitJump(node: Jump): void {
        this.write(`Jump -> ${node.target}`)
        super.visitJump(node)
    }
    visitIfThenAssign(node: IfThenAssign): void {
        this.write("IfThenAssign (")
        this.visitCond(node.cond)
        this.write(")")

        this.writeComponent("assign: ", () => this.visitAssign(node.assign))

        this.writeComponent(`then -> ${node.thenBranch}`)
        this.writeComponent(`else -> ${this.pc + 1}`)
    }

    visitRetVar(node: RetVar): void {
        this.write("RetVar (")
        super.visitRetVar(node)
        this.write(")")
    }
    visitRetCall(node: RetCall): void {
        this.write("RetCall (")
        super.visitRetCall(node)
        this.write(")")
    }
    visitForNumInit(node: ForNumInit): void {
        this.write("ForNumInit")
        this.writeComponent("checkThenInit: ", () =>
            this.visitIfThenAssign(node.checkThenInit)
        )
    }
    visitForNumEnd(node: ForNumEnd): void {
        this.write("ForNumEnd")

        this.writeComponent("reduce: ", () => this.visitAssign(node.reduce))

        this.writeComponent("checkThenAssign: ", () =>
            this.visitIfThenAssign(node.checkThenAssign)
        )
    }
    visitForIn(node: ForIn): void {
        this.write("ForIn")
        this.writeComponent("init: ", () => {
            this.visitAssign(node.init)
        })
        this.writeComponent("callIter: ", () => this.visitAssign(node.callIter))
        this.writeComponent("reduce: ", () => this.visitAssign(node.reduce))
        this.writeComponent("check: ", () => this.visitIf(node.check))
    }
    visitGenericLoop(node: GenericLoop): void {
        this.write("GenericLoop")
        super.visitGenericLoop(node)
    }

    visitBoolCoercion(node: BoolCoercion): void {
        this.write(`${node.type} (`)
        super.visitBoolCoercion(node)
        this.write(")")
    }
    visitCondCompare(node: CondCompare): void {
        this.write("(")
        this.visitSrc(node.left)
        this.write(")")

        this.write(` ${node.type} `)

        this.write("(")
        this.visitSrc(node.right)
        this.write(")")
    }
    visitLogicalOp(node: LogicalOp): void {
        this.write("(")
        this.visitCond(node.left)
        this.write(")")

        this.write(` ${node.type} `)

        this.write("(")
        this.visitCond(node.right)
        this.write(")")
    }
    visitLogicalNotOp(node: LogicalNotOp): void {
        this.write("Not ")
        this.write("(")
        super.visitLogicalNotOp(node)
        this.write(")")
    }
    visitMultRes(node: MultRes): void {
        this.write("MultRes")
        super.visitMultRes(node)
    }
    visitVarg(node: Varg): void {
        this.write("...")
        super.visitVarg(node)
    }
    visitVar(node: Var): void {
        assert(this.fn !== undefined)

        if (node.type === "Arg") {
            this.write(`arg${node.slot}`)
        } else {
            this.write(`var@${this.fnId}_${node.slot}`)
        }
        super.visitVar(node)
    }
    visitUpvalue(node: Upvalue): void {
        assert(this.fn !== undefined)
        let uv = this.fn.symbols.upvalues[node.idx]
        let lv = 0

        let fn = this.fn
        for (;;) {
            if (uv.type === "OuterUpvalue") {
                // Find where the uv points to.
                const ref = uv.ref.value
                assert(fn.parent !== undefined)
                uv = fn.parent.symbols.upvalues[ref]
                fn = fn.parent
                lv += 1
            } else {
                break
            }
        }

        assert(uv.type === "LocalUpvalue")
        this.write("uv#")
        if (!uv.mutable) {
            this.write("const!")
        }
        this.write(`var@p${lv}_${uv.slot.value}`)

        super.visitUpvalue(node)
    }
    visitTable(node: Table): void {
        this.write("Table (")
        this.visitSrc(node.table)
        this.write(")[")
        this.visitSrc(node.key)
        this.write("]")
    }
    visitGlobal(node: Global): void {
        this.write("_G[")
        super.visitGlobal(node)
        this.write("]")
    }
    visitVarList(node: VarList): void {
        this.write("<")
        if (node.vars.length === 0) {
            this.write("!")
        } else {
            for (let i = 0; i < node.vars.length - 1; i++) {
                this.visitVar(node.vars[i])
                this.write(", ")
            }
            this.visitVar(node.vars[node.vars.length - 1])
        }
        this.write(">")
    }
    visitLit(node: Lit): void {
        this.write(`Lit ${node.val}`)
        super.visitLit(node)
    }
    visitChildFunc(node: ChildFunc): void {
        assert(this.fn !== undefined)
        const data = this.fn.symbols.data
        const fn = data[node.idx]
        assert(typeof fn !== "string" && fn.type === "Fn")

        // Save context
        const pc = this.pc
        const fnId = this.fnId
        this.fnCount += 1
        this.fnId = this.fnCount

        this.pc = 0
        this.visitFn(fn)

        // Restore the context
        this.pc = pc
        this.fn = fn.parent
        this.fnId = fnId
    }
    visitStringConst(node: StringConst): void {
        assert(this.fn !== undefined)
        const data = this.fn.symbols.data
        const s = data[node.idx]
        assert(typeof s === "string")
        this.write(`"${escape(s)}"`)

        super.visitStringConst(node)
    }
    visitCDataConst(node: CDataConst): void {
        // TODO
        this.write("CDATA")
        super.visitCDataConst(node)
    }
    visitNumConst(node: NumConst): void {
        assert(this.fn !== undefined)
        const number = this.fn.symbols.numbers[node.idx]
        this.write(`Num ${number.value}`)
        super.visitNumConst(node)
    }
    visitPri(node: Pri): void {
        this.write(`Pri ${node.val.type}`)
        super.visitPri(node)
    }
    visitTableConst(node: TableConst): void {
        // TODO
        this.write("TABLE")
        super.visitTableConst(node)
    }
    visitCat(node: Cat): void {
        this.write("Cat (")
        super.visitCat(node)
        this.write(")")
    }
    visitNewTable(node: NewTable): void {
        this.write(`NewTable ([${node.arraySize}];{${node.hashSize}})`)
        super.visitNewTable(node)
    }
    visitOp(node: Op): void {
        super.visitOp(node)
    }
    visitSrcList(node: SrcList): void {
        this.write("<")
        if (node.srcs.length === 0) {
            this.write("!")
        } else {
            for (let i = 0; i < node.srcs.length - 1; i++) {
                this.visitSrc(node.srcs[i])
                this.write(", ")
            }
            this.visitSrc(node.srcs[node.srcs.length - 1])
        }
        this.write(">")
    }

    visitBinaryOp(node: BinaryOp): void {
        this.write("(")
        this.visitSrc(node.left)
        this.write(`) ${node.type} (`)
        this.visitSrc(node.right)
        this.write(")")
    }
    visitUnaryOp(node: UnaryOp): void {
        this.write(`${node.type} (`)
        super.visitUnaryOp(node)
        this.write(")")
    }
}
