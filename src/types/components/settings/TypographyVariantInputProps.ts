type Option = {
  value: string
  label: string
};

interface TypographyVariantInputPropsSettings {
  [key: string]: string
}

export interface TypographyVariantInputProps {
  id: string
  name: string
  label: string
  options: Option[]
  settings: TypographyVariantInputPropsSettings
  onChange(settings: TypographyVariantInputPropsSettings): void
}