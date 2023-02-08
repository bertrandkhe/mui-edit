import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ViewProps } from 'mui-edit/types';
import { SectionData, SectionSettings } from './Section';

const SectionView: React.FunctionComponent<
  ViewProps<SectionData, SectionSettings>
> = (props) => {
  const {
    data,
    onDataChange,
  } = props;

  return (
    <Box>
      <Container>
        <Typography
          component="h1"
          variant="h2"
          whiteSpace="pre"
          onBlur={(ev) => {
            const newValue = ev.target.innerHTML;
            if (!newValue || newValue.length === 0) {
              ev.target.textContent = data.title;
              return;
            }
            onDataChange({
              ...data,
              title: newValue,
            });
          }}
          contentEditable
        >
          {data.title}
        </Typography>
        <Typography
          sx={{
            whiteSpace: 'pre-line',
          }}
          variant="body1"
        >
          {data.body}
        </Typography>
        {data.cards.length > 0 && (
          <Box
            mt={2}
            display="inline-flex"
            width="100%"
            overflow="auto"
          >
            {data.cards.map((card) => {
              return (
                <Box width={250} p={2}>
                  <Typography variant="h3">
                    {card.data.title}
                  </Typography>
                  <Typography mt={1}>
                    {card.data.body}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SectionView;
