import React from 'react';
import { Container, Grid, TextField, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

const Section = {
  id: 'section',
  label: 'Section',
  defaultData: {
    title: '',
    body: '',
  },
  blockLabel: (data) => {
    return `Section: ${data.title}`;
  },
  view: (props) => {
    const { data } = props;
    return (
      <div>
        <Container>
          <Typography variant="h3">
            {data.title}
          </Typography>
          <ReactMarkdown>{data.body}</ReactMarkdown>
        </Container>
      </div>
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