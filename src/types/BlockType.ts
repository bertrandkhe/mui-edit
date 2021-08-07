import React from 'react';
import { Block } from './Block';

export interface EditFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  onChange(data: D): void,
  onClose(): void,
}

export interface SettingsFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
}

export interface ViewProps<D, S> extends Block<D, S> {
  onChange?(block: Block<D, S>): void,
}

export interface BlockType<
  D = any,
  S = any,
  C extends Record<string, any> = Record<string, any>,
> {
  id: string,
  label: string,
  hasSettings: boolean,
  defaultData: D,
  defaultSettings: S,
  blockLabel(data: D): string,
  settingsForm: React.FunctionComponent<SettingsFormProps<D, S>> | null,
  editForm: React.FunctionComponent<EditFormProps<D, S>> | null
  view: React.FunctionComponent<ViewProps<D, S>> | null,
}
