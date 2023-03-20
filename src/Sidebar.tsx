import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Block } from './types';
import { useEditorStore } from './store';
import BlockControl from './controls/BlocksControl';

const PREFIX = 'Sidebar';
const classes = {
  root: `${PREFIX}-root`,
  headerBtn: `${PREFIX}-headerBtn`,
  title: `${PREFIX}-title`,
  header: `${PREFIX}-header`,
  body: `${PREFIX}-body`,
  footer: `${PREFIX}-footer`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    height: '100%',
    background: 'white',
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',
    transform: 'translateX(100%)',
    backgroundColor: 'white',
    transitionDuration: '.2s',
    transitionProperty: 'transform',
    overflowX: 'hidden',
    top: 0,
    left: 0,
    zIndex: 10,
    minHeight: '100%',
    maxHeight: '100%',
    position: 'absolute',
    borderLeft: `1px solid ${theme.palette.grey[100]}`,

    '&.open': {
      transform: 'translateX(0%)',
    },
  },

  [`& .${classes.headerBtn}`]: {
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },

  [`& .${classes.title}`]: {
    padding: theme.spacing(2),
  },

  [`& .${classes.header}`]: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    alignItems: 'center',
    height: 56,
  },

  [`& .${classes.body}`]: {
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 56px)',
    overflowY: 'auto',
  },

  [`& .${classes.footer}`]: {
    marginTop: 'auto',
    borderTop: '1px solid #eee',
  },
}));

export interface SidebarProps {
  title: string,
  open?: boolean,
  onBack?(): void,
  onChange?(data: Block[]): void,
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const {
    onBack,
    title = 'Blocks',
    open = true,
    onChange,
  } = props;
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const data = useEditorStore((state) => state.data);
  const setData = useEditorStore((state) => state.setData);
  const cardinality = useEditorStore((state) => state.cardinality);

  const updateData = useCallback((newData: Block[]) => {
    setData(newData);
    if (onChange) {
      onChange(newData);
    }
  }, [onChange, setData]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      setMounted(false);
    };
  }, []);

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (!onBack) {
          return;
        }
        onBack();
      });
    }, 200);
  };

  const blockTypes = useEditorStore((state) => state.blockTypes);

  return (
    <Root className={clsx(classes.root, { open: !closing && open && mounted })}>
      <div className={classes.header}>
        {onBack && (
          <Button
            onClick={handleBack}
            className={classes.headerBtn}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
        )}
        <Typography className={classes.title}>{title}</Typography>
      </div>
      <BlockControl
        blockTypes={blockTypes}
        data={data}
        onChange={updateData}
        cardinality={cardinality}
        classes={{
          root: classes.body,
          footer: classes.footer,
        }}
      />
    </Root>
  );
};

export default Sidebar;
