import React, { ChangeEvent, ReactElement } from 'react';
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';
import { TextAlignControlPropsInterface } from '@/types/components/settings/TextAlignControlPropsInterface';
import * as CSS from 'csstype';

const TextAlignControl = (props: TextAlignControlPropsInterface): ReactElement => {
  const {
    id,
    label,
    name,
    onChange,
    options = ['left', 'center', 'justify', 'right'],
    defaultValue = 'left',
  } = props;
  const htmlId = `${name}-select-${id}`;
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as CSS.Property.TextAlign);
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
        name={name}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default TextAlignControl;
