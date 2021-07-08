import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  NativeSelect,
} from '@material-ui/core';

const ContainerPropsForm = (props) => {
  const {
    id, settings, onChange, open,
  } = props;
  const handleChange = ({ prop, readValue } = {}) => (e) => {
    onChange({
      ...settings,
      [prop || e.target.name]: readValue ? readValue(e) : e.target.value,
    });
  };

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
              onChange={handleChange()}
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
                onChange={handleChange({
                  readValue: () => !settings.containerDisableGutters,
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

export default ContainerPropsForm;
