import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent } from 'react';
import { EditFormProps } from 'mui-edit/types';
import BlocksControl from 'mui-edit/controls/BlocksControl';
import MediaLibraryControl, { MediaItem } from 'mui-edit/controls/MediaLibraryControl';
import { SectionData, SectionSettings } from './Section';
import Card from './Card';

const SectionEditForm: React.FunctionComponent<
  EditFormProps<SectionData, SectionSettings>
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
          <MediaLibraryControl
            label="Image"
            type="image"
            initialData={data.image ?? null}
            onChange={(newMedia: MediaItem | null) => {
              onChange((prevData) => ({
                ...prevData,
                image: newMedia,
              }));
            }}
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
        <Grid item xs={12}>
          <BlocksControl
            addBlockLabel='Add card'
            label="Cards"
            onChange={(newCards) => {
              onChange((prevData) => ({
                ...prevData,
                cards: newCards,
              }));
            }}
            data={data.cards}
            blockTypes={[Card]}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SectionEditForm;
