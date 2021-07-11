import * as CSS from 'csstype';
import { SpacingFormPropsSettingsInterface } from '@/types/components/settings/SpacingFormPropsInterface';
import { ColorPropsSettingsInterface } from '@/types/components/settings/ColorFormPropsInterface';
import { ContainerFormPropsSettingsInterface } from '@/types/components/settings/ContainerFormPropsInterface';
import { Variant } from '@material-ui/core/styles/createTypography';

export interface SectionSettingsInterface extends
  SpacingFormPropsSettingsInterface,
  ColorPropsSettingsInterface,
  ContainerFormPropsSettingsInterface {
  titleVariant: Variant
  textAlign: CSS.Property.TextAlign
}
