import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import clsx from 'clsx';
import {
  denyAllPermissions,
  Object as FileBrowserObject,
  ObjectMeta
} from '@bertrandkhe/file-browser';
import useSortable from '../../utils/useSortable';
import FileBrowserDialog, { FileBrowserDialogProps } from './FileBrowserDialog';
import { useQuery } from '@tanstack/react-query';
import { useObjectStorage } from '../../store';

const PREFIX = 'MediaControl';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  media: `${PREFIX}-media`,
  mediaThumbnail: `${PREFIX}-mediaThumbnail`,
  mediaImg: `${PREFIX}-mediaImg`,
  mediaName: `${PREFIX}-mediaName`,
  mediaActions: `${PREFIX}-mediaActions`,
  mediaActionBtn: `${PREFIX}-mediaActionBtn`,
  mediaActionIcon: `${PREFIX}-mediaActionIcon`,
  help: `${PREFIX}-help`,
  required: `${PREFIX}-required`,
  loader: `${PREFIX}-loader`,
};

const Root = styled(Container)((
  {
    theme,
  },
) => ({
  '*': {
    boxSizing: 'border-box',
  },

  [`&.${classes.root}`]: {
    border: '1px solid #eee',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    marginLeft: 0,
    padding: theme.spacing(2),
    fontSize: theme.typography.fontSize,
    position: 'relative',
  },

  [`& .${classes.media}`]: {
    border: '1px solid #eee',
    position: 'relative',
    cursor: 'move',
  },

  [`& .${classes.mediaThumbnail}`]: {
    width: '100%',
    height: 100,
    padding: theme.spacing(1),
    background: '#eee',
    position: 'relative',
    textAlign: 'center',
  },

  [`& .${classes.mediaImg}`]: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  [`& .${classes.mediaName}`]: {
    borderTop: '1px solid #eee',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    lineHeight: theme.spacing(3),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.mediaActions}`]: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    left: 0,
    top: 0,
    width: '100%',
    padding: 4,
  },

  [`& .${classes.mediaActionBtn}`]: {
    padding: 3,
    minWidth: 0,
    borderRadius: '100%',
  },

  [`& .${classes.mediaActionIcon}`]: {
    width: 16,
    height: 16,
  },

  [`& .${classes.help}`]: {
    marginTop: theme.spacing(1),
  },

  [`& .${classes.required}`]: {
    color: theme.palette.error.main,
  },
  [`& .${classes.loader}`]: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    background: 'rgba(255, 255, 255, 0.5)',
  },
}));

export type MediaType = 'image' | 'document' | 'video';

export type MediaItem = FileBrowserObject & {
  meta?: ObjectMeta,
}

type MediaControlData<Cardinality extends number> = Cardinality extends 1
  ? MediaItem | null
  : MediaItem[]

type MediaControlProps<Cardinality extends number = number> = {
  cardinality?: Cardinality,
  onChange(arg: MediaControlData<Cardinality>): void,
  initialData: MediaControlData<Cardinality>,
  type?: MediaType,
  label: React.ReactNode,
  required?: boolean,
  permissions?: FileBrowserDialogProps['permissions'],
  mediaGridItemSize?: {
    xs?: number,
    sm?: number,
    md?: number,
    lg?: number,
    xl?: number,
  },
};

const extensionsByType: Record<MediaType, string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
  video: ['.mp4', '.webm'],
  document: ['.pdf', '.docx', '.doc', '.txt'],
};

const MediaControlItem: React.FC<{
  media: MediaItem,
  type: MediaControlProps['type'],
  size: MediaControlProps['mediaGridItemSize'],
  onRemove(mediaId: string): void,
}> = (props) => {
  const { media, type, size, onRemove } = props;
  const storage = useObjectStorage();
  const mediaUrlQuery = useQuery({
    queryKey: ['mediaUrl', media.id],
    queryFn() {
      if (!storage) {
        throw new Error('ObjectStorage is not defined');
      }
      if (type === 'image') {
        return storage.imagePreviewUrl({
          key: media.key,
          width: 144,
        });
      }
      return storage.objectUrl({ key: media.key });
    },
  });

  return (
    <Grid
      key={media.id}
      data-id={media.id}
      {...size}
      item
    >
      <div className={clsx(classes.media, 'sortable-item')}>
        <div className={classes.mediaThumbnail}>
          {type === 'image' && mediaUrlQuery.data && (
            <img
              src={mediaUrlQuery.data}
              className={classes.mediaImg}
            />
          )}
          {type === 'image' && !mediaUrlQuery.data && !mediaUrlQuery.isError && (
            <CircularProgress size={24} />
          )}
        </div>
        <div className={classes.mediaName}>
          {media.name}
        </div>
        <div className={classes.mediaActions}>
          <Button
            className={classes.mediaActionBtn}
            aria-label='Delete'
            color='primary'
            variant='contained'
            size='small'
            onClick={() => onRemove(media.id)}
          >
            <DeleteOutline className={classes.mediaActionIcon} />
          </Button>
        </div>
      </div>
    </Grid>
  );
}

const MediaControl = <
  Cardinality extends number = 1,
  Data extends MediaControlData<Cardinality> = MediaControlData<Cardinality>,
>(
  props: MediaControlProps<Cardinality>
): JSX.Element => {
  const {
    type,
    cardinality = 1 as Cardinality,
    onChange,
    initialData,
    label,
    required,
    permissions: propsPermissions,
    mediaGridItemSize = { xs: 6 },
  } = props;
  const allowedExtensions = useMemo(() => {
    if (type) {
      return extensionsByType[type];
    }
    return [];
  }, [type]);
  const permissions = useMemo(() => {
    if (propsPermissions) {
      return propsPermissions;
    }
    return {
      ...denyAllPermissions,
      canUpload: true,
      canMkdir: true,
    };
  }, [propsPermissions]);
  const initialDataArray: MediaItem[] = useMemo(() => {
    if (!initialData) {
      return [];
    }
    return Array.isArray(initialData) ? initialData : [initialData];
  }, [initialData]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<MediaItem[]>(initialDataArray);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [loading, setLoading] = useState(false);

  const remaining = cardinality - data.length;

  const addMedias = async (medias: MediaItem[]) => {
    setData([
      ...data,
      ...medias.filter((newMedia) => !data.find((m) => m.id === newMedia.id)),
    ]);
    return;
  };

  const sortable = useSortable({
    disabled: data.length <= 1,
    onUpdate(_, instance) {
      const ids = instance.toArray();
      if (!ids) {
        return;
      }
      setData(ids.map((id) => {
        return dataRef.current.find((datum) => datum.id === id) as MediaItem;
      }));
    },
  });

  const removeMedia = (mediaId: string) => {
    setData(data.filter((m) => {
      if (m.id === mediaId) {
        return false;
      }
      return true;
    }));
  };

  useEffect(() => {
    const initialIds = initialDataArray.map((m) => m.id).join(',');
    const ids = data.map((m) => m.id).join(',');
    if (initialIds === ids) {
      return;
    }
    if (cardinality > 1 || cardinality < 0) {
      onChange(data as Data);
    } else if (data.length >= 1) {
      onChange(data[0] as Data);
    } else {
      onChange(null as Data);
    }
  }, [cardinality, data, initialDataArray, onChange]);

  return (
    <Root className={classes.root} disableGutters>
      <Grid container spacing={2}>
        <FileBrowserDialog
          allowedExtensions={allowedExtensions}
          cardinality={remaining}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSelect={addMedias}
          permissions={permissions}
        />
        <Grid item xs={12} className={classes.header}>
          <Typography variant='body1' component='span'>
            {label}
          </Typography>
          {required && <Typography variant='body1' component='span' className={classes.required}>*</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            ref={sortable.containerRef}
          >
            {loading && (
              <div className={classes.loader}>
                <CircularProgress size={24} />
              </div>
            )}
            {data.map((media) => {
              return (
                <MediaControlItem
                  media={media}
                  onRemove={removeMedia}
                  size={mediaGridItemSize}
                  type={type}
                  key={media.id}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => setOpen(true)}
            disabled={remaining === 0 || loading}
            color='primary'
            variant='outlined'
            size='small'
          >
            Select media
          </Button>
          {cardinality >= 1 && (
            <Typography className={classes.help} variant='caption' component='p'>
              {remaining <= 0 && 'The maximum number of media items have been selected.'}
              {remaining === 1 && 'One media item remaining.'}
              {remaining > 1 && `${remaining} media items remaining.`}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Root>
  );
};

export default MediaControl;
