import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, { ChangeEvent } from 'react';
import type { Descendant } from 'slate';
import { EditFormProps } from '../../types';
import { SectionData, SectionSettings } from './Section';
import RichTextControl from '../../RichTextControl';

const SectionEditForm: React.FunctionComponent<
  EditFormProps<SectionData, SectionSettings>
> = (props) => {
  const { data, onChange } = props;
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [prop]: e.target.value,
    });
  };
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            value={data.title}
            label="Title"
            onChange={handleChange('title')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <RichTextControl
            value={data.body}
            onChange={(newBody: Descendant[]) => {
              onChange({
                ...data,
                body: newBody,
              });
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SectionEditForm;
