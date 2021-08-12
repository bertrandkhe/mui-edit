import React, { ChangeEvent, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import { useEditorContext } from '../EditorContextProvider';

export type LinkItem = {
  url: string
  label: string
  target: '_self' | '_blank',
};

type LinkControlProps = {
  id?: string,
  label: string
  defaultValue: LinkItem,
  onChange(value: LinkItem): void,
  open: boolean,
};

const LinkControl: React.FunctionComponent<LinkControlProps> = (props) => {
  const {
    id,
    label,
    defaultValue,
    onChange,
    open,
  } = props;
  const context = useEditorContext();
  const [htmlId] = useState(id || context.generateId());

  const handleChange = (prop: keyof LinkItem) => (
    e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>,
  ) => {
    onChange({
      ...defaultValue,
      [prop]: e.target.value,
    });
  };

  const targetHtmlId = `link-target-${htmlId}`;

  return (
    <details open={open}>
      <summary>{label}</summary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="URL"
            className="mb-2"
            defaultValue={defaultValue.url}
            onChange={handleChange('url')}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Label"
            defaultValue={defaultValue.label}
            onChange={handleChange('label')}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor={targetHtmlId}>Target</InputLabel>
            <NativeSelect
              id={targetHtmlId}
              defaultValue={defaultValue.target}
              onChange={handleChange('target')}
              fullWidth
            >
              <option value="_self">Open in same tab</option>
              <option value="_blank">Open in new tab</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </details>
  );
};

export default LinkControl;
