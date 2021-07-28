import React from 'react';
import { Block } from './Block';
import { SettingsFormProps } from './SettingsFormProps';
import { EditFormProps } from './EditFormProps';

export interface BlockType<
  D = any,
  S = any,
  C extends Record<string, any> = Record<string, any>
> {
  id: string,
  label: string,
  hasSettings: boolean,
  defaultData: D,
  defaultSettings: S,
  blockLabel(data: D): string,
  settingsForm: React.FunctionComponent<SettingsFormProps<D, S, C>> | null,
  editForm: React.FunctionComponent<EditFormProps<D, S, C>> | null
  view: React.FunctionComponent<{
    onChange?(block: Block<D, S>): void,
    context: C,
  } & Block<D, S>> | null,
}
