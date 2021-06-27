import { If, IfThenAssign, Jump } from ".."
import { Visitor } from "../visitor"

export class Remapper extends Visitor {
    map
    constructor(map: number[]) {
        super()
        this.map = map
    }

    visitIf(node: If): void {
        node.thenBranch = this.map[node.thenBranch]
        super.visitIf(node)
    }

    visitJump(node: Jump): void {
        node.target = this.map[node.target]
        super.visitJump(node)
    }

    visitIfThenAssign(node: IfThenAssign): void {
        node.thenBranch = this.map[node.thenBranch]
        super.visitIfThenAssign(node)
    }
}
