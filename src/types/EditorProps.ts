import { Theme } from '@material-ui/core/styles';
import { Block } from './Block';
import { SidebarProps } from './SidebarProps';
import { BlockType } from './BlockType';

export interface EditorProps {
  initialData: Block[],
  blockTypes: BlockType[],
  disableEditor?: Readonly<boolean>,
  disablePreview?: Readonly<boolean>,
  sidebarProps?: Partial<SidebarProps>,
  onChange?(data: Block[]): void,
  onFullScreen?(): void,
  onFullScreenExit?(): void,
  isFullScreen?: boolean,
  editorTheme?: Theme,
  previewTheme?: Theme,
}
