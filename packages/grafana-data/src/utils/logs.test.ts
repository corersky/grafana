import { LogLevel } from '../types/logs';
import { getLogLevel, calculateLogsLabelStats } from './logs';

describe('getLoglevel()', () => {
  it('returns no log level on empty line', () => {
    expect(getLogLevel('')).toBe(LogLevel.unknown);
  });

  it('returns no log level on when level is part of a word', () => {
    expect(getLogLevel('this is information')).toBe(LogLevel.unknown);
  });

  it('returns same log level for long and short version', () => {
    expect(getLogLevel('[Warn]')).toBe(LogLevel.warning);
    expect(getLogLevel('[Warning]')).toBe(LogLevel.warning);
    expect(getLogLevel('[Warn]')).toBe('warning');
  });

  it('returns log level on line contains a log level', () => {
    expect(getLogLevel('warn: it is looking bad')).toBe(LogLevel.warn);
    expect(getLogLevel('2007-12-12 12:12:12 [WARN]: it is looking bad')).toBe(LogLevel.warn);
  });

  it('returns first log level found', () => {
    expect(getLogLevel('WARN this could be a debug message')).toBe(LogLevel.warn);
  });
});

describe('calculateLogsLabelStats()', () => {
  test('should return no stats for empty rows', () => {
    expect(calculateLogsLabelStats([], '')).toEqual([]);
  });

  test('should return no stats of label is not found', () => {
    const rows = [
      {
        entry: 'foo 1',
        labels: {
          foo: 'bar',
        },
      },
    ];

    expect(calculateLogsLabelStats(rows as any, 'baz')).toEqual([]);
  });

  test('should return stats for found labels', () => {
    const rows = [
      {
        entry: 'foo 1',
        labels: {
          foo: 'bar',
        },
      },
      {
        entry: 'foo 0',
        labels: {
          foo: 'xxx',
        },
      },
      {
        entry: 'foo 2',
        labels: {
          foo: 'bar',
        },
      },
    ];

    expect(calculateLogsLabelStats(rows as any, 'foo')).toMatchObject([
      {
        value: 'bar',
        count: 2,
      },
      {
        value: 'xxx',
        count: 1,
      },
    ]);
  });
});
