import React from 'react';
import { LoadableComponent } from '@loadable/component';
import {
  Block,
} from './Block';

export interface EditFormProps<
  D,
  S,
  ST = any,
> extends Partial<Block<D, S, ST>> {
  id: string
  data: D,
  onChange(data: D): void,
  onClose(): void,
}

export interface SettingsFormProps<D, S, ST = any> extends Partial<Block<D, S, ST>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
}

export interface ViewProps<
  D,
  S,
  ST = any,
  > extends Block<D, S, ST> {
  onDataChange?(data: D): void,
  onSettingsChange?(settings: S): void,
}

export type EditorContext = Record<string, any>;

export interface BlockType<
  D = any,
  S = any,
  ST = any,
> {
  id: string,
  label: string,
  hasSettings: boolean,
  defaultData: D,
  defaultSettings: S,
  blockLabel(data: D): string,
  settingsForm: LoadableComponent<SettingsFormProps<D, S, ST>>
    | React.FunctionComponent<SettingsFormProps<D, S, ST>>
    | null,
  editForm: LoadableComponent<EditFormProps<D, S, ST>>
    | React.FunctionComponent<EditFormProps<D, S, ST>>
    | null,
  view: LoadableComponent<ViewProps<D, S, ST>>
    | React.FunctionComponent<ViewProps<D, S, ST>>
    | null,
  loader?: React.FunctionComponent|null,
  getInitialState?(block: Block<D, S, ST>, context: EditorContext): Promise<ST>|ST,
  cardinality?: number,
  disabled?: boolean,
}
