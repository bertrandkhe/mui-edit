import React, {
  ChangeEvent, useState, useEffect, useRef,
} from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DragHandle from '@mui/icons-material/DragHandle';
import { FileItem } from './index';
import FileImage from './FileImage';

const PREFIX = 'FileUploadControl';

const classes = {
  root: `${PREFIX}-root`,
  summary: `${PREFIX}-summary`,
  uploadActions: `${PREFIX}-uploadActions`,
  uploadBtn: `${PREFIX}-uploadBtn`,
};

const Root = styled('details')((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.summary}`]: {
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.uploadActions}`]: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.uploadBtn}`]: {
    marginRight: theme.spacing(1),
  },
}));

const FileUploadControl = (
  props: {
    files: FileItem[]
    cardinality?: number,
    accept?: string,
    uploadFn(file: File): (Promise<FileItem>|FileItem),
    onChange(files: FileItem[]): void
    label?: string
    open?: boolean
  },
): React.ReactElement => {
  const {
    files = [],
    cardinality = 1,
    accept,
    uploadFn,
    onChange,
    label = 'Files',
    open = true,
  } = props;

  const [queue, setQueue] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileListEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (files.length === 1) {
      return;
    }
    if (!fileListEl.current) {
      return;
    }
    let sortable: import('sortablejs')|null = null;
    (async () => {
      const Sortable = (await import('sortablejs')).default;
      if (!fileListEl.current) {
        return;
      }
      sortable = new Sortable(fileListEl.current, {
        handle: '.file-sortable-handle',
        draggable: '.file',
      });
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      if (sortable) {
        sortable.destroy();
      }
    };
  }, [files]);

  useEffect(() => {
    const processQueue = async () => {
      const file = queue.shift();
      if (!file) {
        return;
      }
      const fileItem = await uploadFn(file);
      onChange([...files, fileItem]);
    };
    processQueue();
  }, [queue, uploadFn, files, onChange]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const inputFiles = Array.from(e.target.files);
    if (files.length + inputFiles.length > cardinality) {
      setErrors([`You can only upload a maximum of ${cardinality} file(s)`]);
      return;
    }
    setErrors([]);
    setQueue([...queue, ...inputFiles]);
  };

  const handleFileChange = (id: string) => (file: FileItem) => {
    onChange(files.map((f) => {
      if (f.id !== id) {
        return f;
      }
      return file;
    }));
  };

  const handleFileRemove = (id: string) => () => {
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <Root className={classes.root} open={open}>
      <Typography component="summary" variant="body2" className={classes.summary}>{label}</Typography>
      <div ref={fileListEl}>
        <Grid container spacing={2}>
          {files.map((file) => {
            switch (file.type) {
              case 'image':
                return (
                  <Grid item xs={12} key={file.id}>
                    <FileImage
                      file={file}
                      onChange={handleFileChange(file.id)}
                      onDelete={handleFileRemove(file.id)}
                      disableHandle={cardinality === 1}
                    />
                  </Grid>
                );

              default:
                return (
                  <Grid item xs={12} key={file.id}>
                    <div className="file" key={file.id} data-id={file.id}>
                      <DragHandle />
                      {file.id}
                    </div>
                  </Grid>
                );
            }
          })}
        </Grid>
      </div>
      {cardinality > files.length && (
        <div className={classes.uploadActions}>
          <Button
            variant="outlined"
            color="primary"
            component="label"
            className={classes.uploadBtn}
          >
            Upload File
            <input
              type="file"
              accept={accept}
              multiple={files.length - cardinality > 1}
              onChange={handleChange}
              hidden
            />
          </Button>
          {files.length < cardinality && (
            <Typography variant="body2" component="p">
              You can upload
              {` ${cardinality - files.length}`}
              {' '}
              more file(s)
            </Typography>
          )}
        </div>
      )}
    </Root>
  );
};

export default FileUploadControl;
