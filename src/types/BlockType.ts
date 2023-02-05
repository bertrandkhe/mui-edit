import React from 'react';
import { LoadableComponent } from '@loadable/component';
import {
  Block,
} from './Block';

export interface EditFormProps<
  D,
  S,
> extends Partial<Block<D, S>> {
  id: string
  data: D,
  onChange(dataOrFn: D | ((prevData: D) => D)): void,
  onClose(): void,
}

export interface SettingsFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settingsOrFn: S | ((prevSettings: S) => S)): void,
}

export interface ViewProps<
  D,
  S,
  > extends Block<D, S> {
  contentEditable?: boolean,
  onDataChange(data: D): void,
  onSettingsChange(settings: S): void,
}

export interface BlockType<
  D = any,
  S = any,
> {
  id: string,
  label: string,
  defaultData: D,
  defaultSettings: S,
  blockLabel(data: D): React.ReactNode,
  settingsForm: LoadableComponent<SettingsFormProps<D, S>>
    | React.FunctionComponent<SettingsFormProps<D, S>>
    | null,
  editForm: LoadableComponent<EditFormProps<D, S>>
    | React.FunctionComponent<EditFormProps<D, S>>
    | null,
  view: LoadableComponent<ViewProps<D, S>>
    | React.FunctionComponent<ViewProps<D, S>>
    | null,
  cardinality?: number,
  disabled?: boolean,
  suspense?: React.SuspenseProps,
}
