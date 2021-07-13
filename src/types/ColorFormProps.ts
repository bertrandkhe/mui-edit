import * as CSS from 'csstype';

export interface ColorPropsSettings {
  color?: CSS.Property.Color
  backgroundColor?: CSS.Property.BackgroundColor,
}

export interface ColorFormProps {
  id: Readonly<string>
  settings: Readonly<ColorPropsSettings>
  onChange(settings: ColorPropsSettings): void
  open?: Readonly<boolean>
}
