import { U8 } from "./primitive"

export interface ByteStream {
    take_one(): U8
    take(n: number): Uint8Array
    get end(): boolean
}
