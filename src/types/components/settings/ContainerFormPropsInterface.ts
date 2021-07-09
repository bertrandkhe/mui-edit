export interface ContainerFormPropsSettingsInterface {
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  containerDisableGutters?: boolean
}

export interface ContainerFormPropsInterface {
  id: Readonly<string>,
  settings: Readonly<ContainerFormPropsSettingsInterface>
  onChange(settings: ContainerFormPropsSettingsInterface): void
  open?: Readonly<boolean>
}