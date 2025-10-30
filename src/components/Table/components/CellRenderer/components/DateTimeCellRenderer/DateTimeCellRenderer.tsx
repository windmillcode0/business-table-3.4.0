import { css, cx } from '@emotion/css';
import { dateTime, dateTimeFormat, Field } from '@grafana/data';
import { FormattedValueDisplay, useTheme2 } from '@grafana/ui';
import React, { ReactElement } from 'react';

import { TEST_IDS } from '@/constants';
import { ColumnConfig } from '@/types';


/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {string | number}
   */
  value: string | number;

  /**
   * Field
   *
   * @type {Field}
   */
  field: Field;

  /**
   * Config
   *
   * @type {ColumnConfig}
   */
  config: ColumnConfig;

  /**
   * Background Color
   *
   * @type {string}
   */
  bgColor?: string;
}

/**
 * DateTime Cell Renderer
 */
export const DateTimeCellRenderer: React.FC<Props> = ({ field, value, config, bgColor }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  let formattedValue: typeof value | ReactElement = value;
  let isInvalidDate = false;
  let isRelativeTime = false;
  

  /**
   * Format date/time value based on configuration
   */
  if (field.display) {
    const displayValue = field.display(value);

    
    const { inputFormat, outputFormat, outputTimeZone} = config?.dateTimeCell?.format ??{};
    if (config.dateTimeCell?.format) {
      
      
      try {
        let date: Date | null = null;

        debugger
        if (inputFormat && inputFormat !== "DEFAULT" ) {
          const parsedDate = dateTime(value, inputFormat);
          if (parsedDate.isValid()) {
            date = parsedDate.toDate();
          }
        } else {
          if (typeof value === 'number' ) {
            date = new Date(value);
          } else if (!isNaN(value)) {
            date = new Date(parseInt(value));
          } else if (typeof value === 'string') {
            date = new Date(value);
          }
        }

        if (date && !isNaN(date.getTime())) {
          if (outputFormat) {
            let finalValue
            if (outputFormat.toLowerCase() === 'relative') {
              // Handle relative time format
              finalValue = getRelativeTimeString(date);
              isRelativeTime = true;
            } else {
              // Use Grafana's dateTimeFormat for output formatting
              finalValue = dateTimeFormat(date, { 
                format: outputFormat, 
                timeZone :outputTimeZone
              });

            }
            
            renderFormatted({displayValue:{text: finalValue}});
          } else { 
            renderFormatted({displayValue});
          }
        } else {
          renderFormatted({displayValue});
        }
      } catch (error) {
        // NOTICE: should I support fallback to error
        // console.warn('DateTime formatting error:', error);
        renderFormatted({displayValue});
        
      }
    } else {
        renderFormatted({displayValue});
    }
  }

  // return (
  //   <pre
  //     className={cx(
  //       styles.default,
  //       isRelativeTime && styles.relativeTime,
  //       isInvalidDate && styles.invalidDate,
  //       css`
  //         background: ${bgColor ? 'inherit' : theme.colors.background.primary};
  //       `
  //     )}
  //   >
  //     <span
  //       {...TEST_IDS.dateTimeCellRenderer.root.apply()}
  //       style={{
  //         color: bgColor ? theme.colors.getContrastText(bgColor) : 'inherit',
  //         background: bgColor ? 'inherit' : theme.colors.background.primary,
  //       }}
  //     >
  //       {formattedValue}
  //     </span>
  //   </pre>
  // );

  return (
    <span
      {...TEST_IDS.dateTimeCellRenderer.root.apply()}
      style={{
        color: bgColor ? theme.colors.getContrastText(bgColor) : 'inherit',
        background: bgColor ? 'inherit' : theme.colors.background.primary,
      }}
    >
      {formattedValue}
    </span>
  );  

  function renderFormatted(props) {
    let {displayValue} = props;
    // isInvalidDate = true;
    formattedValue = <FormattedValueDisplay value={displayValue} />;
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return diffSeconds < 0 ? `${Math.abs(diffSeconds)}s ago` : `in ${diffSeconds}s`;
  } else if (Math.abs(diffMinutes) < 60) {
    return diffMinutes < 0 ? `${Math.abs(diffMinutes)}m ago` : `in ${diffMinutes}m`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours < 0 ? `${Math.abs(diffHours)}h ago` : `in ${diffHours}h`;
  } else {
    return diffDays < 0 ? `${Math.abs(diffDays)}d ago` : `in ${diffDays}d`;
  }
}