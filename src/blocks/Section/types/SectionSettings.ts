import * as CSS from 'csstype';
import { SpacingFormPropsSettings } from '@/types/SpacingFormProps';
import { ColorPropsSettings } from '@/types/ColorFormProps';
import { ContainerFormPropsSettings } from '@/types/ContainerFormProps';
import { Variant } from '@material-ui/core/styles/createTypography';

export interface SectionSettings extends
  SpacingFormPropsSettings,
  ColorPropsSettings,
  ContainerFormPropsSettings {
  titleVariant: Variant
  textAlign: CSS.Property.TextAlign
}
