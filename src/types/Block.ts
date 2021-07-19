import { Relationship } from './Relationship';

export interface BlockMeta {
    changed: number,
    created: number,
}

export interface Block<D = any, S = any> {
    id: string
    type: string
    data: D,
    settings: S,
    relationships?: Record<string, Relationship>,
    meta: BlockMeta,
}
