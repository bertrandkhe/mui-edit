import { create } from 'zustand';
import { Block, BlockType } from './types';

type PreviewState = {
  width: 'sm' | 'md' | 'lg',
  setWidth(width: PreviewState['width']): void,
  iframeEl: HTMLIFrameElement | null,
  setIframeEl(iframeEl: HTMLIFrameElement): void,
  iframeSrc: string,
  setIframeSrc(src: string): void,
};

export const usePreviewStore = create<PreviewState>((set) => ({
  width: 'sm',
  setWidth(newWidth) {
    set({
      width: newWidth,
    });
  },
  iframeEl: null,
  setIframeEl(iframeEl) {
    set({ iframeEl });
  },
  iframeSrc: '',
  setIframeSrc(src) {
    set({ iframeSrc: src });
  },
}));

type EditorState = {
  mode: 'edit' | 'view',
  isControlled: boolean,
  setIsControlled(isControlled: boolean): void,
  isFullScreen: boolean,
  cardinality: number,
  blockTypes: BlockType[],
  data: Block[],
  setData(data: Block[]): void,
  setState(state: Partial<
    Pick<EditorState, 'isFullScreen' | 'enterFullScreen' | 'exitFullScreen'>
  >): void,
  setEnterFullScreenFn(fn: EditorState['enterFullScreen']): void,
  setExitFullScreenFn(fn: EditorState['exitFullScreen']): void,
  enterFullScreen: (() => void) | null,
  exitFullScreen: (() => void) | null,
};

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'edit',
  isControlled: false,
  setIsControlled(isControlled) {
    set({ isControlled });
  },
  isFullScreen: false,
  cardinality: -1,
  blockTypes: [],
  data: [],
  setState(state) {
    set(state);
  },
  setData(data) {
    set({ data });
  },
  setEnterFullScreenFn(fn) {
    set({ enterFullScreen: fn });
  },
  setExitFullScreenFn(fn) {
    set({ exitFullScreen: fn });
  },
  enterFullScreen: null,
  exitFullScreen: null,
}));
