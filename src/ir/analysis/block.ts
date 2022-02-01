/**
 * Block collector (basically for control flow analysis). This collects all basic blocks
 * in a function that could be useful in loop detection and data flow analysis.
 */

import { Fn, If, IfThenAssign, Instruction, Jump } from ".."
import { Visitor } from "../visitor"
import assert from "assert"

/**
 * Collect all "labels"(aka jump targets)
 */
class LabelCollector extends Visitor {
    pc = 0
    labels: Map<number, number[]> = new Map()

    private addLabel(branch: number) {
        if (this.labels.has(branch)) {
            const from = this.labels.get(branch)
            assert(from !== undefined)
            from.push(this.pc)
        }
        this.labels.set(branch, [this.pc])
    }

    visitInstruction(node: Instruction) {
        super.visitInstruction(node)
        this.pc += 1
    }

    visitIf(node: If) {
        this.addLabel(node.thenBranch)
        super.visitIf(node)
    }

    visitJump(node: Jump) {
        this.addLabel(node.target)
        super.visitJump(node)
    }

    visitIfThenAssign(node: IfThenAssign) {
        this.addLabel(node.thenBranch)
        super.visitIfThenAssign(node)
    }
}

class BlockCollector extends Visitor {
    labels: Map<number, number[]>

    pc = 0
    head = 0
    pred: number[] = []

    blocks: Block[] = []

    constructor(labels: Map<number, number[]>) {
        super()
        this.labels = labels
    }

    // Create a new block when meet a branch instruction or a label

    private addBlock(succ: number[]) {
        this.blocks.push({
            start: this.head,
            end: this.pc,
            pred: this.pred,
            succ,
        })

        this.pred = []
        this.head = this.pc + 1
    }

    visitInstruction(node: Instruction) {
        if (this.labels.has(this.pc)) {
            this.blocks.push({
                start: this.head,
                end: this.pc - 1,
                pred: this.pred,
                succ: [this.pc],
            })

            const from = this.labels.get(this.pc)
            assert(from !== undefined)

            this.head = this.pc
            this.pred = from
        }

        super.visitInstruction(node)
        this.pc += 1
    }

    visitIf(node: If) {
        this.addBlock([node.thenBranch, this.pc + 1])
        super.visitIf(node)
    }

    visitJump(node: Jump) {
        this.addBlock([node.target])
        super.visitJump(node)
    }

    visitIfThenAssign(node: IfThenAssign) {
        this.addBlock([node.thenBranch, this.pc + 1])
        super.visitIfThenAssign(node)
    }
}

export interface Block {
    start: number
    end: number
    /** The start address of the predecessor */
    pred: number[]
    /** The start address of the successor */
    succ: number[]
}

export function collectBlocks(fn: Fn): Block[] {
    const labelCollector = new LabelCollector()
    labelCollector.visitFn(fn)

    const blockCollector = new BlockCollector(labelCollector.labels)
    blockCollector.visitFn(fn)

    return blockCollector.blocks
}
