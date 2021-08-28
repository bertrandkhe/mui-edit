import React, { ChangeEvent, useRef, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { debounce } from '@material-ui/core/utils';
import * as CSS from 'csstype';
import { useEditorContext } from '../EditorContextProvider';

const PREFIX = 'ColorForm';

const classes = {
  label: `${PREFIX}-label`,
};

const Root = styled('details')((
  {
    theme,
  },
) => ({
  [`& .${classes.label}`]: {
    marginLeft: theme.spacing(1),
  },
}));

export interface ColorPropsSettings {
  color?: CSS.Property.Color
  backgroundColor?: CSS.Property.BackgroundColor,
}

export interface ColorFormProps {
  id?: Readonly<string>
  settings: Readonly<ColorPropsSettings>
  onChange(settings: ColorPropsSettings): void
  open?: Readonly<boolean>
}

const ColorForm: React.FunctionComponent<ColorFormProps> = (props) => {
  const {
    id, settings, onChange, open,
  } = props;
  const editorContext = useEditorContext();

  const colorElRef = useRef<HTMLInputElement|null>(null);
  const bgColorElRef = useRef<HTMLInputElement|null>(null);
  const [htmlId] = useState(id || editorContext.generateId());
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      [prop || e.target.name]: e.target.value,
    });
  };
  const colorInputId = `color-input-${htmlId}`;
  const bgColorInputId = `backgroundColor-input-${htmlId}`;

  return (
    <Root open={open}>
      <summary>Color</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" mt={2} alignItems="center">
            <label htmlFor={colorInputId}>
              <input
                ref={colorElRef}
                type="color"
                id={colorInputId}
                defaultValue={settings.color || '#fff'}
                onChange={debounce(handleChange('color'), 300)}
              />
              <span className={classes.label}>Text color</span>
            </label>
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
            <label htmlFor={bgColorInputId}>
              <input
                ref={bgColorElRef}
                type="color"
                id={bgColorInputId}
                defaultValue={settings.backgroundColor || '#fff'}
                onChange={debounce(handleChange('backgroundColor'), 300)}
              />
              <span className={classes.label}>Background color</span>
            </label>
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
