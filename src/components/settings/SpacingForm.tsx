import React, { ChangeEvent } from 'react';
import {
  Grid, InputLabel, NativeSelect, FormControl,
} from '@material-ui/core';
import {
  SpacingFormPropsInterface,
  SpacingFormPropsSettingsInterface
} from '@/types/components/settings/SpacingFormPropsInterface';

const SpacingForm: React.FunctionComponent<SpacingFormPropsInterface> = (props) => {
  const {
    id,
    onChange,
    settings,
    min = 0,
    max = 20,
    step = 1,
    spacings: propsSpacings = [],
    spacingType,
    directions = ['top', 'right', 'bottom', 'left'],
    open,
  } = props;

  const handleChange = (prop?: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...settings,
      [prop || e.currentTarget.name]: parseInt(e.currentTarget.value, 10),
    });
  };

  const spacings = [...propsSpacings];
  if (spacings.length === 0) {
    for (let i = min; i < max; i += step) {
      spacings.push(i);
    }
  }

  return (
    <details open={open}>
      <summary>
        {spacingType[0].toUpperCase()}
        {spacingType.slice(1)}
      </summary>
      <Grid container spacing={2}>
        {directions.map((direction) => {
          const prop = `${spacingType}${direction[0].toUpperCase()}${direction.slice(1)}` as keyof SpacingFormPropsSettingsInterface;
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