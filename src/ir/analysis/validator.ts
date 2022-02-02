/**
 * SSA validator
 *
 * We assume that LuaJIT's bytecode is SSA form, even though there is nothing being said
 * in its documentation.
 */

import { Dst, Fn, Var } from ".."
import { Visitor } from "../visitor"

class Validator extends Visitor {
    assigned: Set<number> = new Set()

    private checkAndTrackSlot(slot: number) {
        if (this.assigned.has(slot)) {
            throw new Error("Validate failed")
        }
        this.assigned.add(slot)
    }

    visitDst(node: Dst): void {
        if (node.type === "Var") {
            this.checkAndTrackSlot(node.slot)
        } else if (node.type === "VarList") {
            for (const v of node.vars) {
                this.checkAndTrackSlot(v.slot)
            }
        } else if (node.type === "Arg") {
            this.checkAndTrackSlot(node.slot)
        }
    }
}

/**
 * Validate a `Fn`, throws error if failed
 * @param fn the function to be validated
 */
export function validate(fn: Fn) {
    const validator = new Validator()
    validator.visitFn(fn)
}
