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

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface Block<
  D = any,
  S = any,
  ST = any,
  > {
  id: string
  type: string
  data: D,
  settings: S,
  meta: BlockMeta,
  initialState?: ST,
}
