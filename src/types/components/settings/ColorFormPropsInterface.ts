import * as CSS from 'csstype';

export interface ColorPropsSettingsInterface {
  color?: CSS.Property.Color
  backgroundColor?: CSS.Property.BackgroundColor,
}

export interface ColorFormPropsInterface {
  id: Readonly<string>
  settings: Readonly<ColorPropsSettingsInterface>
  onChange(settings: ColorPropsSettingsInterface): void
  open?: Readonly<boolean>
}