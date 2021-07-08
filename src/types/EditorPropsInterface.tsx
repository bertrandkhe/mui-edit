import {BlockDataInterface, BlockInterface, BlockSettingsInterface} from "@/types/BlockInterface";
import {BlockTypeInterface} from "@/types/BlockTypeInterface";

interface EditorSidebarPropsInterface {
  container: HTMLElement,
  title?: string
  open?: boolean,
}

export interface EditorPropsInterface {
  initialData: BlockInterface<BlockDataInterface, BlockSettingsInterface>[],
  blockTypes: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>[],
  disableEditor?: boolean,
  disablePreview?: boolean,
  sidebarProps: EditorSidebarPropsInterface,
  onChange?(data: BlockInterface<BlockDataInterface, BlockSettingsInterface>[]): void,
}