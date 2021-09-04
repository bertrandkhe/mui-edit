import * as CSS from 'csstype';
import { TypographyVariant } from '@mui/material/styles';
import type { Descendant } from 'slate';
import SectionView from './SectionView';
import SectionSettingsForm from './SectionSettingsForm';
import SectionEditForm from './SectionEditForm';
import { BlockType } from '../../types';
import { SpacingFormPropsSettings } from '../../settings/SpacingForm';
import { ColorPropsSettings } from '../../settings/ColorForm';
import { ContainerFormPropsSettings } from '../../settings/ContainerForm';

export type SectionData = {
  title: string
  body: Descendant[],
}

export interface SectionSettings extends
  SpacingFormPropsSettings,
  ColorPropsSettings,
  ContainerFormPropsSettings {
  titleVariant: TypographyVariant
  textAlign: CSS.Property.TextAlign
}

const Section: BlockType<SectionData, SectionSettings> = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: [],
  },
  defaultSettings: {
    titleVariant: 'h3',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'left',
  },
  hasSettings: true,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: SectionView,
  settingsForm: SectionSettingsForm,
  editForm: SectionEditForm,
};

export default Section;
