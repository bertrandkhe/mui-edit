import React from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import SpacingForm from '@/components/settings/SpacingForm';
import ColorForm from '@/components/settings/ColorForm';
import TextAlignInput from '@/components/settings/TextAlignInput';
import TypographyVariantInput from '@/components/settings/TypographyVariantInput';
import ContainerPropsForm from '@/components/settings/ContainerPropsForm';

const Section = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: '',
  },
  defaultSettings: {
    titleVariant: 'h3',
    paddingTop: 5,
    paddingBottom: 5,
  },
  hasSettings: true,
  blockLabel: (data) => {
    return data.title.length > 0 ? data.title : 'Unnamed section';
  },
  view: (props) => {
    const { data, settings } = props;
    return (
      <Box
        bgcolor={settings.backgroundColor}
        color={settings.color}
        mt={settings.marginTop || 0}
        mb={settings.marginBottom || 0}
        pt={settings.paddingTop || 0}
        pb={settings.paddingBottom || 0}
        textAlign={settings.textAlign}
      >
        <Container
          disableGutters={settings.containerDisableGutters}
          maxWidth={settings.containerMaxWidth}
        >
          <Typography variant={settings.titleVariant}>
            {data.title}
          </Typography>
          <ReactMarkdown>{data.body}</ReactMarkdown>
        </Container>
      </Box>
    );
  },
  settingsForm: (props) => {
    const { settings, onChange, id } = props;
    return (
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextAlignInput
              id={id}
              settings={settings}
              onChange={onChange}
              name="textAlign"
              label="Text align"
            />
          </Grid>
          <Grid item xs={12}>
            <TypographyVariantInput
              id={id}
              settings={settings}
              onChange={onChange}
              name="titleVariant"
              label="Title variant"
            />
          </Grid>
          <Grid item xs={12}>
            <ContainerPropsForm
              id={id}
              settings={settings}
              onChange={onChange}
              open
            />
          </Grid>
          <Grid item xs={12}>
            <SpacingForm
              id={id}
              settings={settings}
              onChange={onChange}
              spacingType="margin"
              spacings={[0, 5, 10]}
              directions={['top', 'bottom']}
              open
            />
          </Grid>
          <Grid item xs={12}>
            <SpacingForm
              id={id}
              settings={settings}
              onChange={onChange}
              spacingType="padding"
              open
            />
          </Grid>
          <Grid item xs={12}>
            <ColorForm
              id={id}
              settings={settings}
              onChange={onChange}
              open
            />
          </Grid>
        </Grid>
      </form>
    );
  },
  editForm: (props) => {
    const { data, onChange } = props;
    const handleChange = (prop) => (e) => {
      onChange({
        ...data,
        [prop]: e.target.value,
      })
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
  },
}

export default Section;
