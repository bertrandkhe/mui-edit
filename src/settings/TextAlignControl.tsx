import React, { ChangeEvent, ReactElement } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import * as CSS from 'csstype';

export interface TextAlignControlProps {
  id: string
  label: string
  name: string
  onChange(textAlign: CSS.Property.TextAlign): void
  options?: CSS.Property.TextAlign[]
  defaultValue?: CSS.Property.TextAlign
}

const TextAlignControl = (props: TextAlignControlProps): ReactElement => {
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
      <InputLabel variant="standard" htmlFor={htmlId}>{label}</InputLabel>
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
