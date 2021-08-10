import * as CSS from 'csstype';
import { Variant } from '@material-ui/core/styles/createTypography';
import SectionView from './SectionView';
import SectionSettingsForm from './SectionSettingsForm';
import SectionEditForm from './SectionEditForm';
import { BlockType } from '../../types';
import { SpacingFormPropsSettings } from '../../components/settings/SpacingForm';
import { ColorPropsSettings } from '../../components/settings/ColorForm';
import { ContainerFormPropsSettings } from '../../components/settings/ContainerForm';

export type SectionData = {
  title: string
  body: string
}

export interface SectionSettings extends
  SpacingFormPropsSettings,
  ColorPropsSettings,
  ContainerFormPropsSettings {
  titleVariant: Variant
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
  hasSettings: true,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: SectionView,
  settingsForm: SectionSettingsForm,
  editForm: SectionEditForm,
};

export default Section;
