import React, { useState } from 'react';
import { cx } from 'emotion';
import { isObject } from 'lodash';
import { SegmentSelect } from './SegmentSelect';
import { SelectableValue } from '@grafana/data';
import { useExpandableLabel, SegmentProps } from '.';

export interface SegmentAsyncProps<T> extends SegmentProps<T> {
  value?: T | SelectableValue<T>;
  loadOptions: (query?: string) => Promise<Array<SelectableValue<T>>>;
  onChange: (item: T | SelectableValue<T>) => void;
}

export function SegmentAsync<T>({
  value,
  onChange,
  loadOptions,
  Component,
  className,
  allowCustomValue,
  placeholder,
}: React.PropsWithChildren<SegmentAsyncProps<T>>) {
  const [selectPlaceholder, setSelectPlaceholder] = useState<string>('');
  const [loadedOptions, setLoadedOptions] = useState<Array<SelectableValue<T>>>([]);
  const [Label, width, expanded, setExpanded] = useExpandableLabel(false);

  if (!expanded) {
    const label = isObject(value) ? value.label : value;
    return (
      <Label
        onClick={async () => {
          setSelectPlaceholder('Loading options...');
          const opts = await loadOptions();
          setLoadedOptions(opts);
          setSelectPlaceholder(opts.length ? '' : 'No options found');
        }}
        Component={
          Component || (
            <a className={cx('gf-form-label', 'query-part', !value && placeholder && 'query-placeholder', className)}>
              {label || placeholder}
            </a>
          )
        }
      />
    );
  }

  return (
    <SegmentSelect
      value={value}
      options={loadedOptions}
      width={width}
      noOptionsMessage={selectPlaceholder}
      allowCustomValue={allowCustomValue}
      onClickOutside={() => {
        setSelectPlaceholder('');
        setLoadedOptions([]);
        setExpanded(false);
      }}
      onChange={item => {
        setSelectPlaceholder('');
        setLoadedOptions([]);
        setExpanded(false);
        onChange(isObject(value) ? item : item.value!);
      }}
    />
  );
}
