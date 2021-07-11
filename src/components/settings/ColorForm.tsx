import React, { ChangeEvent } from 'react';
import {
  Grid,
  debounce,
  Box,
  Button,
} from '@material-ui/core';
import { ColorFormPropsInterface } from '@/types/components/settings/ColorFormPropsInterface';

const ColorForm: React.FunctionComponent<ColorFormPropsInterface> = (props) => {
  const {
    id, settings, onChange, open,
  } = props;
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      [prop || e.target.name]: e.target.value,
    });
  };

  const colorInputId = `color-input-${id}`;
  const bgColorInputId = `backgroundColor-input-${id}`;

  return (
    <details open={open}>
      <summary>Color</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" mt={2} alignItems="center">
            <label htmlFor={colorInputId}>
              <input
                type="color"
                id={colorInputId}
                defaultValue={settings.color || '#fff'}
                onChange={debounce(handleChange('color'), 300)}
              />
              Text color
            </label>
            <Box ml="auto">
              <Button
                onClick={() => {
                  const colorInput = document.getElementById(colorInputId) as HTMLInputElement;
                  colorInput.value = '';
                  onChange({ ...settings, color: undefined });
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <label htmlFor={bgColorInputId}>
              <input
                type="color"
                id={bgColorInputId}
                defaultValue={settings.backgroundColor || '#fff'}
                onChange={debounce(handleChange('backgroundColor'), 300)}
              />
              Background color
            </label>
            <Box ml="auto">
              <Button
                onClick={() => {
                  const bgColorInputElement = document.getElementById(bgColorInputId) as HTMLInputElement;
                  bgColorInputElement.value = '';
                  onChange({ ...settings, backgroundColor: undefined });
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </details>
  );
};

export default ColorForm;
