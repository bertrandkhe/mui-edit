export interface Config<Data = any> {
  id: string,
  revisionId: number,
  data: Data,
}

export interface ConfigStorageAdapter {
  get<Data>(id: string): Promise<Config<Data> | null>
  delete(id: string): Promise<void>
  list(): Promise<string[]>;
  save(config: Config): Promise<typeof config>
}
