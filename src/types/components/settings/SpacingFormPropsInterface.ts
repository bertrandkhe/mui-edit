type Direction = 'top' | 'right' | 'bottom' | 'left';
type SpacingType = 'margin' | 'padding';

export interface SpacingFormPropsSettingsInterface {
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface SpacingFormPropsInterface {
  id: Readonly<string>
  min?: Readonly<number>
  max?: Readonly<number>
  step?: Readonly<number>
  spacings?: Readonly<number[]>
  spacingType: Readonly<SpacingType>
  directions?: Readonly<Direction[]>
  open?: Readonly<boolean>
  settings: SpacingFormPropsSettingsInterface,
  onChange(settings: SpacingFormPropsSettingsInterface): void
}