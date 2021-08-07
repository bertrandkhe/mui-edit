export interface BlockMeta {
    changed: number,
    created: number,
}

export type RelationshipItem = {
    id: string,
    type: string,
}

export interface Relationship<D extends RelationshipItem> {
    data: D|D[],
}

export interface Block<D = any, S = any, R extends RelationshipItem = RelationshipItem> {
    id: string
    type: string
    data: D,
    settings: S,
    relationships?: Record<string, Relationship<R>>,
    meta: BlockMeta,
}
