export interface BlockMeta {
    changed: number,
    created: number,
}

export interface BlockInterface<D, S> {
    id: string
    type: string
    data: D,
    settings: S,
    meta: BlockMeta,
}

export type Block = BlockInterface<any, any>
