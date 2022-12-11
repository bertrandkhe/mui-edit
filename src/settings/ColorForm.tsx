import React, { ChangeEvent, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { debounce } from '@mui/material/utils';
import * as CSS from 'csstype';

const PREFIX = 'ColorForm';

const classes = {
  label: `${PREFIX}-label`,
};

const Root = styled('details')((
  {
    theme,
  },
) => ({
  [`.${classes.label}`]: {
    marginLeft: theme.spacing(1),
  },
}));

export interface ColorPropsSettings {
  color?: CSS.Property.Color
  backgroundColor?: CSS.Property.BackgroundColor,
}

export interface ColorFormProps {
  settings: Readonly<ColorPropsSettings>
  onChange(settings: ColorPropsSettings): void
  open?: Readonly<boolean>
}

const ColorForm: React.FunctionComponent<ColorFormProps> = (props) => {
  const {
    settings, onChange, open,
  } = props;

  const colorElRef = useRef<HTMLInputElement | null>(null);
  const bgColorElRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      [prop || e.target.name]: e.target.value,
    });
  };

  return (
    <Root open={open}>
      <summary>Color</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" mt={2} alignItems="center">
            <Box component="label" display="flex" alignItems="center">
              <input
                ref={colorElRef}
                type="color"
                defaultValue={settings.color || '#fff'}
                onChange={debounce(handleChange('color'), 300)}
              />
              <span className={classes.label}>Text color</span>
            </Box>
            <Box ml="auto">
              <Button
                onClick={() => {
                  if (colorElRef.current !== null) {
                    colorElRef.current.value = '';
                  }
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
            <Box component="label" display="flex" alignItems="center">
              <input
                ref={bgColorElRef}
                type="color"
                defaultValue={settings.backgroundColor || '#fff'}
                onChange={debounce(handleChange('backgroundColor'), 300)}
              />
              <span className={classes.label}>Background color</span>
            </Box>
            <Box ml="auto">
              <Button
                onClick={() => {
                  if (bgColorElRef.current !== null) {
                    bgColorElRef.current.value = '';
                  }
                  onChange({ ...settings, backgroundColor: undefined });
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Root>
  );
};

export default ColorForm;
