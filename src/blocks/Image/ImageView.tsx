import React from 'react';
import { BlockInterface } from '@/types/components/BlockInterface';
import { ImageData } from '@/blocks/Image/types/ImageData';
import { ImageSettings } from '@/blocks/Image/types/ImageSettings';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import * as CSS from 'csstype';

const useStyles = makeStyles(() => ({
  root: {
    lineHeight: 0,
  },
  img: {
    width: '100%',
    maxWidth: '100%',
    height: (props: { height: CSS.Property.Height }) => props.height,
    objectFit: 'cover',
  },
}));

const ImageView = (props: BlockInterface<ImageData, ImageSettings>): React.ReactElement => {
  const { data, settings } = props;
  const classes = useStyles({ height: settings.height });
  if (settings.maxWidth === 'full') {
    return (
      <div className={classes.root}>
        <img
          src={data.src}
          alt={data.alt}
          title={data.title}
          className={classes.img}
        />
      </div>
    );
  }
  return (
    <Container className={classes.root} maxWidth={settings.maxWidth}>
      <img
        src={data.src}
        alt={data.alt}
        title={data.title}
        className={classes.img}
      />
    </Container>
  );
};

export default ImageView;
