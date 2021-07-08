export interface BlockMeta {
    changed: number,
    created: number,
}

export interface BlockDataInterface {

}

export interface BlockSettingsInterface {

}

export interface BlockInterface<D, S> {
    id: string
    type: string
    data: D,
    settings: S,
    meta: BlockMeta,
}