// LuaJIT AST (2.0.5 for now), based mainly on
// https://github.com/TypeScriptToLua/TypeScriptToLua/blob/master/src/LuaAST.ts
//
// The AST is basicaly as same as Lua 5.1 but with some extensions.
// See links below for more information:
// https://www.lua.org/manual/5.1/manual.html#8
// http://luajit.org/extensions.html
// https://www.lua.org/manual/5.2/manual.html#9
// https://github.com/LuaJIT/LuaJIT/tree/v2.0
//
// Modified/elided some nodes in the light of the use case

export enum NodeKind {
    Chunk,

    // Statements

    // do-end could not be generated
    // DoStatement,

    VariableDeclarationStatement,
    AssignmentStatement,
    IfStatement,

    // Loops
    WhileStatement,
    RepeatStatement,
    ForNumStatement,
    ForInStatement,

    // `goto` and `label` is LuaJIT extensions
    GotoStatement,
    LabelStatement,

    ExpressionStatement,

    // Actually `break` and `return` can only be placed at the end of a chunk
    // Break as statement is only enabled if LuaJIT is built with `LUAJIT_ENABLE_LUA52COMPAT`
    BreakStatement,
    ReturnStatement,

    // Expression
    StringLiteral,
    NumberLiteral,
    NilKeyword,
    DotsKeyword,
    TrueKeyword,
    FalseKeyword,
    FunctionExpression,
    TableFieldExpression,
    TableExpression,
    UnaryExpression,
    BinaryExpression,
    CallExpression,
    MethodCallExpression,
    Identifier,
    TableIndexExpression,

    // Operators

    // Arithmetic
    AdditionOperator, // Maybe use abbreviations for those add, sub, mul ...
    SubtractionOperator,
    MultiplicationOperator,
    DivisionOperator,
    FloorDivisionOperator,
    ModuloOperator,
    PowerOperator,
    NegationOperator, // Unary minus

    // Concat
    ConcatOperator,

    // Length
    LengthOperator, // Unary

    // Relational Ops
    EqualityOperator,
    InequalityOperator,
    LessThanOperator,
    LessEqualOperator,
    GreaterThanOperator,
    GreaterEqualOperator,

    // Logical
    AndOperator,
    OrOperator,
    NotOperator, // Unary
}
export type UnaryOperator =
    | NodeKind.NegationOperator
    | NodeKind.LengthOperator
    | NodeKind.NotOperator

export type BinaryOperator =
    | NodeKind.AdditionOperator
    | NodeKind.SubtractionOperator
    | NodeKind.MultiplicationOperator
    | NodeKind.DivisionOperator
    | NodeKind.FloorDivisionOperator
    | NodeKind.ModuloOperator
    | NodeKind.PowerOperator
    | NodeKind.ConcatOperator
    | NodeKind.EqualityOperator
    | NodeKind.InequalityOperator
    | NodeKind.LessThanOperator
    | NodeKind.LessEqualOperator
    | NodeKind.GreaterThanOperator
    | NodeKind.GreaterEqualOperator
    | NodeKind.AndOperator
    | NodeKind.OrOperator

interface Node {
    kind: NodeKind
}

export interface Chunk extends Node {
    kind: NodeKind.Chunk
}

export interface Statement extends Node {
    _statementBrand: unknown
}

// `local test1, test2 = 12, 42` or `local test1, test2`
export interface VariableDeclarationStatement extends Statement {
    kind: NodeKind.VariableDeclarationStatement
    left: Identifier[]
    right?: Expression[]
}

// `test1, test2 = 12, 42`
export interface AssignmentStatement extends Statement {
    kind: NodeKind.AssignmentStatement
    left: AssignmentLeftHandSideExpression[]
    right: Expression[]
}

export interface IfStatement extends Statement {
    kind: NodeKind.IfStatement
    condition: Expression
    ifChunk: Chunk
    elseChunk?: Chunk | IfStatement
}

export interface IterationStatement extends Statement {
    body: Chunk
}

export interface WhileStatement extends IterationStatement {
    kind: NodeKind.WhileStatement
    condition: Expression
}

export interface RepeatStatement extends IterationStatement {
    kind: NodeKind.RepeatStatement
    condition: Expression
}

export interface ForNumStatement extends IterationStatement {
    kind: NodeKind.ForNumStatement
    controlVariable: Identifier
    controlVariableInitializer: Expression
    limitExpression: Expression
    stepExpression?: Expression
}

export interface ForInStatement extends IterationStatement {
    kind: NodeKind.ForInStatement
    names: Identifier[]
    expressions: Expression[]
}

export interface GotoStatement extends Statement {
    kind: NodeKind.GotoStatement
    label: string // or identifier ?
}

export interface LabelStatement extends Statement {
    kind: NodeKind.LabelStatement
    name: string // or identifier ?
}

export interface ReturnStatement extends Statement {
    kind: NodeKind.ReturnStatement
    expressions: Expression[]
}

export interface BreakStatement extends Statement {
    kind: NodeKind.BreakStatement
}

export interface ExpressionStatement extends Statement {
    kind: NodeKind.ExpressionStatement
    expression: Expression
}

export interface Expression extends Node {
    _expressionBrand: unknown
}

// Expressions
export interface PrimaryLiteral extends Expression {
    kind: NodeKind.TrueKeyword | NodeKind.FalseKeyword | NodeKind.NilKeyword
}

export interface ThreeDots extends Expression {
    kind: NodeKind.DotsKeyword
}

export interface NumberLiteral extends Expression {
    kind: NodeKind.NumberLiteral
    value: number
}

export interface StringLiteral extends Expression {
    kind: NodeKind.StringLiteral
    value: string
}

export enum FunctionExpressionFlags {
    None = 1 << 0,
    Inline = 1 << 1, // Keep function body on same line
    Declaration = 1 << 2, // Prefer declaration syntax `function foo()` over assignment syntax `foo = function()`
}

export interface FunctionExpression extends Expression {
    kind: NodeKind.FunctionExpression
    params?: Identifier[]
    dots?: ThreeDots
    body: Chunk
    flags: FunctionExpressionFlags
}

export interface TableFieldExpression extends Expression {
    kind: NodeKind.TableFieldExpression
    value: Expression
    key?: Expression
}

export interface TableExpression extends Expression {
    kind: NodeKind.TableExpression
    fields: TableFieldExpression[]
}

export interface UnaryExpression extends Expression {
    kind: NodeKind.UnaryExpression
    operand: Expression
    operator: UnaryOperator
}

export interface BinaryExpression extends Expression {
    kind: NodeKind.BinaryExpression
    operator: BinaryOperator
    left: Expression
    right: Expression
}

export interface CallExpression extends Expression {
    kind: NodeKind.CallExpression
    expression: Expression
    params: Expression[]
}

export interface MethodCallExpression extends Expression {
    kind: NodeKind.MethodCallExpression
    prefixExpression: Expression
    name: Identifier
    params: Expression[]
}

export enum IdentifierType {
    // The function arguments
    Arg,
    Var,
    Upvalue,
    // TODO: Maybe add debug for unstripped bytecode?
}

/**
 * Since doing decompilation, we are not able to know what the orignal `Identifier` is.
 * So we just create an unique name under the type and the scope of a var.
 */
export interface Identifier extends Expression {
    kind: NodeKind.Identifier
    type: IdentifierType
    /**
     * If type is `Arg` or `Var`, this is the slot on stack.
     * If type is `Upvalue`, this is the slot and function id where the upvalue stored
     */
    slot: number
}

export interface TableIndexExpression extends Expression {
    kind: NodeKind.TableIndexExpression
    table: Expression
    index: Expression
}

export type AssignmentLeftHandSideExpression = Identifier | TableIndexExpression
