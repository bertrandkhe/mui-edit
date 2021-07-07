import React from 'react';
import { Grid, debounce, Box, Button } from '@material-ui/core';

const ColorForm = (props) => {
  const { id, settings, onChange, open } = props;
  const handleChange = (prop) => (e) => {
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
            <Box mr={1}>
              <input
                type="color"
                id={colorInputId}
                defaultValue={settings.color || '#fff'}
                onChange={debounce(handleChange('color'), 300)}
              />
            </Box>
            <Box>
              <label htmlFor={colorInputId}>Text color</label>
            </Box>
            <Box ml="auto">
              <Button
                onClick={() => {
                  document.getElementById(colorInputId).value = undefined;
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
            <Box mr={1}>
              <input
                type="color"
                id={bgColorInputId}
                defaultValue={settings.backgroundColor || '#fff'}
                onChange={debounce(handleChange('backgroundColor'), 300)}
              />
            </Box>
            <Box>
              <label htmlFor={bgColorInputId}>Background color</label>
            </Box>
            <Box ml="auto">
              <Button
                onClick={() => {
                  document.getElementById(bgColorInputId).value = undefined;
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