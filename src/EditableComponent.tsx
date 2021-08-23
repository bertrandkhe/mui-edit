/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import { useEditorContext, usePreviewWindow } from './EditorContextProvider';

type EditableComponentProps<C extends React.ElementType = 'div'> = {
  children?: React.ReactNode,
  component?: C,
  allowLineBreak?: boolean,
  onContentChange(content: string): void,
} & React.ComponentPropsWithoutRef<C>;

const EditableComponent = <
  C extends React.ElementType
>(props: EditableComponentProps<C>): ReturnType<React.FunctionComponent> => {
  const {
    component = 'div',
    children,
    onContentChange,
    allowLineBreak = false,
    ...otherProps
  } = props;
  const Component = component;
  const [editMode, setEditMode] = useState(false);
  const previewWindow = usePreviewWindow();
  const editorContext = useEditorContext();
  const editElRef = useRef<HTMLElement|null>(null);

  useEffect(() => {
    const editEl = editElRef.current;
    if (!editMode || !previewWindow || !editEl) {
      return undefined;
    }
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (editEl.contains(target)) {
        return;
      }
      if (previewWindow.document.activeElement === editEl) {
        return;
      }
      setEditMode(false);
    };
    previewWindow.addEventListener('mouseover', handleMouseOver);
    return () => {
      previewWindow.removeEventListener('mouseover', handleMouseOver);
    };
  }, [editMode, previewWindow]);

  if (editorContext.mode === 'view') {
    return (
      <Component {...otherProps}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      contentEditable
      onBlur={(e: React.FocusEvent) => {
        const htmlElement = e.target as HTMLElement;
        if (onContentChange) {
          onContentChange(htmlElement.innerText.trim());
        }
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !allowLineBreak) {
          e.preventDefault();
        }
      }}
      suppressContentEditableWarning
      {...otherProps}
    >
      {children}
    </Component>
  );
};

export default EditableComponent;
