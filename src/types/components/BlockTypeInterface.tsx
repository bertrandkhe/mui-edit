import React from 'react';
import { BlockDataInterface, BlockInterface } from '@/types/components/BlockInterface';

interface SettingsFormProps<D,S> extends BlockInterface<D, S> {
    onChange(settings: S): void,
}

interface EditFormProps<D,S> extends BlockInterface<D, S> {
    onChange(data: D): void,
    onClose(): void,
    editorContainer: HTMLElement,
}

export interface BlockTypeInterface<D,S> {
    id: string,
    label: string,
    hasSettings: boolean,
    defaultData: D,
    defaultSettings: S,
    blockLabel(data: BlockDataInterface): string,
    settingsForm?: React.FunctionComponent<SettingsFormProps<D, S>>,
    editForm: React.FunctionComponent<EditFormProps<D,S>>
    view: React.FunctionComponent<BlockInterface<D, S>>
}
