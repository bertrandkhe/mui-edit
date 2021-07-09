import * as CSS from 'csstype';

export interface TextAlignControlPropsInterface {
  id: string
  label: string
  name: string
  onChange(textAlign: CSS.Property.TextAlign): void
  options?: CSS.Property.TextAlign[]
  defaultValue?: CSS.Property.TextAlign
}