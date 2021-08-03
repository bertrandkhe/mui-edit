import React, { ChangeEvent } from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from '@material-ui/core';
import { ButtonItem } from '../../types/ButtonItem';

const ButtonControl = (
  props: {
    id: string,
    label: string
    defaultValue: ButtonItem,
    onChange(value: ButtonItem): void,
    open: boolean,
  },
): React.ReactElement => {
  const {
    id,
    label,
    defaultValue,
    onChange,
    open,
  } = props;

  const handleChange = (prop: keyof ButtonItem) => (
    e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>
  ) => {
    onChange({
      ...defaultValue,
      [prop]: e.target.value,
    });
  };

  return (
    <details open={open}>
      <summary>{label}</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="URL"
            className="mb-2"
            defaultValue={defaultValue.url}
            onChange={handleChange('url')}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Label"
            defaultValue={defaultValue.label}
            onChange={handleChange('label')}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor={`btn-variant-${id}`}>Variant</InputLabel>
            <NativeSelect
              defaultValue={defaultValue.variant}
              onChange={handleChange('variant')}
              inputProps={{
                id: `btn-variant-${id}`,
              }}
            >
              <option value="outlined">Outlined</option>
              <option value="contained">Contained</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </details>
  );
};

export default ButtonControl;
