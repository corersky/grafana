import React, { useState, memo } from 'react';
import { useMedia } from 'react-use';
import { css } from 'emotion';
import { useTheme, stylesFactory } from '../../../themes';
import { GrafanaTheme, TimeOption, TimeRange, TimeZone, isDateTime } from '@grafana/data';
import { TimePickerTitle } from './TimePickerTitle';
import { TimeRangeForm } from './TimeRangeForm';
import { CustomScrollbar } from '../../CustomScrollbar/CustomScrollbar';
import { TimeRangeList } from './TimeRangeList';
import { mapRangeToTimeOption } from './mapper';
import { getThemeColors } from './colors';

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    container: css`
      display: flex;
      background: ${colors.background};
      box-shadow: 0px 4px 4px ${colors.shadow};
      position: absolute;
      z-index: ${theme.zIndex.modal};
      width: 546px;
      height: 381px;
      top: 37px;
      margin-left: -322px;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        width: 218px;
        margin-left: 6px;
      }
    `,
    leftSide: css`
      display: flex;
      flex-direction: column;
      border-right: 1px solid ${colors.border};
      width: 60%;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        display: none;
      }
    `,
    rightSide: css`
      width: 40% !important;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        width: 100% !important;
      }
    `,
  };
});

const getNarrowScreenStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    header: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${colors.border};
      padding: 7px 9px 7px 9px;
    `,
    body: css`
      border-bottom: 1px solid ${colors.border};
      background: ${colors.background};
      box-shadow: inset 0px 2px 2px ${colors.shadow};
    `,
    form: css`
      padding: 7px 9px 7px 9px;
    `,
  };
});

const getFullScreenStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    container: css`
      padding-top: 9px;
      padding-left: 11px;
      padding-right: 20%;
    `,
    title: css`
      margin-bottom: 11px;
    `,
    recent: css`
      padding-top: 7px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    `,
  };
});

const getEmptyListStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    container: css`
      background-color: ${colors.background};
      padding: 12px;
      margin: 12px;
    `,
    section: css`
      margin-bottom: 12px;
    `,
    link: css`
      color: ${theme.colors.linkExternal};
    `,
  };
});

interface Props {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
  timeZone?: TimeZone;
  quickOptions?: TimeOption[];
  otherOptions?: TimeOption[];
  history?: TimeRange[];
}

interface FormProps extends Omit<Props, 'history'> {
  visible: boolean;
  historyOptions?: TimeOption[];
}

export const TimePickerContent: React.FC<Props> = props => {
  const theme = useTheme();
  const isFullscreen = useMedia(`(min-width: ${theme.breakpoints.lg})`);
  const styles = getStyles(theme);
  const { quickOptions = [], otherOptions = [] } = props;
  const historyOptions = mapToHistoryOptions(props.history);

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <FullScreenForm {...props} visible={isFullscreen} historyOptions={historyOptions} />
      </div>
      <CustomScrollbar className={styles.rightSide}>
        <NarrowScreenForm {...props} visible={!isFullscreen} historyOptions={historyOptions} />
        <TimeRangeList
          title="Relative time ranges"
          options={quickOptions}
          onSelect={props.onChange}
          value={props.value}
        />
        <TimeRangeList
          title="Other quick ranges"
          options={otherOptions}
          onSelect={props.onChange}
          value={props.value}
        />
      </CustomScrollbar>
    </div>
  );
};

const NarrowScreenForm: React.FC<FormProps> = props => {
  if (!props.visible) {
    return null;
  }

  const theme = useTheme();
  const styles = getNarrowScreenStyles(theme);
  const isAbsolute = isDateTime(props.value.raw.from) || isDateTime(props.value.raw.to);
  const [collapsed, setCollapsed] = useState(isAbsolute);

  return (
    <>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <TimePickerTitle>Absolute time range</TimePickerTitle>
        {collapsed ? <i className="fa fa-caret-up" /> : <i className="fa fa-caret-down" />}
      </div>
      {collapsed && (
        <div className={styles.body}>
          <div className={styles.form}>
            <TimeRangeForm
              value={props.value}
              onApply={props.onChange}
              timeZone={props.timeZone}
              showCalendarOn="ClickOnInputButton"
            />
          </div>
          <TimeRangeList
            title="Recently used absolute ranges"
            options={props.historyOptions || []}
            onSelect={props.onChange}
            value={props.value}
            placeholderEmpty={null}
          />
        </div>
      )}
    </>
  );
};

const FullScreenForm: React.FC<FormProps> = props => {
  if (!props.visible) {
    return null;
  }

  const theme = useTheme();
  const styles = getFullScreenStyles(theme);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <TimePickerTitle>Absolute time range</TimePickerTitle>
        </div>
        <TimeRangeForm
          value={props.value}
          timeZone={props.timeZone}
          onApply={props.onChange}
          showCalendarOn="FocusOnInput"
        />
      </div>
      <div className={styles.recent}>
        <TimeRangeList
          title="Recently used absolute ranges"
          options={props.historyOptions || []}
          onSelect={props.onChange}
          value={props.value}
          placeholderEmpty={<EmptyRecentList />}
        />
      </div>
    </>
  );
};

const EmptyRecentList = memo(() => {
  const theme = useTheme();
  const styles = getEmptyListStyles(theme);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span>
          It looks like you haven't used this timer picker before. As soon as you enter some time intervals, recently
          used intervals will appear here.
        </span>
      </div>
      <div>
        <a className={styles.link} href="#" target="_new">
          Read the documentation
        </a>
        <span> to find out more about how to enter custom tiem ranges.</span>
      </div>
    </div>
  );
});

function mapToHistoryOptions(ranges?: TimeRange[]): TimeOption[] {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return [];
  }
  return ranges.slice(ranges.length - 4).map(mapRangeToTimeOption);
}
