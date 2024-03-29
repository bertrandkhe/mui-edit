import Grid from '@mui/material/Grid';
import React from 'react';
import TextAlignControl from 'mui-edit/settings/TextAlignControl';
import TypographyVariantControl from 'mui-edit/settings/TypographyVariantControl';
import ContainerForm from 'mui-edit/settings/ContainerForm';
import SpacingForm from 'mui-edit/settings/SpacingForm';
import ColorForm from 'mui-edit/settings/ColorForm';
import { SettingsFormProps } from 'mui-edit/types';
import { SectionData, SectionSettings } from './Section';

const SectionSettingsForm: React.FunctionComponent<
  SettingsFormProps<SectionData, SectionSettings>
> = (props) => {
  const { settings, onChange, id } = props;
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextAlignControl
            id={id}
            onChange={(textAlign) => {
              onChange({
                ...settings,
                textAlign,
              });
            }}
            name="textAlign"
            label="Text align"
            defaultValue={settings.textAlign}
          />
        </Grid>
        <Grid item xs={12}>
          <TypographyVariantControl
            id={id}
            onChange={(titleVariant) => {
              onChange({
                ...settings,
                titleVariant,
              });
            }}
            name="titleVariant"
            label="Title variant"
            defaultValue={settings.titleVariant}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainerForm
            id={id}
            settings={settings}
            onChange={onChange}
            open
          />
        </Grid>
        <Grid item xs={12}>
          <SpacingForm
            id={id}
            settings={settings}
            onChange={onChange}
            spacingType="margin"
            spacings={[0, 5, 10]}
            directions={['top', 'bottom']}
            open
          />
        </Grid>
        <Grid item xs={12}>
          <SpacingForm
            id={id}
            settings={settings}
            onChange={onChange}
            spacingType="padding"
            open
          />
        </Grid>
        <Grid item xs={12}>
          <ColorForm
            settings={settings}
            onChange={onChange}
            open
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SectionSettingsForm;
