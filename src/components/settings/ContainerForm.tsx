import React, { ChangeEvent } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  NativeSelect,
} from '@material-ui/core';

export interface ContainerFormPropsSettings {
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  containerDisableGutters?: boolean
}

export interface ContainerFormProps {
  id: Readonly<string>,
  settings: Readonly<ContainerFormPropsSettings>
  onChange(settings: ContainerFormPropsSettings): void
  open?: Readonly<boolean>
}

interface HandleChangeArgs<V, E> {
  prop?: string
  value?(e: E): V
}

const ContainerForm: React.FunctionComponent<ContainerFormProps> = (props) => {
  const {
    id, settings, onChange, open,
  } = props;

  function handleChange<V, E extends ChangeEvent<HTMLSelectElement | HTMLInputElement>>(args?: HandleChangeArgs<V, E>) {
    const { prop, value } = args || {};
    return (e: E) => {
      onChange({
        ...settings,
        [prop || e.target.name]: value ? value(e) : e.target.value,
      });
    };
  }

  const htmlId = `container-max-width-select-${id}`;

  const sizes = [
    { value: 'xs', label: 'Extra small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra large' },
  ];

  return (
    <details open={open}>
      <summary>Container</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor={htmlId}>Max width</InputLabel>
            <NativeSelect
              inputProps={{
                defaultValue: settings.containerMaxWidth || 'lg',
                id: htmlId,
              }}
              onChange={handleChange<string, ChangeEvent<HTMLSelectElement>>()}
              name="containerMaxWidth"
            >
              {sizes.map((size) => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={settings.containerDisableGutters || false}
                onChange={handleChange<boolean, ChangeEvent<HTMLInputElement>>({
                  value: () => !settings.containerDisableGutters,
                })}
                name="containerDisableGutters"
              />
            )}
            label="Disable gutters"
          />
        </Grid>
      </Grid>
    </details>
  );
};

export default ContainerForm;
