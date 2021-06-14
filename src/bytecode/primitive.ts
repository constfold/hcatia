/* eslint max-classes-per-file: ["off"] */

/**
 * 8 bits unsigned integer
 */
export class U8 {
    static max = 2 ** 8
    static min = 0

    static inRange(n: number): boolean {
        return n >= U8.min && n <= U8.max
    }

    type: "u8" = "u8"

    inner

    constructor(n: number) {
        if (U8.inRange(n)) {
            this.inner = n
        } else {
            throw new Error("number not in rnage")
        }
    }

    get value(): number {
        return this.inner
    }
}

/**
 * 32 bits unsigned integer
 */
export class U32 {
    type: "u32" = "u32"

    inner

    constructor(bytes: [U8, U8, U8, U8] | number) {
        if (typeof bytes === "number") {
            if (bytes >= 0 && bytes <= 2 ** 32) {
                this.inner = bytes
            } else {
                throw new Error("number not in rnage")
            }
        } else {
            let val = bytes[0].value

            // TODO: BE
            val = (val << 8) | bytes[1].value
            val = (val << 8) | bytes[2].value
            val = (val << 8) | bytes[3].value

            this.inner = val
        }
    }

    get value(): number {
        return this.inner
    }
}

export class Uleb128 {
    type: "uleb128" = "uleb128"

    inner

    constructor(n: number) {
        this.inner = n
    }

    get value(): number {
        return this.inner
    }
}

export class Uleb128_33 {
    type: "uleb128_33" = "uleb128_33"

    inner

    constructor(n: number) {
        this.inner = n
    }

    get value(): number {
        return this.inner
    }
}

export class F64 {
    type: "f64" = "f64"

    inner

    constructor(n: number) {
        this.inner = n
    }

    get value(): number {
        return this.inner
    }
}

/**
 * 14 bits unsigned integer
 */
export class U14 {
    type: "u14" = "u14"

    inner

    constructor(n: number) {
        if (n >= 0 && n <= 2 ** 14) {
            this.inner = n
        } else {
            throw new Error("number not in rnage")
        }
    }

    get value(): number {
        return this.inner
    }
}

/**
 * 15 bits unsigned integer
 */
export class U15 {
    type: "u15" = "u15"

    inner

    constructor(n: number) {
        if (n >= 0 && n <= 2 ** 15) {
            this.inner = n
        } else {
            throw new Error("number not in rnage")
        }
    }

    get value(): number {
        return this.inner
    }
}

/**
 * 16 bits unsigned integer
 */
export class U16 {
    static max = 2 ** 16
    static min = 0

    static inRange(n: number): boolean {
        return n >= U16.min && n <= U16.max
    }

    type: "u16" = "u16"

    inner

    constructor(bytes: [U8, U8] | number) {
        if (typeof bytes === "number") {
            if (U16.inRange(bytes)) {
                this.inner = bytes
            } else {
                throw new Error("number not in rnage")
            }
        } else {
            let val = bytes[0].value

            // TODO: BE
            val = (val << 8) | bytes[1].value

            this.inner = val
        }
    }

    get value(): number {
        return this.inner
    }
}

/**
 * 64 bits unsigned integer
 */
export class U64 {
    type: "u64" = "u64"

    inner

    constructor(n: bigint) {
        this.inner = n
    }

    get value(): bigint {
        return this.inner
    }
}

/**
 * 64 bits signed integer
 */
export class I64 {
    type: "i64" = "i64"

    inner

    constructor(n: bigint) {
        this.inner = n
    }

    get value(): bigint {
        return this.inner
    }
}
