import * as CSS from 'csstype';
import { SpacingFormPropsSettings } from '@/types/SpacingFormProps';

export type ImageSettings = {
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full',
  height: CSS.Property.Height
} & SpacingFormPropsSettings
