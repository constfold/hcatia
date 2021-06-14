import { ByteStream } from "./bytestream"

type Fn<T> = (input: ByteStream) => T
type Fns<T> = {
    [P in keyof T]: Fn<T[P]>
}

type Nullable<T> = NonNullable<T> | undefined

export function tuple<Ts extends unknown[]>(...fs: Fns<Ts>): Fn<Ts> {
    return function (input: ByteStream) {
        const v = fs.map(function (a) {
            return a(input)
        })

        return v as Ts
    }
}

export function cond<T>(condition: boolean, f: Fn<T>): Fn<T | undefined> {
    return function (input: ByteStream) {
        if (condition) {
            return f(input)
        }
    }
}

export function take_while_null<T>(f: Fn<Nullable<T>>): Fn<T[]> {
    return function (input: ByteStream) {
        const v = []
        for (;;) {
            const val = f(input)
            if (val === undefined) {
                return v
            }
            v.push(val)
        }
    }
}

export function call<T, Arg extends unknown[]>(
    f: (input: ByteStream, ...args: Arg) => T,
    ...args: Arg
): Fn<T> {
    return function (input: ByteStream) {
        return f(input, ...args)
    }
}

export function count<T>(n: { get value(): number }, f: Fn<T>): Fn<T[]> {
    const c = n.value
    return function (input: ByteStream) {
        const v = []
        for (let i = 0; i < c; i++) {
            v.push(f(input))
        }
        return v
    }
}

export function map<T, U>(f: Fn<T>, g: (a: T) => U): Fn<U> {
    return function (input: ByteStream) {
        return g(f(input))
    }
}

export function peek<T>(f: Fn<T>): Fn<T> {
    return function (input: ByteStream) {
        return f(input)
    }
}
