import React, { ChangeEvent, ReactElement } from 'react';
import {
  FormControl,
  InputLabel,
  NativeSelect,
  Typography,
} from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import {
  TypographyVariantControlProps,
} from '../../types/TypographyVariantControlProps';

const TypographyVariantControl = (props: TypographyVariantControlProps): ReactElement => {
  const {
    id,
    name,
    onChange,
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
    defaultValue,
  } = props;
  const htmlId = `${name}-select-${id}`;
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as Variant);
  };
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={htmlId}>{label}</InputLabel>
      <NativeSelect
        inputProps={{
          defaultValue,
          id: htmlId,
        }}
        onChange={handleChange}
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

export default TypographyVariantControl;
