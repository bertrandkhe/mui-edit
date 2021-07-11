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

export type BlockData<D = Record<string, unknown>> = D
export type BlockSettings<S = Record<string, unknown>> = S
export type Block = BlockInterface<BlockData, BlockSettings>
