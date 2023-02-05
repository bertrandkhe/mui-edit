import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useState } from 'react';
import { EditFormProps } from 'mui-edit/types';
import { SectionData, SectionSettings } from './Section';
import { Button } from '@mui/material';
import Editor from 'mui-edit/Editor';
import Card from './Card';

const SectionEditForm: React.FunctionComponent<
  EditFormProps<SectionData, SectionSettings>
> = (props) => {
  const { data, onChange } = props;
  const [editingCards, setEditingCards] = useState(false);
  const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange((prevData) => ({
      ...prevData,
      [prop]: e.target.value,
    }));
  };
  return (
    <form>
      {editingCards && (
        <Editor
          onBack={() => {
            setEditingCards(false);
          }}
          onChange={(newCards) => {
            onChange((prevData) => ({
              ...prevData,
              cards: newCards,
            }));
          }}
          data={data.cards}
          blockTypes={[Card]}
        />
      )}
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
          <Button
            variant='outlined'
            onClick={() => {
              setEditingCards(true);
            }}
          >
            Edit cards
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SectionEditForm;
