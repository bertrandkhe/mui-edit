
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent } from 'react';
import { EditFormProps } from 'mui-edit/types';
import { CardData, CardSettings } from './Card';
import MediaControl from 'mui-edit/controls/MediaLibraryControl/MediaLibraryControl';

const CardEditForm: React.FunctionComponent<
  EditFormProps<CardData, CardSettings>
> = (props) => {
  const { data, onChange } = props;
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange((prevData) => ({
      ...prevData,
      [prop]: e.target.value,
    }));
  };
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MediaControl
            initialData={data.image || null}
            onChange={(newImage) => {
              onChange({
                ...data,
                image: newImage
              })
            }}
            label='Image'
            type='image'
            required
          />
        </Grid>
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
          <TextField
            required
            value={data.body}
            label="Body"
            onChange={handleChange('body')}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CardEditForm;
