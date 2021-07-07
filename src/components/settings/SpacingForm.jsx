import React from 'react';
import { Grid, InputLabel, NativeSelect, FormControl } from '@material-ui/core';

const SpacingForm = (props) => {
  const {
    id,
    onChange,
    settings,
    min = 0,
    max = 20,
    step = 1,
    spacings = [],
    spacingType,
    directions = ['top', 'right', 'bottom', 'left'],
    open,
  } = props;

  const handleChange = (prop) => (e) => {
    onChange({
      ...settings,
      [prop || e.currentTarget.name]: parseInt(e.currentTarget.value, 10),
    });
  };
  if (spacings.length === 0) {
    for (let i = min; i < max; i += step) {
      spacings.push(i);
    }
  }

  return (
    <details open={open}>
      <summary>{spacingType[0].toUpperCase()}{spacingType.slice(1)}</summary>
      <Grid container spacing={2}>
        {directions.map((direction) => {
          const prop = `${spacingType}${direction[0].toUpperCase()}${direction.slice(1)}`;
          const htmlId = `${spacingType}-${direction}-select-${id}`;
          return (
            <Grid item xs={6} key={direction}>
              <FormControl fullWidth>
                <InputLabel htmlFor={htmlId}>{direction}</InputLabel>
                <NativeSelect
                  inputProps={{
                    defaultValue: settings[prop],
                    id: htmlId,
                  }}
                  onChange={handleChange()}
                  name={prop}
                >
                  {spacings.map((spacing) => (
                    <option key={spacing} value={spacing}>{spacing}</option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </details>
  );
};

export default SpacingForm;