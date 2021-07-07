import React from 'react';
import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';

const TextAlignInput = (props) => {
  const {
    id,
    label,
    name,
    settings,
    onChange,
    options = ['left', 'center', 'justify', 'right'],
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
          defaultValue: settings[name] || 'left',
          id: htmlId,
        }}
        onChange={handleChange()}
        name={name}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default TextAlignInput;