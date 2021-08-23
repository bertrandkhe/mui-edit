import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import type { Descendant } from 'slate';
import { ViewProps } from '../../types';
import { SectionData, SectionSettings } from './Section';
import EditableComponent from '../../EditableComponent';
import RichTextControl from '../../RichTextControl';

const SectionView: React.FunctionComponent<
  ViewProps<SectionData, SectionSettings>
> = (props) => {
  const {
    data, settings, onDataChange, contentEditable,
  } = props;
  console.log(data.body);

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
        <RichTextControl
          inline
          value={data.body}
          onChange={(newBody: Descendant[]) => {
            if (!onDataChange) {
              return;
            }
            onDataChange({
              ...data,
              body: newBody,
            });
          }}
        />
      </Container>
    </Box>
  );
};

export default SectionView;
