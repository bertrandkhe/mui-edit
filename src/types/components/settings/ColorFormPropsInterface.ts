interface ColorPropsSettingsInterface {
  color?: string
  backgroundColor: string,
}

export interface ColorFormPropsInterface {
  id: Readonly<string>
  settings: Readonly<ColorPropsSettingsInterface>
  onChange(settings: ColorPropsSettingsInterface): void
  open: Readonly<boolean>
}