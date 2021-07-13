import React from 'react';
import { Block } from '@/types/Block';
import { SettingsFormProps } from '@/types/SettingsFormProps';
import { EditFormProps } from '@/types/EditFormProps';

export interface BlockType<D = any, S = any> {
    id: string,
    label: string,
    hasSettings: boolean,
    defaultData: D,
    defaultSettings: S,
    blockLabel(data: D): string,
    settingsForm: React.FunctionComponent<SettingsFormProps<D, S>>,
    editForm: React.FunctionComponent<EditFormProps<D, S>>
    view: React.FunctionComponent<Block<D, S>>
}
