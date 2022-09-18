import React, { AllHTMLAttributes, ChangeEvent, HTMLAttributes } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';

export type ButtonItem = {
  variant: 'outlined' | 'contained' | 'text',
  url: string,
  target?: AllHTMLAttributes<HTMLAnchorElement>['target'],
  label: string,
};

const ButtonControl = (
  props: {
    label: string
    defaultValue: ButtonItem,
    onChange(value: ButtonItem): void,
    open: boolean,
  },
): React.ReactElement => {
  const {
    label,
    defaultValue,
    onChange,
    open,
  } = props;

  const handleChange = (prop: keyof ButtonItem) => (
    e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>,
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
          <FormControl fullWidth>
            <InputLabel>Target</InputLabel>
            <NativeSelect
              defaultValue={defaultValue.target}
              onChange={handleChange('target')}
              fullWidth
            >
              <option value="_self">Open in same tab</option>
              <option value="_blank">Open in new tab</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Variant</InputLabel>
            <NativeSelect
              defaultValue={defaultValue.variant}
              onChange={handleChange('variant')}
              fullWidth
            >
              <option value="text">Text</option>
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
