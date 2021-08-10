import React from 'react';
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
  onChange?(block: Block<D, S, ST>): void,
}

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
  settingsForm: React.FunctionComponent<SettingsFormProps<D, S, ST>> | null,
  editForm: React.FunctionComponent<EditFormProps<D, S, ST>> | null
  view: React.FunctionComponent<ViewProps<D, S, ST>> | null,
  loader?: React.FunctionComponent|null,
  getInitialState?(block: Block<D, S, ST>, context: Record<string, any>): Promise<ST>|ST,
}
