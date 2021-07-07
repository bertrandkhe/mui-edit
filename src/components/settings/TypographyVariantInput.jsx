import React from 'react';
import { FormControl, InputLabel, NativeSelect, Typography } from '@material-ui/core';

const TypographyVariantInput = (props) => {
  const {
    id,
    name,
    onChange,
    settings,
    label,
    options = [
      { value: 'h1', label: 'Title 1' },
      { value: 'h2', label: 'Title 2' },
      { value: 'h3', label: 'Title 3' },
      { value: 'h4', label: 'Title 4' },
      { value: 'h5', label: 'Title 5' },
      { value: 'h6', label: 'Title 6' },
      { value: 'subtitle1', label: 'Subtitle 1' },
      { value: 'subtitle2', label: 'Subtitle 2' },
      { value: 'body1', label: 'Body 1' },
      { value: 'body2', label: 'Body 2' },
    ],
  } = props;
  const htmlId = `${name}-select-${id}`;
  const handleChange = (prop) => (e) => {
    onChange({
      ...settings,
      [prop || e.currentTarget.name]: e.currentTarget.value,
    });
  };
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={htmlId}>{label}</InputLabel>
      <NativeSelect
        inputProps={{
          defaultValue: settings[name],
          id: htmlId,
        }}
        onChange={handleChange()}
        name="titleVariant"
      >
        {options.map((option) => (
          <Typography component="option" value={option.value} variant={option.value} key={option.value}>
            {option.label}
          </Typography>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default TypographyVariantInput;