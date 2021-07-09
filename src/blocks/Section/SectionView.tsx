import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { BlockInterface } from '@/types/components/BlockInterface';
import { SectionDataInterface } from '@/blocks/Section/types/SectionDataInterface';
import { SectionSettingsInterface } from '@/blocks/Section/types/SectionSettingsInterface';

const SectionView: React.FunctionComponent<BlockInterface<SectionDataInterface, SectionSettingsInterface>> = (props) => {
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
};

export default SectionView;