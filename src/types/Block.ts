export interface BlockMeta {
  changed: number,
  created: number,
}

export type RelationshipItem = {
  id: string,
  type: string,
  meta?: any,
};

export interface Relationship<D extends RelationshipItem = RelationshipItem> {
  data: D | D[],
}

export type Relationships<D extends RelationshipItem = RelationshipItem> = Record<string, Relationship<D>>;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface Block<
  D = any,
  S = any,
  R extends Relationships = Relationships,
  ST = any,
  > {
  id: string
  type: string
  data: D,
  settings: S,
  relationships?: R,
  meta: BlockMeta,
  initialState?: ST,
}
