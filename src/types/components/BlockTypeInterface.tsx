export interface BlockTypeInterface<D,S> {
    id: string,
    label: string,
    hasSettings: boolean,
    defaultData: D,
    defaultSettings: S,
}
