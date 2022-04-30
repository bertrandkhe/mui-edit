import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ViewProps } from '../../types';
import { SectionData, SectionSettings } from './Section';
import EditableComponent from '../../EditableComponent';

const SectionView: React.FunctionComponent<
  ViewProps<SectionData, SectionSettings>
> = (props) => {
  const {
    data, settings, onDataChange, contentEditable,
  } = props;

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
        <EditableComponent
          contentEditable={contentEditable}
          component={Typography}
          variant={settings.titleVariant}
          onContentChange={(newTitle: string) => {
            if (onDataChange) {
              onDataChange({
                ...data,
                title: newTitle,
              });
            }
          }}
        >
          {data.title}
        </EditableComponent>
      </Container>
    </Box>
  );
};

export default SectionView;
