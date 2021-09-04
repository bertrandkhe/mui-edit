import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';

type Direction = 'top' | 'right' | 'bottom' | 'left';
type SpacingType = 'margin' | 'padding';

export interface SpacingFormPropsSettings {
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface SpacingFormProps {
  id: Readonly<string>
  min?: Readonly<number>
  max?: Readonly<number>
  step?: Readonly<number>
  spacings?: Readonly<number[]>
  spacingType: Readonly<SpacingType>
  directions?: Readonly<Direction[]>
  open?: Readonly<boolean>
  settings: SpacingFormPropsSettings,
  onChange(settings: SpacingFormPropsSettings): void
}

const SpacingForm: React.FunctionComponent<SpacingFormProps> = (props) => {
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
          const prop = `${spacingType}${direction[0].toUpperCase()}${direction.slice(1)}`;
          const htmlId = `${spacingType}-${direction}-select-${id}`;
          return (
            <Grid item xs={6} key={direction}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor={htmlId}>{direction}</InputLabel>
                <NativeSelect
                  inputProps={{
                    defaultValue: settings[prop as keyof SpacingFormPropsSettings],
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
