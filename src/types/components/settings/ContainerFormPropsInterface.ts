interface ContainerFormPropsSettingsInterface {
  containerMaxWidth?: string
  containerDisableGutters?: boolean
}

export interface ContainerFormPropsInterface {
  id: Readonly<string>,
  settings: Readonly<ContainerFormPropsSettingsInterface>
  onChange(settings: ContainerFormPropsSettingsInterface): void
  open: Readonly<boolean>
}