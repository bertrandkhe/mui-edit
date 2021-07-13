import React, { ChangeEvent } from 'react';
import { SettingsFormProps } from '@/types/SettingsFormProps';
import { ImageData } from '@/blocks/Image/types/ImageData';
import { ImageSettings } from '@/blocks/Image/types/ImageSettings';
import {
  FormControl,
  Grid,
  InputLabel,
  NativeSelect, TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as CSS from 'csstype';
import SpacingForm from '@/components/settings/SpacingForm';

const ImageSettingsForm = (props: SettingsFormProps<ImageData, ImageSettings>): React.ReactElement => {
  const {
    id, settings, onChange,
  } = props;

  const handleChange = <E extends HTMLSelectElement|HTMLInputElement, >(prop: string) => (e: ChangeEvent<E>) => {
    onChange({
      ...settings,
      [prop]: e.target.value,
    });
  };

  const sizes = [
    { value: 'xs', label: 'Extra small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra large' },
    { value: 'full', label: 'Full width' },
  ];

  const htmlId = (name: string): string => `image-${name}-${id}`;

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor={htmlId('maxWidth')}>
              Max width
            </InputLabel>
            <NativeSelect
              inputProps={{
                defaultValue: settings.maxWidth || 'lg',
                id: htmlId('maxWidth'),
              }}
              onChange={handleChange<HTMLSelectElement>('maxWidth')}
            >
              {sizes.map((size) => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={['initial', 'auto', '25vh', '50vh', '75vh', '100vh']}
            onChange={(e, value) => {
              onChange({ ...settings, height: value as CSS.Property.Height });
            }}
            value={settings.height as string}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label="Height" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <SpacingForm
            id={id}
            spacingType="margin"
            settings={settings}
            onChange={onChange}
            directions={['top', 'bottom']}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default ImageSettingsForm;
