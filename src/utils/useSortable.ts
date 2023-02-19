import type TSortable from 'sortablejs';
import { SortableEvent, SortableOptions as BaseSortableOptions } from 'sortablejs';
import { useEffect, useRef, useState } from 'react';

type SortableOptions = Omit<
  BaseSortableOptions,
  'onStart' | 'onEnd' | 'onAdd' | 'onClone' | 'onChoose' | 'onUnchoose' | 'onUpdate' | 'onSort' | 'onRemove' | 'onFilter' | 'onChange'
> & {
  onStart?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onEnd?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onAdd?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onClone?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onChoose?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onUnchoose?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onUpdate?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onSort?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onRemove?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onFilter?: ((event: SortableEvent, instance: TSortable) => void) | undefined;
  onChange?: ((evt: SortableEvent) => void) | undefined;
}

const useSortable = (options: SortableOptions) => {
  const { disabled } = options;
  const sortableRef = useRef<TSortable | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const containerRef = useRef(container);
  containerRef.current = container;
  const optionsRef = useRef<SortableOptions>(options);

  useEffect(() => {
    if (disabled || !container || sortableRef.current) {
      return;
    }
    let newSortable: TSortable | null = null;
    let active = true;
    (async () => {
      const Sortable = (await import('sortablejs')).default;
      if (!active) {
        return;
      }
      const currOptions = optionsRef.current;
      newSortable = new Sortable(container, {
        ...currOptions as BaseSortableOptions,
        disabled: true,
      });
      Object.keys(currOptions).forEach((key) => {
        const optionKey = key as keyof SortableOptions;
        const optionVal = currOptions[key];
        if (!key.startsWith('on') || key === 'onMove' || !newSortable) {
          return;
        }
        newSortable.option(optionKey, (ev: SortableEvent) => {
          if (!active || disabled) {
            return;
          } 
          optionVal(ev, newSortable);
        });
      });
      newSortable.option('disabled', false);
      sortableRef.current = newSortable;
   })();
    return () => {
      active = false;
      if (newSortable) {
        newSortable.destroy();
        sortableRef.current = null;
      }
    };
  }, [container, disabled]);

  return {
    containerRef(node: HTMLElement | null) {
      if (!containerRef.current) {
        setContainer(node);
      }
    },
    getInstance() {
      return sortableRef.current;
    },
  };
}

export default useSortable; 
