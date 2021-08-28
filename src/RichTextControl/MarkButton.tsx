import React from 'react';
import { styled } from '@material-ui/core/styles';
import { useSlate } from 'slate-react';
import clsx from 'clsx';
import { Editor } from 'slate';
import Button from '@material-ui/core/Button';
import { Formats } from './RichTextControl';

const PREFIX = 'MarkButton';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledButton = styled(Button)((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    background: 'white',
    boxShadow: 'none',
    border: 'none',
    borderRadius: 0,
    display: 'inline-flex',
    cursor: 'pointer',
    minWidth: 0,
    color: theme.palette.grey.A400,
    '&.active,&:hover': {
      background: '#eee',
    },
  },
}));

type MarkButtonProps = {
  format: Formats,
  children: React.ReactNode,
};

const isMarkActive = (editor: Editor, format: Formats) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: Formats) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const MarkButton: React.FunctionComponent<MarkButtonProps> = (props) => {
  const { format, children } = props;
  const editor = useSlate();

  return (
    <StyledButton
      type="button"
      className={clsx(classes.root, { active: isMarkActive(editor, format) })}
      onClick={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </StyledButton>
  );
};

export default MarkButton;
