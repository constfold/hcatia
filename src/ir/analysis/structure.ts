/**
 * Structure recognizer using structural analysis
 */

import { Block } from "./block"

export enum StructKind {
    If,
    IfElse,
    While,
    Repeat,
    ForIn,
    ForNum,
    Chunk,
}

export interface Struct {
    kind: StructKind
}

export interface If extends Struct {
    kind: StructKind.If
    blocks: Struct[]
}

export interface IfElse extends Struct {
    kind: StructKind.IfElse
    thenBlocks: Struct[]
    elseBlocks: Struct[]
}

export interface While extends Struct {
    kind: StructKind.While
}

export interface Repeat extends Struct {
    kind: StructKind.Repeat
}

export interface ForIn extends Struct {
    kind: StructKind.ForIn
}

export interface ForNum extends Struct {
    kind: StructKind.ForNum
}

export interface Chunk extends Struct {
    kind: StructKind.Chunk
}

export default function recognize(bb: Block[]) {}
