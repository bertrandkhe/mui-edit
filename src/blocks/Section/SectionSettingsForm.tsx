import { Grid } from '@material-ui/core';
import TextAlignControl from '@/components/settings/TextAlignControl';
import TypographyVariantControl from '@/components/settings/TypographyVariantControl';
import ContainerForm from '@/components/settings/ContainerForm';
import SpacingForm from '@/components/settings/SpacingForm';
import ColorForm from '@/components/settings/ColorForm';
import React from 'react';
import { SectionSettingsInterface } from '@/blocks/Section/types/SectionSettingsInterface';
import { SettingsFormPropsInterface } from '@/types/components/SettingsFormPropsInterface';
import { SectionDataInterface } from '@/blocks/Section/types/SectionDataInterface';

const SectionSettingsForm: React.FunctionComponent<SettingsFormPropsInterface<SectionDataInterface, SectionSettingsInterface>> = (props) => {
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
            id={id}
            settings={settings}
            onChange={onChange}
            open
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default SectionSettingsForm;