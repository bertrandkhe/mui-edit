import React from 'react';
import { Block } from './Block';
import { SettingsFormProps } from './SettingsFormProps';
import { EditFormProps } from './EditFormProps';

export interface BlockType<D = any, S = any> {
    id: string,
    label: string,
    hasSettings: boolean,
    defaultData: D,
    defaultSettings: S,
    blockLabel(data: D): string,
    settingsForm: React.FunctionComponent<SettingsFormProps<D, S>> | null,
    editForm: React.FunctionComponent<EditFormProps<D, S>> | null
    view: React.FunctionComponent<Block<D, S>> | null,
}
