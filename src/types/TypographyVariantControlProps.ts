import { Variant } from '@material-ui/core/styles/createTypography';

type Option = {
  value: Variant
  label: string
};

export interface TypographyVariantControlProps {
  id: string
  name: string
  label: string
  onChange(variant: Variant): void
  options?: Option[]
  defaultValue?: Variant
}
