import React from 'react';
import { BlockInterface } from '@/types/components/BlockInterface';
import { SettingsFormPropsInterface } from '@/types/components/SettingsFormPropsInterface';
import { EditFormPropsInterface } from '@/types/components/EditFormPropsInterface';

export interface BlockTypeInterface<D, S> {
    id: string,
    label: string,
    hasSettings: boolean,
    defaultData: D,
    defaultSettings: S,
    blockLabel(data: D): string,
    settingsForm: React.FunctionComponent<SettingsFormPropsInterface<D, S>>,
    editForm: React.FunctionComponent<EditFormPropsInterface<D, S>>
    view: React.FunctionComponent<BlockInterface<D, S>>
}

export type BlockType = BlockTypeInterface<any, any>
