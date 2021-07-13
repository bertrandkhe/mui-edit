export interface ContainerFormPropsSettings {
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  containerDisableGutters?: boolean
}

export interface ContainerFormProps {
  id: Readonly<string>,
  settings: Readonly<ContainerFormPropsSettings>
  onChange(settings: ContainerFormPropsSettings): void
  open?: Readonly<boolean>
}
