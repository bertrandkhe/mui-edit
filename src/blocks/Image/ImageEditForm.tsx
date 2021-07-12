import React, { ChangeEvent } from 'react';
import { EditFormPropsInterface } from '@/types/components/EditFormPropsInterface';
import { ImageData } from '@/blocks/Image/types/ImageData';
import { ImageSettings } from '@/blocks/Image/types/ImageSettings';
import { Grid, TextField } from '@material-ui/core';

const ImageEditForm = (uploadFn: (f: Blob) => Promise<string>) => (
  (props: EditFormPropsInterface<ImageData, ImageSettings>): React.ReactElement => {
    const { data, onChange } = props;

    const handleChange = (prop: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      onChange({
        ...data,
        [prop]: e.target.value,
      });
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      if (!e.target.files) {
        return;
      }
      const src = await uploadFn(e.target.files[0]);
      onChange({
        ...data,
        src,
      });
    };

    return (
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input
              required
              onChange={handleFileChange}
              accept="image/*"
              type="file"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              required
              defaultValue={data.title}
              label="Title"
              onChange={handleChange('title')}
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
    );
  }
);

export default ImageEditForm;
