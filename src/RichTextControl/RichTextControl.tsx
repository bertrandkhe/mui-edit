/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useCallback } from 'react';
import {
  BaseEditor, createEditor, Descendant,
} from 'slate';
import {
  Slate, Editable, withReact, ReactEditor, RenderLeafProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import IconFormatBold from '@material-ui/icons/FormatBold';
import IconFormatItalic from '@material-ui/icons/FormatItalic';
import IconFormatUnderlined from '@material-ui/icons/FormatUnderlined';

import Leaf from './Leaf';
import MarkButton from './MarkButton';
import Toolbar from './Toolbar';
import HoveringToolbar from './HoveringToolbar';

export type CustomElement = { type: 'paragraph'; children: CustomText[] }
export type CustomText = {
  text: string,
  bold?: boolean,
  italic?: boolean,
  underlined?: boolean,
}
export type Formats = 'bold' | 'italic' | 'underlined';

declare module 'slate' {
  export interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

type RichTextControlProps = {
  value: Descendant[],
  onChange(newValue: Descendant[]): void,
  inline?: boolean,
  placeholder?: string,
};

const emptyValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const defaultPlaceholder = 'Enter some text...';

const RichTextControl: React.FunctionComponent<RichTextControlProps> = (props) => {
  const {
    value,
    onChange,
    inline,
    placeholder,
  } = props;

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderLeaf = useCallback((leafProps: RenderLeafProps) => {
    const {
      leaf,
      text,
      attributes,
      children,
    } = leafProps;
    return (
      <Leaf leaf={leaf} text={text} attributes={attributes}>
        {children}
      </Leaf>
    );
  }, []);

  const Bar = inline ? HoveringToolbar : Toolbar;
  return (
    <div style={{ position: 'relative' }}>
      <Slate
        editor={editor}
        value={value.length === 0 ? emptyValue : value}
        onChange={onChange}
      >
        <Bar>
          <MarkButton format="bold">
            <IconFormatBold />
          </MarkButton>
          <MarkButton format="italic">
            <IconFormatItalic />
          </MarkButton>
          <MarkButton format="underlined">
            <IconFormatUnderlined />
          </MarkButton>
        </Bar>
        <Editable
          renderLeaf={renderLeaf}
          placeholder={placeholder || defaultPlaceholder}
        />
      </Slate>
    </div>

  );
};

export default RichTextControl;
