import React from 'react';
import {
  Block,
  Relationships,
} from './Block';

export interface EditFormProps<
  D,
  S,
  R extends Relationships = Relationships,
> extends Partial<Block<D, S, R>> {
  id: string
  data: D,
  onChange(data: D): void,
  onRelsChange(relationships: Relationships): void,
  onClose(): void,
}

export interface SettingsFormProps<D, S> extends Partial<Block<D, S>> {
  id: string
  data: D,
  settings: S
  onChange(settings: S): void,
}

export interface ViewProps<
  D,
  S,
  R extends Relationships = Relationships,
  ST = any,
  > extends Block<D, S, R, ST> {
  onChange?(block: Block<D, S, R>): void,
}

export interface BlockType<
  D = any,
  S = any,
  R extends Relationships = Relationships,
  ST = any,
> {
  id: string,
  label: string,
  hasSettings: boolean,
  defaultData: D,
  defaultSettings: S,
  defaultRelationships?: R,
  blockLabel(data: D): string,
  settingsForm: React.FunctionComponent<SettingsFormProps<D, S>> | null,
  editForm: React.FunctionComponent<EditFormProps<D, S, R>> | null
  view: React.FunctionComponent<ViewProps<D, S, R, ST>> | null,
  loader?: React.FunctionComponent|null,
  getInitialState?(block: Block<D, S, R, ST>, context: Record<string, any>): Promise<ST>|ST,
}
