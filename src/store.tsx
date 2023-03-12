import { create, createStore, useStore } from 'zustand';
import React, { useContext, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { AlertProps, SnackbarProps } from '@mui/material';
import { PreviewInstance } from './Preview/PreviewIframe';
import { Block, BlockType } from './types';
import ObjectStorageAdapter from './types/ObjectStorageAdapter';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Config, ConfigStorageAdapter } from './types/ConfigStorageAdapter';

type PreviewState = {
  mode: 'view' | 'edit',
  setMode(mode: PreviewState['mode']): void,
  data: Block[],
  setData(data: Block[]): void,
  getData(): Block[],
};

export const usePreviewStore = create<PreviewState>((set, get) => ({
  mode: 'view',
  setMode(mode) {
    set({ mode });
  },
  data: [],
  setData(data) {
    set({ data });
  },
  getData() {
    return get().data;
  },
}));

export type EditorState = {
  isFullScreen: boolean,
  isNested: boolean,
  cardinality: number,
  blockTypes: BlockType[],
  setBlockTypes(newTypes: BlockType[]): void,
  data: Block[],
  setData(
    data: Block[]
    | (
      (prevData: Block[]) => Block[]),
      areEqual?: ((prevData: Block[], newData: Block[]) => boolean)
    ): Block[],
  parseUnsafeData(data: unknown[] | string): Promise<{
    success: true,
    data: Block[],
  } | {
    success: false,
    errors: {
      issues: z.ZodIssue[],
    }[],
  }>,
  importData(rawData: string): Promise<{
    success: true,
    data: Block[],
  } | {
    success: false,
    errors: {
      issues: z.ZodIssue[],
    }[],
  }>,
  allowedOrigins: string[],
  setAllowedOrigins(newOrigins: string[]): void,
  previewSrc: string,
  previewWidth: 'sm' | 'md' | 'lg',
  setPreviewWidth(width: EditorState['previewWidth']): void,
  previewInstance: PreviewInstance | null,
  setPreviewInstance(instance: PreviewInstance): void,
  alertMessages: {
    id: string,
    severity: AlertProps['severity'],
    message: string | string[],
    autoHideDuration: number,
    visible: boolean,
  }[],
  addAlertMessages(messages: {
    severity: AlertProps['severity'],
    message: string | string[],
    autoHideDuration?: SnackbarProps['autoHideDuration'],
  }[]): void,
  removeAlertMessage(id: string): void,
  storage?: {
    object?: ObjectStorageAdapter,
    config?: ConfigStorageAdapter,
  },
};

type EditorStore = ReturnType<typeof createEditorStore>;

const createEditorStore = (
  initialState: Partial<
    Omit<EditorState, 'setBlockTypes' | 'setData' | 'setAllowedOrigins' | 'setPreviewWidth' | 'setPreviewInstance'>
  > = {},
) => {
  const {
    isFullScreen = false,
    isNested = false,
    cardinality = -1,
    blockTypes = [],
    data = [],
    allowedOrigins = [],
    previewSrc = '',
    previewWidth = 'lg',
    previewInstance = null,
    storage,
  } = initialState;
  return (
    createStore<EditorState>((set, get) => ({
      isFullScreen,
      isNested,
      cardinality,
      blockTypes,
      setBlockTypes(newTypes) {
        const prevTypes = get().blockTypes;
        const prevTypesId = prevTypes.map((t) => t.id).join('/');
        const sortedNewTypes = newTypes.sort((a, b) => (a.label < b.label ? -1 : 1));
        const sortedNewTypesId = sortedNewTypes.sort().map((t) => t.id).join('/');
        if (sortedNewTypesId !== prevTypesId) {
          set({ blockTypes: sortedNewTypes });
        }
      },
      data,
      onDataChange: null,
      async parseUnsafeData(unsafeData) {
        let parsedUnsafeData = null;
        const issues: z.ZodIssue[] = [];
        if (Array.isArray(unsafeData)) {
          parsedUnsafeData = unsafeData;
        } else if (typeof unsafeData === 'string') {
          if (!unsafeData.toLowerCase().includes('<script>')) {
            try {
              parsedUnsafeData = JSON.parse(unsafeData);
            } catch (err) {
              issues.push({
                fatal: true,
                code: 'custom',
                message: (err as Error).message,
                path: [],
              });
            }
          }
        } else {
          issues.push({
            fatal: true,
            code: 'custom',
            message: 'Data is not valid.',
            path: [],
          });
        }
        if (issues.length > 0) {
          return {
            success: false,
            errors: [{
              issues,
            }],
          };
        }
        const blockTypesIds = get().blockTypes.map((bt) => bt.id);
        const docSchema = z.array(z.object({
          id: z.string(),
          type: z.string().refine(
            (type) => blockTypesIds.includes(type),
            (type) => ({ message: `Block type must be one of: ${blockTypesIds.join(', ')}. Current value: ${type}` }),
          ),
          data: z.object({}).passthrough().nullable(),
          settings: z.object({}).passthrough().nullable(),
          meta: z.object({
            created: z.number(),
            changed: z.number(),
          }).passthrough(),
        }));
        const result = docSchema.safeParse(parsedUnsafeData);
        if (!result.success) {
          return {
            success: false,
            errors: [result.error],
          };
        }
        const maybeSafeData = result.data;
        const results = await Promise.all(maybeSafeData.map(async (block, i) => {
          const blockType = blockTypes.find((bt) => bt.id === block.type) as BlockType;
          if (blockType.getDataSchema && block.data) {
            const schema = await blockType.getDataSchema();
            const blockResult = schema.safeParse(block.data);
            if (!blockResult.success) {
              return blockResult;
            }
            maybeSafeData[i].data = blockResult.data;
          }
          if (blockType.getSettingsSchema && block.settings) {
            const schema = await blockType.getSettingsSchema();
            const blockResult = schema.safeParse(block.settings);
            if (!blockResult.success) {
              return blockResult;
            }
            maybeSafeData[i].settings = blockResult.data;
          }
          return undefined;
        }));
        const allErrors: z.ZodError[] = [];
        results.forEach((r) => {
          if (r && !r.success) {
            allErrors.push(r.error);
          }
        });
        if (allErrors.length === 0) {
          return {
            success: true,
            data: maybeSafeData,
          };
        }
        return {
          success: false,
          errors: allErrors,
        };
      },
      async importData(rawData) {
        const result = await get().parseUnsafeData(rawData);
        if (result.success) {
          get().setData(result.data);
          return result;
        }
        return result;
      },
      setData(argData, userEqualityFn) {
        const prevData = get().data;
        const newData = Array.isArray(argData) ? argData : argData(prevData);
        const equalityFn = userEqualityFn || ((a: Block[], b: Block[]) => {
          const aId = a.map((block) => `${block.id}:${block.meta.changed}`).join('/');
          const bId = b.map((block) => `${block.id}:${block.meta.changed}`).join('/');
          return aId === bId;
        });
        const selected = equalityFn(prevData, newData) ? prevData : newData;
        set({ data: selected });
        return selected;
      },
      allowedOrigins,
      setAllowedOrigins(newOrigins) {
        const prevOrigins = get().allowedOrigins;
        const sortedNewOrigins = newOrigins.sort();
        if (prevOrigins.join(',') !== sortedNewOrigins.join(',')) {
          set({ allowedOrigins: sortedNewOrigins });
        }
      },
      previewSrc,
      previewWidth,
      setPreviewWidth(width) {
        set({ previewWidth: width });
      },
      previewInstance,
      setPreviewInstance(instance) {
        set({ previewInstance: instance });
      },
      alertMessages: [],
      addAlertMessages(messages) {
        const prevMessages = get().alertMessages;
        set({
          alertMessages: [
            ...prevMessages,
            ...messages.map((m) => ({
              ...m,
              autoHideDuration: m.autoHideDuration || 3000,
              id: uuidv4(),
              visible: false,
            }))],
        });
      },
      removeAlertMessage(id: string) {
        const prevMessages = get().alertMessages;
        set({ alertMessages: prevMessages.filter((m) => m.id !== id) });
      },
      storage,
    })));
};

const EditorContext = React.createContext<EditorStore | void>(undefined);
export const Provider: React.FC<{
  children: React.ReactNode,
  data?: Block[] | void,
  queryClient?: QueryClient,
} & Omit<Partial<EditorState>, 'data'>> = (props) => {
  const { children, queryClient: propQueryClient, ...editorState } = props;
  const editorStoreRef = useRef<EditorStore>();
  if (!editorStoreRef.current) {
    editorStoreRef.current = createEditorStore(editorState as EditorState);
  }
  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = propQueryClient || new QueryClient();
  }

  useEffect(() => {
    const {
      data,
      allowedOrigins,
      blockTypes,
      ...other
    } = editorState;
    const editorStore = editorStoreRef.current as EditorStore;
    const currentState = editorStore.getState();
    if (data) {
      currentState.setData(data);
    }
    if (allowedOrigins) {
      currentState.setAllowedOrigins(allowedOrigins);
    }
    if (blockTypes) {
      currentState.setBlockTypes(blockTypes);
    }
    editorStore.setState(other);
  }, [editorState]);

  return (
    <EditorContext.Provider value={editorStoreRef.current}>
      <QueryClientProvider
        client={queryClientRef.current}
      >
        {children}
      </QueryClientProvider>
    </EditorContext.Provider>
  );
};

const rootEditorStore = createEditorStore();
export const useEditorStore = (<U, >(selector: ((state: EditorState) => U)): U => {
  const store = useContext(EditorContext) || rootEditorStore;
  return useStore(store, selector);
});

export const useObjectStorage = () => {
  return useEditorStore((state) => state.storage?.object);
};

let _configStorage: ConfigStorageAdapter;
export const useConfigStorage = (): ConfigStorageAdapter | undefined => {
  const configStorage = useEditorStore((state) => state.storage?.config);
  const objectStorage = useEditorStore((state) => state.storage?.object);
  if (configStorage) {
    return configStorage;
  }
  if (!objectStorage) {
   return undefined;
  }
  if (!_configStorage) {
    const prefix = '.config/mui-edit';
    const getFilename = (id: string) => `${id}.json`;
    _configStorage = {
      async get<Data = any>(id: string) {
        const url = await objectStorage.objectUrl({
          key: `${prefix}/${getFilename(id)}`,
        });
        const response = await fetch(url);
        if (response.status !== 200) {
          throw new Error(`Fail to get config data for config "${id}"`);
        }
        const config = await response.json() as Config<Data>;
        return config;
      },
      async list() {
        const results = await objectStorage.ls({
          prefix,
        });
        return results.objects.map((o) => o.name.slice(0, -5));
      },
      async save(config) {
        const filename = getFilename(config.id);
        const file = new File(
          [JSON.stringify({
            id: config.id,
            revisionId: (config.revisionId || 0) + 1,
            data: config.data,
          })],
          filename,
        );
        await objectStorage.upload({
          file,
          key: `${prefix}${filename}`,
          acl: 'private',
          overwrite: true,
        });
        return config;
      },
      async delete(id: string) {
        await objectStorage.delete({
          key: `${prefix}/${getFilename(id)}`,
        });
      }
    };
  }
  return _configStorage;
}

const ErrorConfigStorageNotDefined = new Error('Config storage is not defined');
export const useConfigStorageQueryClient = () => {
  const storage = useConfigStorage();
  const queryClient = useQueryClient();
  const getStorage = () => {
    if (!storage) {
      throw ErrorConfigStorageNotDefined;
    }
    return storage;
  }
  return {
    useGetQuery<ConfigData>(
      id: string,
      options: { enabled?: boolean } = {},
    ) {
      const query = useQuery({
        queryKey: ['configStorage.get', id],
        async queryFn() {
          const config = await getStorage().get<ConfigData>(id);
          return config;
        },
        ...options,
      });
      return query;
    },
    useListQuery(
      options: { enabled?: boolean } = {},
    ) {
      return useQuery({
        queryKey: ['configStorage.list'],
        queryFn() {
          return getStorage().list();
        },
        ...options,
      });
    },
    useDeleteMutation(options?: {
      onSuccess?(id: string): void,
    }) {
      return useMutation({
        async mutationFn(id: string) {
          await getStorage().delete(id);
          return id;
        },
        onSuccess(id) {
          queryClient.invalidateQueries([
            'configStorage.list',
            'configStorage.get', id,
          ]);
          if (options?.onSuccess) options.onSuccess(id);
        },
      })
    },
    useSaveMutation(options?: {
      onSuccess?(config: Config): void,
    }) {
      return useMutation({
        mutationFn(config: Config) {
          if (!storage) {
            throw ErrorConfigStorageNotDefined;
          }
          return storage.save(config);
        },
        onSuccess(config) {
          queryClient.invalidateQueries([
            'configStorage.list',
            'configStorage.get', config.id,
          ]);
          if (options?.onSuccess) options.onSuccess(config);
        },
      });
    },
  };
}

export type ConfigTemplate = Config<{
  name: string,
  blocks: Block[],
}>;
