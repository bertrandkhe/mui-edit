import { Grid, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { EditFormProps } from '@/types/EditFormProps';
import { SectionData } from '@/blocks/Section/types/SectionData';
import { SectionSettings } from '@/blocks/Section/types/SectionSettings';

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
            defaultValue={data.title}
            label="Title"
            onChange={handleChange('title')}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            required
            defaultValue={data.body}
            label="Body"
            onChange={handleChange('body')}
            fullWidth
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SectionEditForm;
