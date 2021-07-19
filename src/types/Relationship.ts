export interface Relationship<D = any> {
  data: D,
  links: {
    self: string,
  },
}
