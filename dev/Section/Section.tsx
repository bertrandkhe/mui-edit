import * as CSS from 'csstype';
import { TypographyVariant } from '@mui/material/styles';
import { BlockType } from 'mui-edit/types';
import { SpacingFormPropsSettings } from 'mui-edit/settings/SpacingForm';
import { ColorPropsSettings } from 'mui-edit/settings/ColorForm';
import { ContainerFormPropsSettings } from 'mui-edit/settings/ContainerForm';
import SectionView from './SectionView';
import SectionSettingsForm from './SectionSettingsForm';
import SectionEditForm from './SectionEditForm';

export type SectionData = {
  title: string
  body: string,
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
    body: '',
  },
  defaultSettings: {
    titleVariant: 'h3',
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'left',
  },
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: SectionView,
  settingsForm: SectionSettingsForm,
  editForm: SectionEditForm,
  cardinality: 20,
};

export default Section;
