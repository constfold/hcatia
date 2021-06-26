import {
    Assign,
    BinaryOp,
    BoolCoercion,
    Call,
    Cat,
    ChildFunc,
    Cond,
    CondCompare,
    CDataConst,
    Dst,
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
    Loop,
    MultRes,
    NewTable,
    NumConst,
    Op,
    Pri,
    Ret,
    RetCall,
    RetVar,
    Src,
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

export class Visitor {
    visitFile(file: File): void {
        visitFile(this, file)
    }
    visitFn(fn: Fn): void {
        visitFn(this, fn)
    }

    visitInstruction(node: Instruction): void {
        visitInstruction(this, node)
    }

    visitIf(node: If): void {
        visitIf(this, node)
    }
    visitAssign(node: Assign): void {
        visitAssign(this, node)
    }
    visitCall(node: Call): void {
        visitCall(this, node)
    }
    visitLoop(node: Loop): void {
        visitLoop(this, node)
    }
    visitRet(node: Ret): void {
        visitRet(this, node)
    }
    visitJump(node: Jump): void {
        visitJump(this, node)
    }
    visitIfThenAssign(node: IfThenAssign): void {
        visitIfThenAssign(this, node)
    }

    visitRetVar(node: RetVar): void {
        visitRetVar(this, node)
    }
    visitRetCall(node: RetCall): void {
        visitRetCall(this, node)
    }
    visitForNumInit(node: ForNumInit): void {
        visitForNumInit(this, node)
    }
    visitForNumEnd(node: ForNumEnd): void {
        visitForNumEnd(this, node)
    }
    visitForIn(node: ForIn): void {
        visitForIn(this, node)
    }
    visitGenericLoop(node: GenericLoop): void {
        visitGenericLoop(this, node)
    }

    visitCond(node: Cond): void {
        visitCond(this, node)
    }
    visitDst(node: Dst): void {
        visitDst(this, node)
    }
    visitSrc(node: Src): void {
        visitSrc(this, node)
    }

    visitBoolCoercion(node: BoolCoercion): void {
        visitBoolCoercion(this, node)
    }
    visitCondCompare(node: CondCompare): void {
        visitCondCompare(this, node)
    }
    visitLogicalOp(node: LogicalOp): void {
        visitLogicalOp(this, node)
    }
    visitLogicalNotOp(node: LogicalNotOp): void {
        visitLogicalNotOp(this, node)
    }
    visitMultRes(node: MultRes): void {
        visitMultRes(this, node)
    }
    visitVarg(node: Varg): void {
        visitVarg(this, node)
    }
    visitVar(node: Var): void {
        visitVar(this, node)
    }
    visitUpvalue(node: Upvalue): void {
        visitUpvalue(this, node)
    }
    visitTable(node: Table): void {
        visitTable(this, node)
    }
    visitGlobal(node: Global): void {
        visitGlobal(this, node)
    }
    visitVarList(node: VarList): void {
        visitVarList(this, node)
    }
    visitLit(node: Lit): void {
        visitLit(this, node)
    }
    visitChildFunc(node: ChildFunc): void {
        visitChildFunc(this, node)
    }
    visitStringConst(node: StringConst): void {
        visitStringConst(this, node)
    }
    visitCDataConst(node: CDataConst): void {
        visitCDataConst(this, node)
    }
    visitNumConst(node: NumConst): void {
        visitNumConst(this, node)
    }
    visitPri(node: Pri): void {
        visitPri(this, node)
    }
    visitTableConst(node: TableConst): void {
        visitTableConst(this, node)
    }
    visitCat(node: Cat): void {
        visitCat(this, node)
    }
    visitNewTable(node: NewTable): void {
        visitNewTable(this, node)
    }
    visitOp(node: Op): void {
        visitOp(this, node)
    }
    visitSrcList(node: SrcList): void {
        visitSrcList(this, node)
    }

    visitBinaryOp(node: BinaryOp): void {
        visitBinaryOp(this, node)
    }
    visitUnaryOp(node: UnaryOp): void {
        visitUnaryOp(this, node)
    }
}

export function visitFile<V extends Visitor>(visitor: V, file: File): void {
    visitor.visitFn(file.fn)
}
export function visitFn<V extends Visitor>(visitor: V, fn: Fn): void {
    for (const inst of fn.instructions) {
        visitor.visitInstruction(inst)
    }
}

export function visitInstruction<V extends Visitor>(
    visitor: V,
    node: Instruction
): void {
    if (node.type === "If") {
        visitor.visitIf(node)
    } else if (node.type === "Assign") {
        visitor.visitAssign(node)
    } else if (node.type === "Call") {
        visitor.visitCall(node)
    } else if (
        node.type === "ForNumInit" ||
        node.type === "ForNumEnd" ||
        node.type === "ForIn" ||
        node.type === "GenericLoop"
    ) {
        visitor.visitLoop(node)
    } else if (node.type === "RetVar" || node.type === "RetCall") {
        visitor.visitRet(node)
    } else if (node.type === "Jump") {
        visitor.visitJump(node)
    } else if (node.type === "IfThenAssign") {
        visitor.visitIfThenAssign(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node
    }
}

export function visitIf<V extends Visitor>(visitor: V, node: If): void {
    visitor.visitCond(node.cond)
}
export function visitAssign<V extends Visitor>(visitor: V, node: Assign): void {
    visitor.visitDst(node.dst)
    visitor.visitSrc(node.src)
}
export function visitCall<V extends Visitor>(visitor: V, node: Call): void {
    visitor.visitSrc(node.f)
    visitor.visitSrcList({ type: "SrcList", srcs: node.args })
}
export function visitLoop<V extends Visitor>(visitor: V, node: Loop): void {
    if (node.type === "ForIn") {
        visitor.visitForIn(node)
    } else if (node.type === "ForNumInit") {
        visitor.visitForNumInit(node)
    } else if (node.type === "ForNumEnd") {
        visitor.visitForNumEnd(node)
    } else if (node.type === "GenericLoop") {
        visitor.visitGenericLoop(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node
    }
}
export function visitRet<V extends Visitor>(visitor: V, node: Ret): void {
    if (node.type === "RetVar") {
        visitor.visitRetVar(node)
    } else if (node.type === "RetCall") {
        visitor.visitRetCall(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function visitJump<V extends Visitor>(_visitor: V, _node: Jump): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
}
export function visitIfThenAssign<V extends Visitor>(
    visitor: V,
    node: IfThenAssign
): void {
    visitor.visitCond(node.cond)
    visitor.visitAssign(node.assign)
}

export function visitRetVar<V extends Visitor>(visitor: V, node: RetVar): void {
    visitor.visitSrcList({ type: "SrcList", srcs: node.values })
}
export function visitRetCall<V extends Visitor>(
    visitor: V,
    node: RetCall
): void {
    visitor.visitCall(node.call)
}
export function visitForNumInit<V extends Visitor>(
    visitor: V,
    node: ForNumInit
): void {
    visitor.visitIfThenAssign(node.checkThenInit)
}
export function visitForNumEnd<V extends Visitor>(
    visitor: V,
    node: ForNumEnd
): void {
    visitor.visitAssign(node.reduce)
    visitor.visitIfThenAssign(node.checkThenAssign)
}
export function visitForIn<V extends Visitor>(visitor: V, node: ForIn): void {
    visitor.visitAssign(node.init)
    visitor.visitAssign(node.callIter)
    visitor.visitAssign(node.reduce)
    visitor.visitIf(node.check)
}

export function visitCond<V extends Visitor>(visitor: V, node: Cond): void {
    if (node.type === "ImplicitTrue" || node.type === "ImplicitFalse") {
        visitor.visitBoolCoercion(node)
    } else if (node.type === "And" || node.type === "Or") {
        visitor.visitLogicalOp(node)
    } else if (node.type === "LogicalNot") {
        visitor.visitLogicalNotOp(node)
    } else if (
        node.type === "Lt" ||
        node.type === "Ge" ||
        node.type === "Le" ||
        node.type === "Gt" ||
        node.type === "Eq" ||
        node.type === "Ne"
    ) {
        visitor.visitCondCompare(node)
    } else {
        // TODO: Why type narrowing can't know `node` is never but can know `node.type` is?
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node.type
    }
}
export function visitDst<V extends Visitor>(visitor: V, node: Dst): void {
    if (node.type === "Global") {
        visitor.visitGlobal(node)
    } else if (node.type === "MultRes") {
        visitor.visitMultRes(node)
    } else if (node.type === "Var" || node.type === "Arg") {
        visitor.visitVar(node)
    } else if (node.type === "Upvalue") {
        visitor.visitUpvalue(node)
    } else if (node.type === "Table") {
        visitor.visitTable(node)
    } else if (node.type === "VarList") {
        visitor.visitVarList(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node.type
    }
}
export function visitSrc<V extends Visitor>(visitor: V, node: Src): void {
    if (node.type === "Global") {
        visitor.visitGlobal(node)
    } else if (node.type === "MultRes") {
        visitor.visitMultRes(node)
    } else if (node.type === "Var" || node.type === "Arg") {
        visitor.visitVar(node)
    } else if (node.type === "Upvalue") {
        visitor.visitUpvalue(node)
    } else if (node.type === "Table") {
        visitor.visitTable(node)
    } else if (node.type === "Lit") {
        visitor.visitLit(node)
    } else if (node.type === "ChildFunc") {
        visitor.visitChildFunc(node)
    } else if (node.type === "StringConst") {
        visitor.visitStringConst(node)
    } else if (node.type === "CDataConst") {
        visitor.visitCDataConst(node)
    } else if (node.type === "NumConst") {
        visitor.visitNumConst(node)
    } else if (node.type === "Pri") {
        visitor.visitPri(node)
    } else if (node.type === "TableConst") {
        visitor.visitTableConst(node)
    } else if (node.type === "Call") {
        visitor.visitCall(node)
    } else if (node.type === "Cat") {
        visitor.visitCat(node)
    } else if (node.type === "NewTable") {
        visitor.visitNewTable(node)
    } else if (node.type === "Varg") {
        visitor.visitVarg(node)
    } else if (
        node.type === "Add" ||
        node.type === "Sub" ||
        node.type === "Mul" ||
        node.type === "Div" ||
        node.type === "Mod" ||
        node.type === "Pow" ||
        node.type === "Not" ||
        node.type === "Unm" ||
        node.type === "Len"
    ) {
        visitor.visitOp(node)
    } else if (node.type === "SrcList") {
        visitor.visitSrcList(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node.type
    }
}

export function visitBoolCoercion<V extends Visitor>(
    visitor: V,
    node: BoolCoercion
): void {
    visitor.visitSrc(node.src)
}
export function visitCondCompare<V extends Visitor>(
    visitor: V,
    node: CondCompare
): void {
    visitor.visitSrc(node.left)
    visitor.visitSrc(node.right)
}
export function visitLogicalOp<V extends Visitor>(
    visitor: V,
    node: LogicalOp
): void {
    visitor.visitCond(node.left)
    visitor.visitCond(node.right)
}
export function visitLogicalNotOp<V extends Visitor>(
    visitor: V,
    node: LogicalNotOp
): void {
    visitor.visitCond(node.expr)
}

export function visitGlobal<V extends Visitor>(visitor: V, node: Global): void {
    visitor.visitStringConst(node.varName)
}
export function visitVarList<V extends Visitor>(
    visitor: V,
    node: VarList
): void {
    for (const v of node.vars) {
        visitor.visitVar(v)
    }
}

export function visitCat<V extends Visitor>(visitor: V, node: Cat): void {
    visitor.visitVarList(node.vars)
}
export function visitOp<V extends Visitor>(visitor: V, node: Op): void {
    if (node.type === "Not" || node.type === "Unm" || node.type === "Len") {
        visitor.visitUnaryOp(node)
    } else if (
        node.type === "Add" ||
        node.type === "Sub" ||
        node.type === "Mul" ||
        node.type === "Div" ||
        node.type === "Mod" ||
        node.type === "Pow"
    ) {
        visitor.visitBinaryOp(node)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _: never = node.type
    }
}
export function visitSrcList<V extends Visitor>(
    visitor: V,
    node: SrcList
): void {
    for (const src of node.srcs) {
        visitor.visitSrc(src)
    }
}

export function visitBinaryOp<V extends Visitor>(
    visitor: V,
    node: BinaryOp
): void {
    visitor.visitSrc(node.left)
    visitor.visitSrc(node.right)
}
export function visitUnaryOp<V extends Visitor>(
    visitor: V,
    node: UnaryOp
): void {
    visitor.visitSrc(node.expr)
}

/* eslint-disable */
export function visitGenericLoop<V extends Visitor>(
    _visitor: V,
    _node: GenericLoop
): void {}
export function visitMultRes<V extends Visitor>(
    _visitor: V,
    _node: MultRes
): void {}
export function visitVarg<V extends Visitor>(_visitor: V, _node: Varg): void {}
export function visitVar<V extends Visitor>(_visitor: V, _node: Var): void {}
export function visitUpvalue<V extends Visitor>(
    _visitor: V,
    _node: Upvalue
): void {}
export function visitTable<V extends Visitor>(
    _visitor: V,
    _node: Table
): void {}
export function visitLit<V extends Visitor>(_visitor: V, _node: Lit): void {}
export function visitChildFunc<V extends Visitor>(
    _visitor: V,
    _node: ChildFunc
): void {}
export function visitStringConst<V extends Visitor>(
    _visitor: V,
    _node: StringConst
): void {}
export function visitCDataConst<V extends Visitor>(
    _visitor: V,
    _node: CDataConst
): void {}
export function visitNumConst<V extends Visitor>(
    _visitor: V,
    _node: NumConst
): void {}
export function visitPri<V extends Visitor>(_visitor: V, _node: Pri): void {}
export function visitTableConst<V extends Visitor>(
    _visitor: V,
    _node: TableConst
): void {}
export function visitNewTable<V extends Visitor>(
    _visitor: V,
    _node: NewTable
): void {}
/* eslint-enable */
