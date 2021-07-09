export interface TextAlignInputPropsSettingsInterface {
  [key: string]: string
}

export interface TextAlignInputPropsInterface {
  id: string
  label: string
  name: string
  settings: TextAlignInputPropsSettingsInterface
  onChange(settings: TextAlignInputPropsSettingsInterface): void
  options: string[]
}