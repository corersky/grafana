import { VizOrientation, ValueMapping, Threshold, StatID } from '@grafana/ui';

export interface SingleStatBaseOptions {
  valueMappings: ValueMapping[];
  thresholds: Threshold[];
  valueOptions: SingleStatValueOptions;
  orientation: VizOrientation;
}

export interface SingleStatValueOptions {
  unit: string;
  suffix: string;
  stat: string;
  prefix: string;
  decimals?: number | null;
}

export interface SparklineOptions {
  show: boolean;
  full: boolean; // full height
  fillColor: string;
  lineColor: string;
}

// Structure copied from angular
export interface SingleStatOptions extends SingleStatBaseOptions {
  prefixFontSize?: string;
  valueFontSize?: string;
  postfixFontSize?: string;

  colorBackground?: boolean;
  colorValue?: boolean;
  colorPrefix?: boolean;
  colorPostfix?: boolean;

  sparkline: SparklineOptions;
}

export const defaults: SingleStatOptions = {
  sparkline: {
    show: true,
    full: false,
    lineColor: 'rgb(31, 120, 193)',
    fillColor: 'rgba(31, 118, 189, 0.18)',
  },

  valueOptions: {
    prefix: '',
    suffix: '',
    decimals: null,
    stat: StatID.mean,
    unit: 'none',
  },
  valueMappings: [],
  thresholds: [{ index: 0, value: -Infinity, color: 'green' }, { index: 1, value: 80, color: 'red' }],
  orientation: VizOrientation.Auto,
};
