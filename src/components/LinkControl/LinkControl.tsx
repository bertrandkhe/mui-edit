import React, { ChangeEvent } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { LinkItem } from '../../types/LinkItem';

const LinkControl = (
  props: {
    label: string
    defaultValue: LinkItem,
    onChange(value: LinkItem): void,
    open: boolean,
  },
): React.ReactElement => {
  const {
    label,
    defaultValue,
    onChange,
    open,
  } = props;

  const handleChange = (prop: keyof LinkItem) => (e: ChangeEvent<HTMLInputElement>) => {
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
      </Grid>
    </details>
  );
};

export default LinkControl;
